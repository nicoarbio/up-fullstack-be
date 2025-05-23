import mongoose from "mongoose";
import { DbModelName } from "@enum/db-model-name.enum";
import { Accessory, RuleType } from "@enum/business-rules.enum";

export const ruleItemSchema = new mongoose.Schema({
    name:         { type: String, required: true },
    type:         { type: String, enum: Object.values(RuleType), required: true },
    value:        { type: Number, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
    price:        { type: Number, required: true },
    maxPeople:    { type: Number, required: true },
    accessories: [{ type: String, enum: Object.values(Accessory), required: true }]
}, { _id: false });

const accessorySchema = new mongoose.Schema({
    price:        { type: Number, required: true }
}, { _id: false });

const businessRulesSchema = new mongoose.Schema({
    _id:          { type: String, default: 'default' },
    openHour:     { type: String, required: true },
    closeHour:    { type: String, required: true },
    slotDuration: { type: Number, required: true },
    slotStep:     { type: Number, required: true },
    products:     { type: Map, of: productSchema, required: true },
    accessories:  { type: Map, of: accessorySchema, required: true },
    extras:         [ ruleItemSchema ],
    penalties:      [ ruleItemSchema ],
    discounts:      [ ruleItemSchema ],
    refundPolicies: [ ruleItemSchema ]
}, { timestamps: true });

export const BusinessRules = mongoose.model(DbModelName.BUSINESS_RULES, businessRulesSchema);
