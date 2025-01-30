import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"

export async function POST(request) {
    await dbConnect();
    try {

        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        // console.log(username, code);

        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found'
                }, { status: 400 }
            )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        console.log(user.verifyCodeExpiry);
        console.log(isCodeValid, isCodeNotExpired);
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                }
            )
        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: 'Verificatin Code expired signup again '
                }, { status: 400 }
            )
        } else if (!isCodeValid) {
            return Response.json(
                {
                    success: false,
                    message: 'Invalid code'
                }, { status: 400 }
            )
        }
    } catch (error) {
        console.log('Error while vefifying code: ', error);
        return Response.json(
            {
                success: false,
                message: 'Error while vefifying code'
            }, { status: 400 }
        )
    }
}