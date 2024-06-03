import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

type MarkdownLaTeXRendererProps = {
  content: string;
};

const MarkdownLaTeXRenderer = ({ content }: MarkdownLaTeXRendererProps) => {
  const regex =
    /(?<!\$)\$(?!\$)([^$]*?)(?<!\$)\$(?!\$)|(?<!\$)\$\$(?!\$)([^$]*?)(?<!\$)\$\$(?!\$)|\\\[.*?\\\]|\\\(.+?\\\)|\\[a-zA-Z]+(?:_[a-zA-Z0-9]+)?(?:\{[^{}]*\}|[^\s{}])*/g;

  const processedText = content.replace(regex, (match) => {
    let cleanMatch = match.replace(/`/g, "").replace(/,/g, "");

    if (cleanMatch.startsWith("$$") && cleanMatch.endsWith("$$")) {
      return cleanMatch;
    } else if (cleanMatch.startsWith("$") && cleanMatch.endsWith("$")) {
      return `$$${cleanMatch.slice(1, -1)}$$`;
    } else if (cleanMatch.startsWith("\\(") && cleanMatch.endsWith("\\)")) {
      return `$$${cleanMatch.slice(2, -2)}$$`;
    } else if (cleanMatch.startsWith("\\[") && cleanMatch.endsWith("\\]")) {
      return `$$${cleanMatch.slice(2, -2)}$$`;
    } else if (cleanMatch.startsWith("\\")) {
      return `$$${cleanMatch}$$`;
    } else {
      return `$$${cleanMatch}$$`;
    }
  });

  console.log(processedText);

  const remarkMathOptions = {
    singleDollarTextMath: false,
  };

  return (
    <ReactMarkdown
      className="markdown-content"
      children={processedText}
      remarkPlugins={[[remarkMath, remarkMathOptions], remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
    />
  );
};

export default MarkdownLaTeXRenderer;
