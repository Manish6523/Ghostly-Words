import { render } from "@react-email/render";
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";

export async function sendVerificationEmail(email, username, verifyCode) {
    try {
        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: "Verify your email",
            react: VerificationEmail({username, otp: verifyCode}),
        })
        return{success:true, message: "Verification email sent"}
    } catch (error) {
        console.error("Error while sending verification email", error)
        return {success:false, message: "Error while sending verification email"}
        
    }
}