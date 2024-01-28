import React, { useState, useEffect, useRef } from "react";
import { askGPT4 } from "../services/OpenAIService";
import "./Chatbot.css";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { mathTeacher } from "../prompts/mathTeacher";

const messagesStored = JSON.parse(
  localStorage.getItem("child-bot-history") ?? "[]"
);

type ChatbotProps = {
  value: string;
};

type chatHistory = {
  role: string;
  content: string;
};

const Chatbot = ({ value }: ChatbotProps) => {
  const [inputText, setInputText] = useState<string>("");
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<chatHistory[]>([
    {
      role: "system",
      content: mathTeacher,
    },
    ...messagesStored,
  ]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }

    localStorage.setItem(
      "child-bot-history",
      JSON.stringify(
        chatHistory?.filter(
          (element) => element?.role === "user" || element?.role === "assistant"
        )
      )
    );
  }, [chatHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const newHistory = [
      ...chatHistory,
      {
        role: "user",
        content: value.length > 0 ? `${inputText} ${value}` : inputText,
      },
    ];
    setChatHistory(newHistory);

    const messages = newHistory
      .filter((E) => E)
      .map((message) => {
        const { role, content } = message;
        return { role: role.toLowerCase(), content };
      });
    const response = await askGPT4(messages);

    if (typeof response === "string")
      setChatHistory((chatHistory) => [
        ...chatHistory,
        { role: "assistant", content: response },
      ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setInputText("");

      //@ts-ignore
      inputRef?.current.focus();
      handleSendMessage();
    }
  };
  const inputRef = useRef(null);

  return (
    <div className="chatbot-container">
      {process.env.REACT_APP_OPENAI_API_KEY ? (
        <></>
      ) : (
        <div>No api key provided (reload to provide)</div>
      )}
      <div className="chat-window" ref={chatWindowRef}>
        <div>
          <a
            href="https://github.com/Plexus-Notes/ADA.git"
            target="_blank"
            rel="noreferrer"
          >
            childbot codebase link
          </a>
        </div>
        {chatHistory
          ?.filter((e) => e && e?.role !== "system")
          .map((message, index) => (
            <div
              key={index}
              className={
                (message.role === "user" ? "user-message" : "ai-message") +
                " message"
              }
            >
              <b className="message-role"> {message.role}</b>{" "}
              <Latex>
                {`${message.content.replace(
                  /(?<!\d)\.|\:/g,
                  (match) => match + "<br><br>"
                )}`}
              </Latex>
            </div>
          ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message Childbot..."
        value={inputText}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="message-input"
      />
      <button
        onClick={() => {
          localStorage.removeItem("child-bot-history");
          window.location.reload();
        }}
        className="clear-button"
      >
        Clear
      </button>
    </div>
  );
};

export default Chatbot;
