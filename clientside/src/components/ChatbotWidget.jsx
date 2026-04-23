import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const ChatbotWidget = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm your health assistant. How can I help you today?",
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

    const updatedMessages = [
      ...messages,
      { role: "user", content: input, isSerious: false },
    ];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
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
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border flex flex-col z-50"
          style={{ height: "500px" }}>

          {/* Header */}
          <div className="bg-primary text-white px-4 py-3 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <p className="font-semibold text-sm">Health Assistant</p>
                <p className="text-xs opacity-80">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { navigate("/chatbot"); setIsOpen(false); }}
                className="text-xs bg-white text-primary px-2 py-1 rounded-lg font-medium hover:opacity-90"
              >
                Full Page
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white text-xl hover:opacity-80"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] ${msg.role === "user" ? "" : "flex flex-col gap-1"}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-gray-100 text-zinc-700 rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Serious Symptoms Button */}
                  {msg.isSerious && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-2 mt-1">
                      <p className="text-red-600 text-xs font-semibold mb-1">
                        ⚠️ Symptoms may need medical attention!
                      </p>
                      <button
                        onClick={() => { navigate("/doctors"); setIsOpen(false); }}
                        className="w-full bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 px-3 rounded-lg transition-all"
                      >
                        📅 Book Appointment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-none px-3 py-2">
                  <div className="flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask a health question..."
              className="flex-1 border border-zinc-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-primary text-white px-3 py-2 rounded-xl text-xs font-medium hover:opacity-90 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:opacity-90 transition-all z-50"
        title="Health Assistant"
      >
        {isOpen ? "✕" : "🤖"}
      </button>
    </>
  );
};

export default ChatbotWidget;