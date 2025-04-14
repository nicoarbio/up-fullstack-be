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
