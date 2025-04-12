import fs from "fs";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { mongoClientOptions } from "@config/db.config";

import { User } from "@model/user.model";
import { Booking } from "@model/booking.model";
import { Order } from "@model/order.model";
import { Payment } from "@model/payment.model";
import { Refund } from "@model/refund.model";
import { Stock } from "@model/stock.model";
import { BusinessRules } from "@model/business-rules.model";
import { DB_CONFIG } from "@config/config.properties";

let mongoDbInMemory: MongoMemoryServer;

export async function connectToInMemoryMongoDB() {
    mongoDbInMemory = await MongoMemoryServer.create({
        instance: { dbName: mongoClientOptions.dbName, port: DB_CONFIG.LOCAL_PORT },
    });
    const uri = mongoDbInMemory.getUri();
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

export async function shutdownInMemoryMongoDB() {
    console.log("Shutting down In-Memory MongoDB...");
    return await mongoose.disconnect();
}

export async function seedDatabase() {
    const dir = (file: string) => `${DB_CONFIG.SEED_PATH}/${file}`;
    console.log("Seeding in-memory database...");
    // WARNING: ORDER OF SEEDING MATTERS
    const seedsFiles = [
        { schema: BusinessRules, file: 'businessRules.json' },
        { schema: Stock, file: 'stocks.json' },
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
