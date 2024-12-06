import { NextResponse } from "next/server";
import Twilio from "twilio";

// Environment variables
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID!;
const twilioApiKey = process.env.TWILIO_API_KEY!;
const twilioApiSecret = process.env.TWILIO_API_SECRET!;

if (!twilioAccountSid || !twilioApiKey || !twilioApiSecret) {
  throw new Error("Missing Twilio environment variables");
}

// Helper to generate Twilio Access Token
const generateToken = (identity: string, roomName: string) => {
  const AccessToken = Twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    { identity }
  );

  token.addGrant(new VideoGrant({ room: roomName }));
  return token.toJwt();
};

// POST handler
export async function POST(req: Request) {
  try {
    const { identity, roomName } = await req.json(); // Parse JSON body

    if (!identity || !roomName) {
      return NextResponse.json(
        { error: "Missing identity or roomName" },
        { status: 400 }
      );
    }

    const token = generateToken(identity, roomName);
    return NextResponse.json({ token }); // Respond with JSON
  } catch (error: any) {
    console.error("Error generating token:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
