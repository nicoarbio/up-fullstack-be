import app from "./app.js";
import { PORT } from "./config/config.properties.js";
import connectDB from "./config/database/database.config.js";

try {
    await connectDB();
    app.listen(PORT, function () {
        console.log(`Application initialized in port: ${PORT}`)
    })
} catch (e) {
    console.error("Error initializing application", e);
}
