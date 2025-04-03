import express from "express";

export default express.Router()
    .post("/login", login)
    .post("/signup", signup)
    .post("/refresh-token", refreshToken);

function login(req, res) {

}

function signup(req, res) {

}

function refreshToken(req, res) {

}
