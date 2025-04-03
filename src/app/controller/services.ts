import express, { Request, Response } from "express";

export default express.Router()
    .get("/services", getAllServices);

function getAllServices(req: Request, res: Response) {

}
