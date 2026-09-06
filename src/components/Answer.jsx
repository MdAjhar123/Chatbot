import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown'

const Answer = ({ ans, type }) => {

   // Customize how ReactMarkdown renders different Markdown elements
  const components = {

    // Handle code blocks and apply syntax highlighting
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')  // Get programming language from className, e.g. "language-js"
      return !inline && match ? (
        <SyntaxHighlighter
          {...props}
          children={String(children).replace(/\n$/, '')}
          language={match[1]}
          style={dark}
          PreTag="div"
        />
      ) : (
        <code {...props} className={className}>
          {children}
        </code>
      )
    },
    // Customize Markdown headings
    h1: ({node, ...props}) => <h1 className="text-xl font-bold pt-2 dark:text-white text-zinc-900" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-lg font-bold pt-2 dark:text-white text-zinc-900" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-lg font-semibold pt-2 dark:text-white text-zinc-900" {...props} />,
    // Customize bold text
    strong: ({node, ...props}) => <strong className="font-semibold dark:text-white text-zinc-900" {...props} />,
    li: ({node, ...props}) => <li className="list-disc ml-5" {...props} />,
    hr: ({node, ...props}) => <hr className="my-3 dark:border-zinc-700 border-zinc-300" {...props} />,
  }

  return (
    <span className={type == "q" ? "pl-1" : "pl-5"}>
      <ReactMarkdown components={components}>{ans}</ReactMarkdown>  {/* Convert Markdown text into styled React elements */}
    </span>
  );
};

export default Answer;




