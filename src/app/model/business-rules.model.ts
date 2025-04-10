import mongoose from "mongoose";
import { DbModelName } from "@enum/db-model-name.enum";

export enum RuleType {
    FIXED = 'fixed',
    PERCENTAGE = 'percentage'
}

const businessRulesSchema = new mongoose.Schema({
    _id:          { type: String, default: 'default' },
    openHour:     { type: String, required: true },
    closeHour:    { type: String, required: true },
    slotDuration: { type: Number, required: true },
    slotStep:     { type: Number, required: true },
    pricing: { products:    { type: Map, of: Number },
               accessories: { type: Map, of: Number },
               extras:      { type: Map, of: Number }
    },
    penalties: { type: [{ name: String,
                          type: { type: String, enum: Object.values(RuleType), required: true },
                          value: { type: Number, required: true }
                       }]
    },
    discounts: { type: [{ name: String,
                          type: { type: String, enum: Object.values(RuleType), required: true },
                          value: { type: Number, required: true }
                       }]
    },
    refundPolicies: { type: [{ name: String,
                               type: { type: String, enum: Object.values(RuleType), required: true },
                               value: { type: Number, required: true }
                            }]
    }
}, { timestamps: true });

export const BusinessRules = mongoose.model(DbModelName.BUSINESS_RULES, businessRulesSchema);
