import { ProductRules } from "../model/product-rules.model.js";
import { Product, Accessory } from "../model/enum/booking.enum.js";

export interface IProductRule {
    maxPeople: number;
    accessories: Accessory[];
}


let cachedRules: Record<Product, IProductRule> = {} as Record<Product, IProductRule>;
let cachedUpdatedAt: string | null = null;

export async function getProductRules(): Promise<typeof cachedRules> {
    const anyRule = await ProductRules.findOne({}, 'updatedAt');
    if (!anyRule) throw new Error('No product rules found');

    const currentUpdatedAt = anyRule.updatedAt.toISOString();

    if (!cachedUpdatedAt || cachedUpdatedAt !== currentUpdatedAt) {
        const rules = await ProductRules.find();
        cachedRules = {} as Record<Product, IProductRule>;
        for (const rule of rules) {
            cachedRules[rule.product as Product] = {
                maxPeople: rule.maxPeople,
                accessories: rule.accessories
            };
        }
        cachedUpdatedAt = currentUpdatedAt;
    }

    return cachedRules;
}
