// src/services/OpenAIService.ts

import axios from "axios";

interface Token {
  message: {
    content: string;
  };
}

function tokensToText(tokenString: string): string {
  /**
   * Transforms a long token string (as returned by the Ollama API) into a text message.
   *
   * @param tokenString - A string containing multiple JSON objects.
   * @returns A string containing the text message.
   */
  let text = "";

  // Split the string by the known delimiters
  const tokens = tokenString.split(/\r?\n/);

  tokens.forEach((token) => {
    try {
      if (token.trim() === "" || !token.startsWith("{")) return; // Skip empty strings and invalid JSON

      const message: Token = JSON.parse(token);
      text += message.message.content;
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Ignore any tokens that aren't valid JSON
      } else {
        throw error;
      }
    }
  });

  return text;
}

async function askGPT4(
  messages: { role: string; content: string }[]
): Promise<string | null> {
  try {
    const formattedMessages = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const completion = await axios.post(
      "http://localhost:3000/api/chat",
      {
        model: "llama3",
        messages: formattedMessages,
      },
      {
        headers: {
          Authorization: "Bearer user1:0XAXAXAQX5A1F",
          "Content-Type": "application/json",
        },
      }
    );

    return tokensToText(completion?.data);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}

export { askGPT4 };
