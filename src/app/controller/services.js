import express from "express";

export default express.Router()
    .get("/services", getAllServices);

function getAllServices(req, res) {

}
