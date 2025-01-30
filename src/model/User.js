import mongoose, { Schema } from "mongoose";

// Message Schema
const MessageSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: () => Date.now,
    },
});

// User Schema
const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "verifyCode is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "verifyCodeExpiry is required"],
        default: () => Date.now() + 3600000, // 1 hour from now
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema], // Embedding messages
});

// Use `mongoose.models` to avoid model recompilation errors
const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
