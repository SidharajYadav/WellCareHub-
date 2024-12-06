// // "use client";

// // import { useEffect, useState } from "react";
// // import {
// //   connect,
// //   LocalParticipant,
// //   RemoteParticipant,
// //   Room,
// // } from "twilio-video";

// // const VideoCallPage = () => {
// //   const [room, setRoom] = useState<Room | null>(null);
// //   const [error, setError] = useState("");
// //   const [videoTracks, setVideoTracks] = useState<any[]>([]);

// //   const updateTracks = (participant: LocalParticipant | RemoteParticipant) => {
// //     participant.videoTracks.forEach((publication) => {
// //       const track = publication.track; // Safely access the track
// //       if (track && track.kind === "video") {
// //         setVideoTracks((prev) => [...prev, track]);
// //       }
// //     });

// //     participant.on("trackSubscribed", (track) => {
// //       if (track.kind === "video") {
// //         setVideoTracks((prev) => [...prev, track]);
// //       }
// //     });

// //     participant.on("trackUnsubscribed", (track) => {
// //       if (track.kind === "video") {
// //         setVideoTracks((prev) => prev.filter((t) => t !== track));
// //       }
// //     });
// //   };

// //   const joinRoom = async () => {
// //     try {
// //       const response = await fetch("/api/token", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           identity: `User-${Math.floor(Math.random() * 1000)}`,
// //           roomName: "TestRoom",
// //         }),
// //       });

// //       if (!response.ok) {
// //         throw new Error("Failed to fetch token");
// //       }

// //       const { token } = await response.json();
// //       if (!token) {
// //         throw new Error("Token not found in response");
// //       }

// //       const connectedRoom = await connect(token, { name: "TestRoom" });
// //       setRoom(connectedRoom);
// //     } catch (err: any) {
// //       console.error(err.message);
// //       setError(err.message);
// //     }
// //   };

// //   useEffect(() => {
// //     joinRoom();

// //     return () => {
// //       if (room) {
// //         room.disconnect();
// //       }
// //     };
// //   }, [room]); // Add room as a dependency

// //   return (
// //     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
// //       <h1 className="text-2xl font-bold">Twilio Video Call</h1>
// //       {error && <p className="text-red-500">{error}</p>}
// //       <div id="video-container" className="grid grid-cols-2 gap-4 mt-4">
// //         {videoTracks.map((track, index) => (
// //           <div key={index} className="w-full h-64 border">
// //             <video
// //               ref={(ref) => ref && track.attach(ref)}
// //               autoPlay
// //               playsInline
// //             />
// //           </div>
// //         ))}
// //       </div>
// //       <button
// //         onClick={() => room?.disconnect()}
// //         className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
// //       >
// //         Leave Room
// //       </button>
// //     </div>
// //   );
// // };

// // export default VideoCallPage;

// "use client";

// import { useEffect, useState, useRef } from "react";
// import {
//   connect,
//   LocalParticipant,
//   RemoteParticipant,
//   Room,
//   LocalTrack,
//   RemoteTrack,
//   LocalVideoTrack,
//   RemoteVideoTrack,
// } from "twilio-video";

// const VideoCallPage = () => {
//   const [room, setRoom] = useState<Room | null>(null);
//   const [error, setError] = useState<string>("");
//   const [videoTracks, setVideoTracks] = useState<
//     (LocalVideoTrack | RemoteVideoTrack)[]
//   >([]);
//   const [audioTracks, setAudioTracks] = useState<(LocalTrack | RemoteTrack)[]>(
//     []
//   );
//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(false);

//   const localVideoRef = useRef<HTMLVideoElement>(null); // Local video reference

//   // Handle track updates (video and audio)
//   const updateTracks = (participant: LocalParticipant | RemoteParticipant) => {
//     // Update video tracks
//     participant.videoTracks.forEach((publication) => {
//       const track = publication.track;
//       if (track && track.kind === "video") {
//         setVideoTracks((prev) => [...prev, track]);
//       }
//     });

//     // Update audio tracks
//     participant.audioTracks.forEach((publication) => {
//       const track = publication.track;
//       if (track && track.kind === "audio") {
//         setAudioTracks((prev) => [...prev, track]);
//       }
//     });

