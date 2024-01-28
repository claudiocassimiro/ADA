// src/components/Chatbot.tsx

import React, { useState, useEffect, useRef } from "react";
import { askGPT4 } from "../services/OpenAIService";
import "./Chatbot.css"; // Import your CSS for styling
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import {
  solarizedlight,
  dark,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import { CopyToClipboard } from "react-copy-to-clipboard";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
const messagesStored = JSON.parse(
  localStorage.getItem("child-bot-history") ?? "[]"
);
const Chatbot = ({ value }: any) => {
  const [inputText, setInputText] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([
    {
      role: "system",
      content: `
        Você é um assistente de chat projetado para resolver problemas matemáticos complexos. Seu objetivo é fornecer soluções detalhadas e passos claros para resolver problemas de diversas áreas da matemática. Ao fornecer uma entrada, certifique-se de incluir todos os detalhes relevantes e especifique a área da matemática envolvida (álgebra, cálculo, geometria, etc.). Se necessário, peça explicações adicionais para garantir a precisão da solução.

Exemplo de Entrada:

Usuário: "Resolva \sqrt{2^2}+\frac32"

Exemplo de Resposta:

Assistente: "Para resolver a integral definida \sqrt{2^2}+\frac32, primeiro calcule a integral indefinida de x^2 em relação a x. Em seguida, avalie a função resultante de 0 a 1. Os passos detalhados são os seguintes: [forneça os passos detalhados e a solução final]."

Observação:

Ao formular a pergunta, seja o mais específico possível e forneça todos os detalhes relevantes para garantir uma solução precisa e completa.
      `,
    },
    ,
    ,
    ...messagesStored,
  ]);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat window when chat history updates
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }

    localStorage.setItem(
      "child-bot-history",
      JSON.stringify(
        chatHistory?.filter(
          (e) => e?.role === "user" || e?.role === "assistant"
        )
      )
    );
  }, [chatHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    // Add user message to chat history

    const newHistory = [
      ...chatHistory,
      {
        role: "user",
        content: value.length > 0 ? `${inputText} ${value}` : inputText,
      },
    ];
    setChatHistory(newHistory);

    // Call OpenAI API
    const messages = newHistory
      .filter((E) => E)
      .map((message) => {
        const { role, content } = message;
        return { role: role.toLowerCase(), content };
      });
    const response = await askGPT4(messages);

    // Add AI response to chat history
    if (typeof response === "string")
      setChatHistory((chatHistory) => [
        ...chatHistory,
        { role: "assistant", content: response },
      ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setInputText(""); // Clear input field

      //@ts-ignore
      inputRef?.current.focus(); // Refo
      handleSendMessage();
    }
  };
  const inputRef = useRef(null);

  // const renderers = {
  //   code: ({ language, value }: any) => {
  //     return (
  //       <SyntaxHighlighter
  //         style={solarizedlight}
  //         language={language ?? undefined}
  //         children={value ?? ""}
  //       />
  //     )
  //   },
  // }

  interface MarkdownComponentProps {
    markdown: string;
  }

  const Pre = ({ children }: any) => (
    <pre className="blog-pre">
      <CodeCopyBtn>{children}</CodeCopyBtn>
      {children}
    </pre>
  );
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
      {/* <button onClick={handleSendMessage} className="send-button">
        Send
      </button> */}
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

export function CodeCopyBtn({ children }: any) {
  const [copyOk, setCopyOk] = React.useState(false);
  const iconColor = copyOk ? "#0af20a" : "#ddd";
  const icon = copyOk ? "fa-check-square" : "fa-copy";
  const handleClick = (e: any) => {
    navigator.clipboard.writeText(children[0].props.children[0]);
    console.log(children);
    setCopyOk(true);
    setTimeout(() => {
      setCopyOk(false);
    }, 500);
  };
  return (
    <div className="code-copy-btn">
      <i
        className={`fas ${icon}`}
        onClick={handleClick}
        style={{ color: "black" }}
      />
    </div>
  );
}
