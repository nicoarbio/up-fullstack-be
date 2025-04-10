import mongoose from 'mongoose';
import { StockCategory } from "./enum/stock.enum.js";
import { Accessory, Product } from "./enum/booking.enum.js";

const stockSchema = new mongoose.Schema({
    _id:      { type: String, default: 'default' },
    serialId: { type: String,  required: true, unique: true },
    type:     { type: String,  required: true, enum: [...Object.values(Product), ...Object.values(Accessory)] },
    category: { type: String,  required: true, enum: Object.values(StockCategory) },
    active:   { type: Boolean, default: true }
}, { timestamps: true });

export const Stock = mongoose.model('Stock', stockSchema);
