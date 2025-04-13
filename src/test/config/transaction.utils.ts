import mongoose from "mongoose";

export async function runWithTransaction(testFn: (session: mongoose.ClientSession) => Promise<void>) {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        await testFn(session);
        await session.abortTransaction();
    } finally {
        await session.endSession();
    }
}
