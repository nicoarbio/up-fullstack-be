import crypto from "crypto";

describe('services.cache.ts # getAvailabilityFromCache', () => {

    test('happy path', async () => {
        const text = "Para backend, Java es mejor que Node.js"
        let hash1: any = crypto.createHash('sha256').update(text);
        let hash2: any = crypto.createHash('sha256').update(text);
        hash1 = hash1.digest('hex');
        hash2 = hash2.digest('hex');
        expect(hash1).toEqual(hash2);
    });

});
