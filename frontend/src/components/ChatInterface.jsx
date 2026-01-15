import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import AIbot from "../assets/robo.svg";
import { X, Send, Maximize, Minimize } from "lucide-react";
import axios from "axios";

const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Function to format text with proper styling
  const formatMessage = (text) => {
    // Replace markdown-style bold with HTML bold
    let formattedText = text
      // Replace ** bold ** with HTML bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Replace * italic * with HTML italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Format lists with proper spacing
      .replace(/\n\s*\*\s*/g, "<br/><br/>• ")
      // Add extra space after colons for better readability
      .replace(/:\s*/g, ": ")
      // Create proper paragraph spacing
      .replace(/\n\n/g, "<br/><br/>")
      .replace(/\n/g, "<br/>");

    return formattedText;
  };

  const generateContent = async (userPrompt) => {
    // Format the prompt to encourage brief, practical responses with proper formatting
    const medicalPrompt = `Provide a brief, practical medical response about "${userPrompt}". 
    
Format your response using these guidelines:
- Use ** bold ** for important steps or headers
- Use * italics * for emphasis
- Use bullet points for lists
- Keep your answer under 150 words
- Include proper spacing between sections
- Focus on specific actionable advice
- End with a reminder to seek professional help if needed`;

    const API_URL = import.meta.env.VITE_APP_URL;

    try {
      const response = await axios.post(
        API_URL,
        {
          contents: [{ role: "user", parts: [{ text: medicalPrompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 300,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Extract AI-generated response
      const botResponse =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I couldn't generate a response. Please try again.";

      // Process the response to remove any remaining disclaimers at the beginning
      let processedResponse = botResponse
        .replace(/^(Disclaimer|Note|Remember|Please note):[^\n]*\n*/i, "")
        .replace(/^As an AI(.*?)$/im, "")
        .replace(/^I'm an AI(.*?)$/im, "")
        .trim();

      return processedResponse;
    } catch (error) {
      return "I'm sorry, I couldn't process your question. Please try again.";
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    // Show typing indicator
    setIsTyping(true);

    try {
      const botResponse = await generateContent(input);
      setIsTyping(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, sender: "bot" },
      ]);
    } catch (error) {
      setIsTyping(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "I couldn't process your question. For medical emergencies, call emergency services immediately.",
          sender: "bot",
        },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Add initial welcome message when chat is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          text: "Hi! I'm ORION MediBot. I can provide basic first aid advice and health information. What can I help you with today?",
          sender: "bot",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] sm:bottom-8 sm:right-8">
      {isOpen && (
        <div className="w-full max-w-xs sm:max-w-md lg:w-96 shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-blue-100 transition-all duration-300 transform bg-white">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-1.5 rounded-full shadow-md flex items-center justify-center">
                <img
                  src={AIbot}
                  className="w-5 h-5"
                  alt="Chatbot"
                  style={{
                    filter:
                      "invert(48%) sepia(99%) saturate(2537%) hue-rotate(202deg) brightness(104%) contrast(101%)",
                  }}
                />
              </div>
              <span className="font-medium">ORION MediBot</span>
            </div>
            <div className="flex space-x-3">
              <button
                className="flex cursor-pointer items-center justify-center w-8 h-8 hover:bg-blue-900 hover:bg-opacity-20 rounded-full transition-colors"
                onClick={toggleMinimize}
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize size={16} /> : <Minimize size={16} />}
              </button>
              <button
                className="flex items-center justify-center cursor-pointer w-8 h-8 hover:bg-blue-900 hover:bg-opacity-20 rounded-full transition-colors"
                onClick={toggleChat}
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat content */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto py-4 px-5 bg-gray-50 max-h-80">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center p-6">
                    <div className="bg-blue-100 p-3 rounded-full mb-4 shadow-inner flex items-center justify-center">
                      <img
                        src={AIbot}
                        className="w-8 h-8"
                        alt="Chatbot"
                        style={{
                          filter:
                            "invert(48%) sepia(99%) saturate(2537%) hue-rotate(202deg) brightness(104%) contrast(101%)",
                        }}
                      />
                    </div>
                    <p className="font-medium mb-2 text-blue-600">
                      Medical Assistant
                    </p>
                    <p className="text-sm text-gray-400">
                      Ask about first aid or health questions
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          msg.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-3/4 py-2.5 px-4 rounded-2xl shadow-sm ${
                            msg.sender === "user"
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-none"
                              : "bg-white text-gray-800 rounded-tl-none border border-blue-100"
                          }`}
                        >
                          {msg.sender === "bot" ? (
                            <div
                              className="bot-message"
                              dangerouslySetInnerHTML={{
                                __html: formatMessage(msg.text),
                              }}
                            />
                          ) : (
                            msg.text
                          )}
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white py-2.5 px-4 rounded-2xl rounded-tl-none shadow-sm border border-blue-100">
                          <div className="flex space-x-1">
                            <div
                              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input area */}
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center bg-gray-300 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-opacity-50 transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 py-1"
                    placeholder="Ask a medical question..."
                  />
                  <button
                    onClick={sendMessage}
                    className={`flex items-center cursor-pointer justify-center w-10 h-8 rounded-full transform transition-all duration-200 ${
                      input.trim() === ""
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg hover:scale-105"
                    }`}
                    disabled={input.trim() === ""}
                    aria-label="Send message"
                  >
                    <Send size={10} className="text-white" />
                  </button>
                </div>
                <div className="text-center mt-2 text-xs text-gray-400">
                  For emergencies, call 108 immediately
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Chat button with permanent tooltip when closed */}
      <div className="relative">
        <div
          className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 shadow-lg cursor-pointer transition-all transform hover:scale-110 hover:shadow-xl my-2"
          onClick={toggleChat}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <X size={28} className="text-white" />
          ) : (
            <img src={AIbot} alt="bot" className="h-8 w-8 invert" />
          )}
        </div>

        {/* Permanent tooltip when chat is closed */}
        {!isOpen && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              repeat: 1,
              repeatType: "reverse",
              repeatDelay: 1,
            }}
            className="absolute bottom-full right-0 mb-2"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm py-2 px-4 rounded-lg shadow-lg border border-blue-400/20 backdrop-blur-sm flex items-center gap-2 whitespace-nowrap">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3 }}
                className="w-2 h-2 bg-white rounded-full"
              />
              <span>Click here for AI Assistance</span>
              <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600 transform rotate-45"></div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;