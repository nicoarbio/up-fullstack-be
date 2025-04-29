import mongoose from "mongoose";
import { DateTime } from 'luxon';
import { Order } from "@model/order.model";
import { Booking } from "@model/booking.model";
import { Accessory, DiscountType, ExtraType, Product, RuleType } from "@enum/business-rules.enum";
import { ProductAvailability } from "@controller/services.controller";
import { JwtPayload } from "@service/jwt-handler.service";
import { getBusinessRules } from "@service/business-rules.cache";
import { getAvailabilityForProductFromFirstSlot } from "@service/services.service";

export type BookingRequest = {
    slotStart: DateTime;
    product: Product;
    passengers: {
        fullName: string;
        birthdate: DateTime;
    }[];
}

export type BookingValidationRequest = {
    slotStart: DateTime;
    product: Product;
    passengersAmount: number;
}

type BookingValidationResult = {
    slotStart: DateTime;
    slotEnd: DateTime;
    product: {
        type: Product;
        stockId: string;
        price: number;
    };
    accessories: {
        passengerIndex: number;
        type: Accessory;
        stockId: string;
        price: number;
    }[];
    price: number;
}

type Rule<T> = {
    name: T;
    type: RuleType;
    value: number;
    price: number;
}

type ValidationResult = SuccessOrderValidation | ErrorOrderValidation;
type SuccessOrderValidation = {
    bookings: BookingValidationResult[];
    totalPrice: number;
    extras: Rule<ExtraType>[];
    totalExtras: number;
    discounts: Rule<DiscountType>[];
    totalDiscount: number;
    finalTotal: number;
};
export type ErrorOrderValidation = {
    outOfStock: [{
        productId: Product,
        slotStart: DateTime,
        missingProduct: Product | null,
        missingAccessory: Accessory[]
    }];
}

export async function validateOrderContent(
    requestedBookings: BookingValidationRequest[],
    extraIds: ExtraType[]
): Promise<ValidationResult> {

    const errorOrderValidation = {} as ErrorOrderValidation;

    const servicesAvailability = await getAvailabilityForProductFromFirstSlot(
        requestedBookings[0].slotStart.startOf('day'),
        requestedBookings.map(b => b.product)
    );

    for (const booking of requestedBookings) {
        let validationError: any;
        const productAvailability = servicesAvailability.products[booking.product] as ProductAvailability;
        const slotStart = booking.slotStart.toISO() as string;
        const selectedSlot = productAvailability[slotStart];
        if (selectedSlot.available.length === 0 ) {
            validationError = {
                productId: booking.product,
                slotStart: booking.slotStart,
                missingProduct: booking.product
            }
        }
        for (const item of selectedSlot.accessories) {
            const accessoryType = Object.keys(item)[0] as Accessory;
            const stockList = item[accessoryType] as string[];
            if (stockList.length < booking.passengersAmount) {
                if (validationError) {
                    if (validationError.missingAccessory) {
                        validationError.missingAccessory.push(accessoryType);
                    } else {
                        validationError.missingAccessory = [ accessoryType ];
                    }
                } else {
                    validationError = {
                        productId: booking.product,
                        slotStart: booking.slotStart,
                        missingAccessory: [ accessoryType ]
                    }
                }
            }
        }
        if (validationError) {
            if (!errorOrderValidation.outOfStock) {
                errorOrderValidation.outOfStock = [ validationError ];
            } else {
                errorOrderValidation.outOfStock.push(validationError);
            }
        }
    }

    if (errorOrderValidation.outOfStock) {
        return errorOrderValidation;
    }

    const businessRules = await getBusinessRules();

    const successOrderValidation: SuccessOrderValidation = {
        bookings: [],
        totalPrice: 0,
        extras: [],
        totalExtras: 0,
        discounts: [],
        totalDiscount: 0,
        finalTotal: 0
    }

    // 1. bookings
    for (const booking of requestedBookings) {
        const productAvailability = servicesAvailability.products[booking.product] as ProductAvailability;
        const slotStart = booking.slotStart.toISO() as string;
        const selectedSlot = productAvailability[slotStart];

        const productPrice = businessRules!.products.get(booking.product)!.price;
        const validBooking: BookingValidationResult = {
            slotStart: booking.slotStart,
            slotEnd: booking.slotStart.plus({ minutes: businessRules!.slotDuration! }),
            product: {
                type: booking.product,
                stockId: selectedSlot.available[0],
                price: productPrice
            },
            price: productPrice,
            accessories: []
        }
        successOrderValidation.totalPrice += validBooking.price;

        for (const item of selectedSlot.accessories) {
            const accessoryType = Object.keys(item)[0] as Accessory;
            const stockList = item[accessoryType] as string[];
            const price = businessRules!.accessories.get(accessoryType)!.price;
            for (let i = 0; i < booking.passengersAmount; i++) {
                const stockId = stockList[i];
                validBooking.accessories.push({
                    passengerIndex: i,
                    type: accessoryType as Accessory,
                    stockId,
                    price
                })
                validBooking.price += price;
                successOrderValidation.totalPrice += price;
            }
        }

        successOrderValidation.bookings.push(validBooking);
    }

    // 2. extras
    for (const extra of extraIds) {
        const extraRules = businessRules?.extras.find(e => e.name === extra);
        if (!extraRules) {
            continue;
        }
        const type = extraRules.type;
        const value = extraRules.value;
        const price = type === RuleType.PERCENTAGE ? successOrderValidation.totalPrice * value / 100 : value;

        successOrderValidation.extras.push({
            name: extra,
            type,
            value,
            price
        })
        successOrderValidation.totalExtras += price;
    }

    // 3. discounts
    if (successOrderValidation.bookings.length >= 2) {
        const multibookingDiscount = businessRules!.discounts!.find(d => d.name === DiscountType.MULTI_BOOKING)!;
        const type = multibookingDiscount.type;
        const value = multibookingDiscount.value;
        const price = type === RuleType.PERCENTAGE ? successOrderValidation.totalPrice * value / 100 : value;

        successOrderValidation.discounts.push({
            name: DiscountType.MULTI_BOOKING,
            type,
            value,
            price
        })
        successOrderValidation.totalDiscount += price;
    }

    // 7. finalTotal
    successOrderValidation.finalTotal = successOrderValidation.totalPrice + successOrderValidation.totalExtras - successOrderValidation.totalDiscount;

    return successOrderValidation;
}

