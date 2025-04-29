import { DateTime } from 'luxon';
import { Accessory, DiscountType, ExtraType, Product, RuleType } from "@enum/business-rules.enum";
import { getAvailabilityForProductFromFirstSlot } from "@service/services.service";
import { ProductAvailability } from "@controller/services.controller";
import { getBusinessRules } from "@service/business-rules.cache";

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
        type: Accessory;
        stockId: string;
        price: number;
    }[];
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
    outOfStock: {
        productId: Product[];
        accessoryId: Accessory[];
    };
}

export async function validateOrderContent(
    requestedBookings: BookingValidationRequest[],
    extraIds: ExtraType[]
): Promise<ValidationResult> {

    const errorOrderValidation: ErrorOrderValidation = {
        outOfStock: {
            productId: [],
            accessoryId: []
        }
    };

    const servicesAvailability = await getAvailabilityForProductFromFirstSlot(
        requestedBookings[0].slotStart.startOf('day'),
        requestedBookings.map(b => b.product)
    );

    for (const booking of requestedBookings) {
        const productAvailability = servicesAvailability.products[booking.product] as ProductAvailability;
        const slotStart = booking.slotStart.toISO() as string;
        const selectedSlot = productAvailability[slotStart];
        if (selectedSlot.available.length === 0 ) {
            errorOrderValidation.outOfStock.productId.push(booking.product);
        }
        for (const [accessoryType, stockList] of Object.entries(selectedSlot.accessories) as [Accessory, string[]][]) {
            if (stockList.length < booking.passengersAmount) {
                errorOrderValidation.outOfStock.accessoryId.push(accessoryType);
            }
        }
    }

    if (errorOrderValidation.outOfStock.productId.length || errorOrderValidation.outOfStock.accessoryId.length) {
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

        const validBooking: BookingValidationResult = {
            slotStart: booking.slotStart,
            slotEnd: booking.slotStart.plus({ minutes: businessRules!.slotDuration! }),
            product: {
                type: booking.product,
                stockId: selectedSlot.available[0],
                price: businessRules!.products.get(booking.product)!.price
            },
            accessories: []
        }
        successOrderValidation.totalPrice += validBooking.product.price;

        for (const item of selectedSlot.accessories) { //  as [string, string[]][]
            const accessoryType = Object.keys(item)[0] as Accessory;
            const stockList = item[accessoryType] as string[];
            const price = businessRules!.accessories.get(accessoryType)!.price;
            for (let i = 0; i < booking.passengersAmount; i++) {
                const stockId = stockList[i];
                validBooking.accessories.push({
                    type: accessoryType as Accessory,
                    stockId,
                    price
                })
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
