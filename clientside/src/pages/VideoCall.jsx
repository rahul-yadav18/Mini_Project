import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { AppContext } from "../context/AppContext";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const VideoCall = () => {
  const { appointmentId } = useParams();
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [remoteSocketId, setRemoteSocketId] = useState(null);

  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  useEffect(() => {
    startMedia();
    return () => {
      cleanup();
    };
  }, []);

  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      joinRoom();
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Could not access camera/microphone. Please allow permissions.");
    }
  };

  const joinRoom = () => {
    const userId = userData?.name || "User";
    socket.emit("join-room", appointmentId, userId);
  };

  useEffect(() => {
    socket.on("user-joined", async (userId, socketId) => {
      console.log("User joined:", userId);
      setRemoteSocketId(socketId);
      setIsConnected(true);
      await createOffer(socketId);
    });

    socket.on("offer", async (offer, fromSocketId) => {
      setRemoteSocketId(fromSocketId);
      await handleOffer(offer, fromSocketId);
    });

    socket.on("answer", async (answer) => {
      await peerConnectionRef.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", async (candidate) => {
      try {
        await peerConnectionRef.current?.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    });

    socket.on("chat-message", (message, senderName) => {
      setMessages((prev) => [...prev, { text: message, sender: senderName }]);
    });

    socket.on("user-left", () => {
      setIsConnected(false);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });

    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("chat-message");
      socket.off("user-left");
    };
  }, []);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(iceServers);

    localStreamRef.current?.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current);
    });

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setIsConnected(true);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate, appointmentId);
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const createOffer = async () => {
    const pc = createPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", offer, appointmentId);
  };

  const handleOffer = async (offer) => {
    const pc = createPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer", answer, appointmentId);
  };

  const toggleMute = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOff(!isCameraOff);
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = screenStream.getVideoTracks()[0];
        const sender = peerConnectionRef.current
          ?.getSenders()
          .find((s) => s.track?.kind === "video");
        sender?.replaceTrack(screenTrack);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        screenTrack.onended = () => stopScreenShare();
        setIsScreenSharing(true);
      } catch (error) {
        console.error("Screen share error:", error);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    const sender = peerConnectionRef.current
      ?.getSenders()
      .find((s) => s.track?.kind === "video");
    sender?.replaceTrack(videoTrack);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    setIsScreenSharing(false);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const senderName = userData?.name || "User";
      socket.emit("chat-message", newMessage, appointmentId, senderName);
      setMessages((prev) => [
        ...prev,
        { text: newMessage, sender: "You" },
      ]);
      setNewMessage("");
    }
  };

  const endCall = () => {
    cleanup();
    navigate("/my-appointments");
  };

  const cleanup = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    peerConnectionRef.current?.close();
    socket.disconnect();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <h2 className="text-white font-semibold text-lg">
          Video Consultation
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            isConnected
              ? "bg-green-500 text-white"
              : "bg-yellow-500 text-white"
          }`}
        >
          {isConnected ? "Connected" : "Waiting for other party..."}
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 relative p-4">
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-xl bg-gray-800"
          />

          {/* Local Video */}
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-8 right-8 w-48 h-36 object-cover rounded-lg border-2 border-white shadow-lg"
          />

          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">👨‍⚕️</div>
                <p className="text-xl font-semibold">Waiting for other party to join...</p>
                <p className="text-gray-400 mt-2">Share the appointment link to connect</p>
              </div>
            </div>
          )}
        </div>

        {/* Chat Panel */}
        {isChatOpen && (
          <div className="w-80 bg-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Chat</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-gray-400 text-sm text-center">
                  No messages yet
                </p>
              )}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    msg.sender === "You" ? "items-end" : "items-start"
                  }`}
                >
                  <span className="text-gray-400 text-xs mb-1">
                    {msg.sender}
                  </span>
                  <div
                    className={`px-3 py-2 rounded-lg text-sm max-w-[90%] ${
                      msg.sender === "You"
                        ? "bg-primary text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-700 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-primary text-white px-3 py-2 rounded-lg text-sm"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex justify-center gap-4">
        {/* Mute */}
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full text-white text-xl ${
            isMuted ? "bg-red-500" : "bg-gray-600 hover:bg-gray-500"
          }`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? "🔇" : "🎤"}
        </button>

        {/* Camera */}
        <button
          onClick={toggleCamera}
          className={`p-4 rounded-full text-white text-xl ${
            isCameraOff ? "bg-red-500" : "bg-gray-600 hover:bg-gray-500"
          }`}
          title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
        >
          {isCameraOff ? "📷" : "📹"}
        </button>

        {/* Screen Share */}
        <button
          onClick={toggleScreenShare}
          className={`p-4 rounded-full text-white text-xl ${
            isScreenSharing ? "bg-blue-500" : "bg-gray-600 hover:bg-gray-500"
          }`}
          title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
        >
          🖥️
        </button>

        {/* Chat */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`p-4 rounded-full text-white text-xl ${
            isChatOpen ? "bg-blue-500" : "bg-gray-600 hover:bg-gray-500"
          }`}
          title="Toggle Chat"
        >
          💬
        </button>

        {/* End Call */}
        <button
          onClick={endCall}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-xl"
          title="End Call"
        >
          📵
        </button>
      </div>
    </div>
  );
};

export default VideoCall;