export async function createOrderAndBookings(
    user: JwtPayload,
    requestedBookings: BookingRequest[],
    extraIds: ExtraType[]
) {
    const orderValidationRequest = requestedBookings.map((b: BookingRequest) => ({
        slotStart: b.slotStart,
        product: b.product,
        passengersAmount: b.passengers.length
    }));
    let orderValidation = await validateOrderContent(orderValidationRequest, extraIds);
    if ("outOfStock" in orderValidation && orderValidation.outOfStock) {
        return orderValidation;
    }
    orderValidation = orderValidation as SuccessOrderValidation;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Paso 2: crear orden vacía
        const order = await Order.create({
            userId: user.id,
            extras: orderValidation.extras,
            discounts: orderValidation.discounts,
            totalPrice: orderValidation.totalPrice,
            totalExtras: orderValidation.totalExtras,
            totalDiscount: orderValidation.totalDiscount,
            finalPrice: orderValidation.finalTotal,
            bookings: []
        });

        // Paso 3: crear bookings asociados
        const bookings = await Booking.insertMany(
            orderValidation.bookings.map((booking, bIdx) => ({
                userId: user.id,
                orderId: order._id,
                product: {
                    type: booking.product.type,
                    stockId: booking.product.stockId
                },
                passengers: requestedBookings[bIdx].passengers.map((passenger, pIdx) => ({
                    fullName: passenger.fullName,
                    birthdate: passenger.birthdate,
                    accessories: booking.accessories
                        .filter(acc => acc.passengerIndex === pIdx)
                        .map(acc => ({
                            type: acc.type,
                            stockId: acc.stockId
                        })),
                })),
                startTime: booking.slotStart,
                endTime: booking.slotEnd,
                price: booking.price
            }))
        );

        // Paso 4: actualizar la orden con los bookings
        order.bookings = bookings.map(b => b._id);
        await order.save();
        return order;

    } catch (error) {
        // Si algo falla en el proceso, se hace rollback de la transacción
        await session.abortTransaction();
        session.endSession();

        throw error;
    }

}
