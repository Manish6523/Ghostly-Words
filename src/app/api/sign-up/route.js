import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        // check for existing user is verified or not
        const existingUserVerifiedByUsername = await UserModel.
            findOne({
                username,
                isVerified: true
            });

        if (existingUserVerifiedByUsername) {
            return Response.json({ success: false, message: "User already exists" }, { status: 400 })
        }

        const existingUserByEmail = await UserModel.findOne({ email })

        const verifyCode = Math.floor(100000 + Math.random() * 900000);

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists with this email"
                }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpirey = new Date(Date.now() + 3600000);
                await existingUserByEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date(Date.now() + 3600000) // 1 hour

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })

            await newUser.save();
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 });
        }
        return Response.json({
            success: true,
            message: "User created successfully"
        }, { status: 200 });
    } catch (error) {
        console.error("Error while signing up:", error)
        return Response.json({ success: false, message: "Error while signing up" }, { status: 500 })

    }
}