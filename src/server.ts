import app from "./app/app.js";
import { PORT } from "./app/config/config.js";

app.listen(PORT, function () {
    console.log(`Application initialized in port: ${PORT}`)
})
