"use client";

import { useRouter } from "next/navigation";

const VideoCallButton = ({ roomName }: { roomName: string }) => {
  const router = useRouter();

  const handleStartCall = async () => {
    try {
      const response = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName }),
      });

      const data = await response.json();
      if (data.token) {
        sessionStorage.setItem("twilioToken", data.token);
        router.push(`/patients/${roomName}/videocall`);
      } else {
        throw new Error("Failed to retrieve token");
      }
    } catch (error) {
      console.error("Error starting video call:", error);
    }
  };

  return (
    <button
      onClick={handleStartCall}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Start Video Call
    </button>
  );
};

export default VideoCallButton;
 