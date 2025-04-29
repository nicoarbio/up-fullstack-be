export const validateObject = (obj: any, msg: string): boolean => {
    if (typeof obj === 'object') {
        return Object.values(obj).every(v => validateObject(v, msg));
    } else {
        if (!obj) {
            throw new Error(msg);
        }
        return true;
    }
}

/**
 * If object has 0 keys (=== {}). Also true for null and undefined
 * @param obj
 */
export const isObjectEmpty = (obj: any): boolean => {
    if(!obj) return true;
    return !Object.keys(obj).length;
}
