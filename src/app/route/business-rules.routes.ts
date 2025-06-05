import { Request, Response, Router } from "express";
import { getBusinessRules } from "@service/business-rules.cache";

const businessRules = async (req: Request, res: Response) => {
    res.status(200).json(await getBusinessRules());
    console.log(`Retrieved business rules'`);
}

export default Router()
    .get("/business-rules", businessRules);
