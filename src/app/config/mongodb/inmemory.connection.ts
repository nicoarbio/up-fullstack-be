import fs from "fs";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { mongoClientOptions } from "../db.config.js";

import { User } from "../../model/user.model.js";
import { Booking } from "../../model/booking.model.js";
import { Order } from "../../model/order.model.js";
import { Payment } from "../../model/payment.model.js";
import { Refund } from "../../model/refund.model.js";
import { Stock } from "../../model/stock.model.js";
import { BusinessRules } from "../../model/business-rules.model.js";
import {ProductRules} from "../../model/product-rules.model.js";
import express from "express";

export default async function connectToInMemoryMongoDB() {
    const mongoServer = await MongoMemoryServer.create({
        instance: { dbName: mongoClientOptions.dbName, port: 8083 },
    });
    const uri = mongoServer.getUri();
    console.log("MongoDB In-Memory URI: ", uri);

    return mongoose.connect(uri, mongoClientOptions).then(
        async () => {
            console.log('MongoDB In-Memory successfully connected');
            await seedDatabase();
        },
        (err) => {
            console.error('Error connecting to MongoDB In-Memory', err);
            throw err;
        }
    );
}

async function seedDatabase() {
    const dir = (file: string) => `inMemoryDBmockedData/${file}`;

    console.log("Seeding in-memory database...");
    const seedsFiles = [
        { schema: BusinessRules, file: 'businessRules.json' },
        { schema: Stock, file: 'stocks.json' },
        { schema: ProductRules, file: 'productRules.json' },
        { schema: User, file: 'users.json' },
        { schema: Order, file : 'orders.json' },
        { schema: Booking, file: 'bookings.json' },
        { schema: Payment, file : 'payments.json' },
        { schema: Refund, file : 'refunds.json' },
    ];
    for (let { schema, file } of seedsFiles) {
        file = dir(file);
        if (!fs.existsSync(file)) {
            console.error(`File not found: ${file}`);
            continue;
        }
        const model = schema as mongoose.Model<any>;
        await model.insertMany(JSON.parse(fs.readFileSync(file, 'utf8'))).then(
            () => console.log(`Seeded ${file} collection`),
            (err: any) => console.error(`Error seeding ${file} collection`, err)
        );
    }
}
