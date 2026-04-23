import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const Chatbot = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm your health assistant. Ask me anything about symptoms, mental health, remedies, or general wellness. How can I help you today?",
      isSerious: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, { role: "user", content: input, isSerious: false }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Build API messages (only role + content, no isSerious)
      const apiMessages = updatedMessages.map(({ role, content }) => ({
        role,
        content,
      }));

      const { data } = await axios.post(backendUrl + "/api/user/chatbot", {
        messages: apiMessages,
      });

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            isSerious: data.isSerious,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I couldn't process that. Please try again.",
            isSerious: false,
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
          isSerious: false,
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col max-w-3xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-2xl">
          🤖
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">Health Assistant</h1>
          <p className="text-sm text-zinc-500">Ask me about symptoms, remedies & mental health</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-gray-50 rounded-xl border p-4 h-[500px] overflow-y-auto flex flex-col gap-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${msg.role === "user" ? "" : "flex flex-col gap-2"}`}>
              {/* Message Bubble */}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-white text-zinc-700 border rounded-bl-none shadow-sm"
                }`}
              >
                {msg.content}
              </div>

              {/* Serious Symptoms — Book Appointment Button */}
              {msg.isSerious && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-1">
                  <p className="text-red-600 text-xs font-semibold mb-2">
                    ⚠️ These symptoms may require immediate medical attention!
                  </p>
                  <button
                    onClick={() => navigate("/doctors")}
                    className="w-full bg-red-500 hover:bg-red-600 text-white text-xs py-2 px-4 rounded-lg transition-all"
                  >
                    📅 Book Appointment with a Doctor
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {["I have a headache", "Feeling anxious", "High fever remedies", "Chest pain"].map((q) => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-100 transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex gap-3 mt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Describe your symptoms or ask a health question..."
          className="flex-1 border border-zinc-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
        >
          Send
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-zinc-400 text-center mt-3">
        ⚕️ This AI assistant is not a substitute for professional medical advice.
      </p>
    </div>
  );
};

export default Chatbot;