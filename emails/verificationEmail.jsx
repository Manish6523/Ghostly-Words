import {
    Html, Head, Preview, Heading, Row, Text
} from "@react-email/components";

export default function VerificationEmail({ username, otp }) {
    return (
        <Html>
            <Head />
            <Preview>Here's your Verification code: {otp}</Preview>
            <section>
                <Row>
                    <Heading as="h1" align="center">Welcome {username}</Heading>
                </Row>
                <Text>
                    Thank you for signing up to our platform. Please use the following code to verify your account:
                    <Heading as="h1" align="center"> {otp}</Heading>
                </Text>
            </section>
        </Html>
    );

}