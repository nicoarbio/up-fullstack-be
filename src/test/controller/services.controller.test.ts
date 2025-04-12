import { expect, test } from 'vitest'
import request from 'supertest';
import { DateTime } from 'luxon';
import app from "../../app/app";

test('GET /api/v1/services/availability con query', async () => {
    const date = DateTime.now().toISO();

    const res = await request(app)
        .get('/api/v1/services/availability')
        .query({ date, products: ['jet_sky', 'quad'] });

    console.log(JSON.stringify(res.body, null, 2));

    expect(res.status, JSON.stringify(res.body)).toBe(200);
    expect(res.body).toHaveProperty('products');
});
