import app from "./app/app.js";

const PORT = process.env.PORT || 8081;

app.listen(PORT, function () {
    console.log(`Application initialized in port: ${PORT}`)
})
