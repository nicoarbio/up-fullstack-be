import app from "@app";
import { HOST, PORT, IS_PROD } from "@config/config.properties";
import { connectDB, disconnectDB } from "@config/db.config";

let dbConnected = false;

async function startServer() {
    console.log(`🚀 Environment: ${IS_PROD ? 'Production' : 'Development'}`);
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