//     participant.on("trackSubscribed", (track) => {
//       if (track.kind === "video") {
//         setVideoTracks((prev) => [...prev, track]);
//       } else if (track.kind === "audio") {
//         setAudioTracks((prev) => [...prev, track]);
//       }
//     });

//     participant.on("trackUnsubscribed", (track) => {
//       if (track.kind === "video") {
//         setVideoTracks((prev) => prev.filter((t) => t !== track));
//       } else if (track.kind === "audio") {
//         setAudioTracks((prev) => prev.filter((t) => t !== track));
//       }
//     });
//   };

//   // Join the room
//   const joinRoom = async () => {
//     try {
//       const response = await fetch("/api/token", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           identity: `User-${Math.floor(Math.random() * 1000)}`,
//           roomName: "TestRoom",
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch token");
//       }

//       const { token } = await response.json();
//       if (!token) {
//         throw new Error("Token not found in response");
//       }

//       const connectedRoom = await connect(token, { name: "TestRoom" });

//       // Local participant
//       connectedRoom.localParticipant.videoTracks.forEach((publication) => {
//         const track = publication.track;
//         if (track && track.kind === "video") {
//           if (localVideoRef.current) {
//             track.attach(localVideoRef.current); // Attach local video track
//           }
//         }
//       });

//       // Update participants' tracks
//       connectedRoom.participants.forEach(updateTracks);
//       connectedRoom.on("participantConnected", updateTracks);

//       setRoom(connectedRoom);
//     } catch (err: any) {
//       console.error(err.message);
//       setError(err.message);
//     }
//   };

//   // Mute/unmute audio
//  const toggleMute = () => {
//    if (room) {
//      const localAudioTrack = room.localParticipant.audioTracks.values().next()
//        .value?.track;
//      if (localAudioTrack) {
//        // If muted, unmute by enabling the track
//        if (localAudioTrack.isMuted) {
//          localAudioTrack.enable();
//        } else {
//          // Otherwise, mute by disabling the track
//          localAudioTrack.disable();
//        }
//        setIsMuted(!localAudioTrack.isMuted); // Update mute state
//      }
//    }
//  };

//   // Turn video on/off
//   const toggleVideo = () => {
//     if (room) {
//       const localVideoTrack = room.localParticipant.videoTracks.values().next()
//         .value?.track;
//       if (localVideoTrack) {
//         localVideoTrack.isEnabled
//           ? localVideoTrack.disable()
//           : localVideoTrack.enable();
//         setIsVideoOff(!isVideoOff);
//       }
//     }
//   };

//   // Cleanup on component unmount or room disconnect
//   useEffect(() => {
//     joinRoom();

//     return () => {
//       if (room) {
//         room.disconnect();
//       }
//     };
//   }, [room]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <h1 className="text-2xl font-bold">Twilio Video Call</h1>
//       {error && <p className="text-red-500">{error}</p>}

//       {/* Video Container */}
//       <div id="video-container" className="grid grid-cols-2 gap-4 mt-4">
//         {/* Local Video */}
//         <div className="w-full h-64 border">
//           <video ref={localVideoRef} autoPlay playsInline muted />
//         </div>

//         {/* Remote Participants' Videos */}
//         {videoTracks.map((track, index) => {
//           const videoRef = useRef<HTMLVideoElement>(null);
//           useEffect(() => {
//             if (videoRef.current) {
//               track.attach(videoRef.current);
//             }
//           }, [track]);

//           return (
//             <div key={index} className="w-full h-64 border">
//               <video ref={videoRef} autoPlay playsInline />
//             </div>
//           );
//         })}
//       </div>

//       {/* Controls */}
//       <div className="mt-4 space-x-4">
//         <button
//           onClick={toggleMute}
//           className={`px-4 py-2 ${isMuted ? "bg-gray-500" : "bg-red-500"} text-white rounded`}
//         >
//           {isMuted ? "Unmute" : "Mute"}
//         </button>

//         <button
//           onClick={toggleVideo}
//           className={`px-4 py-2 ${isVideoOff ? "bg-gray-500" : "bg-blue-500"} text-white rounded`}
//         >
//           {isVideoOff ? "Turn Video On" : "Turn Video Off"}
//         </button>

