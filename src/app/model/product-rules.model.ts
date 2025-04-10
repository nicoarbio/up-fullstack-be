import mongoose from 'mongoose';
import { Accessory, Product } from "@enum/booking.enum";
import { DbModelName } from "@enum/db-model-name.enum";

const productRulesSchema = new mongoose.Schema({
    product: { type: String, enum: Object.values(Product), required: true, unique: true },
    maxPeople: { type: Number, required: true },
    accessories: [{ type: String, enum: Object.values(Accessory), required: true }]
}, { timestamps: true });

export const ProductRules = mongoose.model(DbModelName.PRODUCT_RULES, productRulesSchema);
