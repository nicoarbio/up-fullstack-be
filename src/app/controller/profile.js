import express from "express";

export default express.Router()
    .post("/profile", getUserProfile)
    .patch("/profile", editUserProfile);

function getUserProfile(req, res) {

}

function editUserProfile(req, res) {

}