//         <button
//           onClick={() => room?.disconnect()}
//           className="px-4 py-2 bg-red-500 text-white rounded"
//         >
//           Leave Room
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VideoCallPage;

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { connect, LocalParticipant, Room, RemoteTrack } from "twilio-video";

// const VideoCallPage = () => {
//   const [room, setRoom] = useState<Room | null>(null);
//   const [videoTracks, setVideoTracks] = useState<any[]>([]);
//   const [audioTrack, setAudioTrack] = useState<any>(null);
//   const [isMuted, setIsMuted] = useState(false);
//   const [error, setError] = useState("");

//   // Video refs should be created before the component is rendered
//   const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

//   const updateTracks = (participant: LocalParticipant) => {
//     participant.videoTracks.forEach((publication) => {
//       const track = publication.track;
//       if (track && track.kind === "video") {
//         setVideoTracks((prev) => [...prev, track]);
//       }
//     });

//     // Subscribe to new tracks
//     participant.on("trackSubscribed", (track: RemoteTrack) => {
//       if (track.kind === "video") {
//         setVideoTracks((prev) => [...prev, track]);
//       }
//     });
//   };

//   const joinRoom = async () => {
//     try {
//       const response = await fetch("/api/token", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           identity: `User-${Math.floor(Math.random() * 1000)}`,
//           roomName: "TestRoom",
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch token");
//       }

//       const { token } = await response.json();
//       if (!token) {
//         throw new Error("Token not found in response");
//       }

//       const connectedRoom = await connect(token, { name: "TestRoom" });

//       // Set up participant and track updates
//       connectedRoom.localParticipant.on("trackSubscribed", (track) => {
//         if (track.kind === "audio") {
//           setAudioTrack(track);
//         }
//       });

//       setRoom(connectedRoom);
//       updateTracks(connectedRoom.localParticipant);
//     } catch (err: any) {
//       console.error(err.message);
//       setError(err.message);
//     }
//   };

//   const toggleMute = () => {
//     if (audioTrack) {
//       // If muted, unmute by enabling the track
//       if (audioTrack.isMuted) {
//         audioTrack.enable();
//         setIsMuted(false);
//       } else {
//         // Otherwise, mute by disabling the track
//         audioTrack.disable();
//         setIsMuted(true);
//       }
//     }
//   };

//   useEffect(() => {
//     joinRoom();

//     return () => {
//       if (room) {
//         room.disconnect();
//       }
//     };
//   }, [room]);

//   // Attach video tracks to refs once tracks are available
//   useEffect(() => {
//     videoTracks.forEach((track, index) => {
//       const ref = videoRefs.current[index];
//       if (ref) {
//         track.attach(ref);
//       }
//     });
//   }, [videoTracks]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <h1 className="text-2xl font-bold">Twilio Video Call</h1>
//       {error && <p className="text-red-500">{error}</p>}
//       <div id="video-container" className="grid grid-cols-2 gap-4 mt-4">
//         {videoTracks.map((_, index) => (
//           <div key={index} className="w-full h-64 border">
//             <video
//               ref={(el) => {
//                 // Callback ref to set the video element in the videoRefs array
//                 videoRefs.current[index] = el;
//               }}
//               autoPlay
//               playsInline
//             />
//           </div>
//         ))}
//       </div>
//       <div className="mt-4 flex space-x-4">
//         <button
//           onClick={toggleMute}
//           className={`px-4 py-2 ${isMuted ? "bg-gray-500" : "bg-blue-500"} text-white rounded`}
//         >
//           {isMuted ? "Unmute" : "Mute"}
//         </button>
//         <button
//           onClick={() => room?.disconnect()}
//           className="px-4 py-2 bg-red-500 text-white rounded"
//         >
//           Leave Room
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VideoCallPage;


"use client";

import { useEffect, useRef, useState } from "react";
import { connect, LocalParticipant, Room, RemoteTrack } from "twilio-video";

