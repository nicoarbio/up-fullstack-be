import { OAuth2Client } from "google-auth-library";
import { OAUTH } from "@config/config.properties";

export const googleOauth2Client = new OAuth2Client(OAUTH.GOOGLE.CLIENT_ID);
console.log("Google OAuth2 client (authentication library) initialized for client ID: ", OAUTH.GOOGLE.CLIENT_ID);
