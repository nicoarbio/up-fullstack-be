import mongoose from 'mongoose';
import { DbModelName } from "@enum/db-model-name.enum";
import { fromLuxonDateTime, toLuxonDateTime } from "@config/luxon.config";

export enum UserRoles {
    ADMIN = 'admin',
    USER = 'user'
}

export enum UserStatus {
    ACTIVE = 'active',
    SUSPENDED = 'suspended'
}

const userSchema = new mongoose.Schema({
    name:             { type: String,  required: true, trim: true },
    lastname:         { type: String,  required: true, trim: true },
    email:            { type: String,  required: true, unique: true, lowercase: true, trim: true },
    emailVerified:    { type: Boolean, default: false },
    passwordHash:     { type: String,  default: null },
    googleId:         { type: String,  default: null },
    phoneNumber:      { type: String,  default: null },
    imageUrl:         { type: String,  default: null },
    role:             { type: String,  enum: Object.values(UserRoles), default: UserRoles.USER },
    status:           { type: String,  enum: Object.values(UserStatus), default: UserStatus.ACTIVE },
    lastLogin:        { type: Date,    default: null, get: toLuxonDateTime, set: fromLuxonDateTime }
} , { timestamps: true });

export const User = mongoose.model(DbModelName.USER, userSchema);