const VideoCallPage = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [videoTracks, setVideoTracks] = useState<any[]>([]);
  const [audioTrack, setAudioTrack] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [roomLink, setRoomLink] = useState<string>("");

  // Refs for video elements
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Function to update tracks for local participant
  const updateTracks = (participant: LocalParticipant) => {
    participant.videoTracks.forEach((publication) => {
      const track = publication.track;
      if (track && track.kind === "video") {
        setVideoTracks((prev) => [...prev, track]);
      }
    });

    // Subscribe to new tracks
    participant.on("trackSubscribed", (track: RemoteTrack) => {
      if (track.kind === "video") {
        setVideoTracks((prev) => [...prev, track]);
      }
    });
  };

  // Function to join room
  const joinRoom = async () => {
    try {
      const response = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identity: `User-${Math.floor(Math.random() * 1000)}`,
          roomName: "TestRoom",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch token");
      }

      const { token } = await response.json();
      if (!token) {
        throw new Error("Token not found in response");
      }

      const connectedRoom = await connect(token, { name: "TestRoom" });

      // Set up participant and track updates
      connectedRoom.localParticipant.on("trackSubscribed", (track) => {
        if (track.kind === "audio") {
          setAudioTrack(track);
        }
      });

      setRoom(connectedRoom);
      updateTracks(connectedRoom.localParticipant);
      setRoomLink(window.location.href); // Set room link for sharing
      setIsJoining(false); // Disable joining state after room is connected
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
    }
  };

  // Toggle mute/unmute audio
  const toggleMute = () => {
    if (audioTrack) {
      if (audioTrack.isMuted) {
        audioTrack.enable();
        setIsMuted(false);
      } else {
        audioTrack.disable();
        setIsMuted(true);
      }
    }
  };

  // Toggle mute/unmute video
 const toggleVideoMute = () => {
   const localParticipant = room?.localParticipant;
   if (localParticipant) {
     // Access the video tracks using the values of the map
     const videoTrackPublication = Array.from(
       localParticipant.videoTracks.values()
     )[0];

     // Check if a video track exists
     if (videoTrackPublication) {
       const videoTrack = videoTrackPublication.track;
       if (videoTrack) {
         if (isVideoMuted) {
           videoTrack.enable();
           setIsVideoMuted(false);
         } else {
           videoTrack.disable();
           setIsVideoMuted(true);
         }
       }
     }
   }
 };


  // Leave the room
  const leaveRoom = () => {
    if (room) {
      room.disconnect();
      setRoom(null);
      setVideoTracks([]);
    }
  };

  useEffect(() => {
    // Join the room automatically if already connected
    if (room) {
      updateTracks(room.localParticipant);
    }

    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  // Attach video tracks to video elements
  useEffect(() => {
    videoTracks.forEach((track, index) => {
      const ref = videoRefs.current[index];
      if (ref) {
        track.attach(ref);
      }
    });
  }, [videoTracks]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold">Twilio Video Call</h1>

      {error && <p className="text-red-500">{error}</p>}

      {!room && !isJoining && (
        <button
          onClick={() => setIsJoining(true)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Join Meeting
        </button>
      )}

      {isJoining && (
        <button
          onClick={joinRoom}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Join Room
        </button>
      )}

      <div className="mt-4 flex space-x-4">
        <button
          onClick={toggleMute}
          className={`px-4 py-2 ${isMuted ? "bg-gray-500" : "bg-blue-500"} text-white rounded`}
        >
          {isMuted ? "Unmute Audio" : "Mute Audio"}
        </button>
        <button
          onClick={toggleVideoMute}
          className={`px-4 py-2 ${isVideoMuted ? "bg-gray-500" : "bg-blue-500"} text-white rounded`}
        >
          {isVideoMuted ? "Unmute Video" : "Mute Video"}
        </button>
        <button
          onClick={leaveRoom}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Leave Room
        </button>
      </div>

      <div className="mt-4">
        {room && (
          <p>
            Share this room link with the patient:{" "}
            <a
              href={roomLink}
              target="_blank"
              className="text-blue-500"
              rel="noopener noreferrer"
            >
              {roomLink}
            </a>
          </p>
        )}
      </div>

      <div id="video-container" className="grid grid-cols-2 gap-4 mt-4">
        {videoTracks.map((_, index) => (
          <div key={index} className="w-full h-64 border">
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              autoPlay
              playsInline
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoCallPage;
