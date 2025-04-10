import { BusinessRules } from "../model/business-rules.model.js";

let cachedRules: InstanceType<typeof BusinessRules> | null = null;
let cachedUpdatedAt: string | null = null;

export async function getBusinessRules() {
    const doc = await BusinessRules.findById('default', 'updatedAt');
    if (!doc) throw new Error('Business rules not found');

    const currentUpdatedAt = doc.updatedAt.toISOString();

    if (!cachedRules || cachedUpdatedAt !== currentUpdatedAt) {
        cachedRules = await BusinessRules.findById('default');
        cachedUpdatedAt = currentUpdatedAt;
    }

    return cachedRules;
}
