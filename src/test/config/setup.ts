import { connectToInMemoryMongoDB, shutdownInMemoryMongoDB } from "../../app/config/mongodb/inmemory.connection";

export const startDbBefore = (async () => {
    await connectToInMemoryMongoDB();
});

export const shutdownDbAfter = (async () => {
    await shutdownInMemoryMongoDB();
});
