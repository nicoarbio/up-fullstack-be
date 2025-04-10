import app from "./app.js";
import { HOST, PORT } from "./config/config.properties.js";
import { connectDB, disconnectDB } from "./config/db.config.js";

let dbConnected = false;

async function startServer() {
    try {
        await connectDB();
        dbConnected = true;
        app.listen(PORT, () => console.log(`🚀 Application initialized at: ${HOST}`));
    } catch (e) {
        if (dbConnected) await disconnectDB();
        console.error("❌ Error initializing application", e);
    }
}

process.on('SIGINT', async () => {
    console.log('Gracefully shutting down...');
    if (dbConnected) await disconnectDB();
    process.exit(0);
});

startServer();
