import { Express } from "express";

export default (app: Express) => {
    app.get(["/hc", "/"], (req, res) => {
        const status = {
            status: "UP",
            timestamp: new Date().toISOString(),
        }
        res.status(200).json(status);
    })
}
