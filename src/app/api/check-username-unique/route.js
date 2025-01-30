import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { z } from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema"


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request) {
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url) // get the query params
        const queryParam = {
            username: searchParams.get('username') // gets the username from the query params  // eg: localhost:5000/api/unique?username=abc
        }

        // validate the query params {zod}
        const result = UsernameQuerySchema.safeParse(queryParam)

        // console.log(result.success)

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameError?.length > 0
                    ? usernameError.join(", ")
                    : "Invalid username"
            }, { status: 400 })
        }

        const { username } = result.data
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already exists"
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message: "Username is available"
        }, { status: 200 })


    } catch (error) {
        console.error('error while checking username', error)
        return Response.json(
            {
                success: false,
                message: "error while checking username"
            }, { status: 500 }
        )
    }
}
