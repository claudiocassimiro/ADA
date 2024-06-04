// src/services/OpenAIService.ts

import axios from "axios";

interface Token {
  model?: string;
  created_at?: string;
  message: {
    role: string;
    content: string;
  };
  done?: boolean;
}

function tokensToText(tokenString: string): string {
  console.log(tokenString);
  /**
   * Transforms a long token string (as returned by the Ollama API) into a text message.
   *
   * @param tokenString - A string containing multiple JSON objects.
   * @returns A string containing the text message.
   */
  let text = "";

  // Split the string by lines
  const lines = tokenString.split(/\r?\n/);

  console.log(lines);

  lines.forEach((line) => {
    try {
      if (
        line.trim() === "" ||
        // !line.startsWith("{") ||
        line.startsWith("400")
      ) {
        return;
      }
      // Parse the line as JSON
      const message: Token = JSON.parse(line);

      // Append the content of the message to the text
      if (message.message && message.message.content) {
        text += message.message.content;
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Ignore any lines that aren't valid JSON
      } else {
        throw error;
      }
    }
  });
  // Return the combined text with whitespace normalization
  return text.replace(/  +/g, " ").trim();
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
      "https://7b04-2804-7f7-df00-4c6a-b008-447d-c4e-bb64.ngrok-free.app/api/chat",
      {
        model: "llama3:latest",
        messages: formattedMessages,
        stream: false,
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
