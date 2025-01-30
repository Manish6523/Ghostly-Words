import dbConnect from "@/lib/dbConnect";
import UserModel, { message } from "@/model/User"

export async function POST(request) {
    await dbConnect();
    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"

                }, { status: 404 })
        }
        // check for accepting messages is t/f for the user
        if (!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting messages"
                }, { status: 403 })
        }
        const newMessage = { content, createdAt: new Date() }

        user.messages.push(newMessage)
        await user.save()
        return Response.json(
            {
                success: true,
                message: "Message sent successfully"
            }, { status: 200 })
    } catch (error) {
        console.error("Error while sending message: ", error)
        return Response.json(
            {
                success: false,
                message: "Error while sending message",
                error: error.message
            }, { status: 500 })
    }
}