import app from "./app.js";
import { HOST, PORT } from "./config/config.properties.js";
import connectDB from "./config/db.config.js";

try {
    await connectDB();
    app.listen(PORT, function () {
        console.log(`Application initialized at: ${HOST}`)
    })
} catch (e) {
    console.error("Error initializing application", e);
}
