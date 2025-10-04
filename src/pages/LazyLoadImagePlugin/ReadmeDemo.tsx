import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import readmeContent from "../../../README.md?raw";
import remarkGfm from "remark-gfm";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ReadmeDemo() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📖 README 文档</h1>
        <p className="page-desc">项目完整文档</p>
      </div>

      <div
        className="page-card"
        style={{
          fontSize: "15px",
          lineHeight: "1.8",
          maxWidth: "100%",
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // 自定义代码块渲染
            code({ className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";
              const isInline = !className;

              return !isInline && language ? (
                <SyntaxHighlighter
                  style={tomorrow as any}
                  language={language}
                  PreTag="div"
                  customStyle={{
                    borderRadius: "4px",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    margin: "16px 0",
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code
                  className={className}
                  style={{
                    background: "#f4f4f4",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    fontFamily: "monospace",
                    fontSize: "0.9em",
                  }}
                >
                  {children}
                </code>
              );
            },
            // 自定义表格样式
            table({ children, ...props }) {
              return (
                <div style={{ overflowX: "auto", margin: "16px 0" }}>
                  <table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      border: "1px solid #ddd",
                    }}
                    {...props}
                  >
                    {children}
                  </table>
                </div>
              );
            },
            th({ children, ...props }) {
              return (
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    backgroundColor: "#f2f2f2",
                    textAlign: "left",
                  }}
                  {...props}
                >
                  {children}
                </th>
              );
            },
            td({ children, ...props }) {
              return (
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                  }}
                  {...props}
                >
                  {children}
                </td>
              );
            },
            // 自定义标题样式
            h1({ children, ...props }) {
              return (
                <h1
                  style={{
                    marginTop: "24px",
                    marginBottom: "12px",
                    fontSize: "2em",
                    fontWeight: "bold",
                  }}
                  {...props}
                >
                  {children}
                </h1>
              );
            },
            h2({ children, ...props }) {
              return (
                <h2
                  style={{
                    marginTop: "20px",
                    marginBottom: "12px",
                    fontSize: "1.5em",
                    fontWeight: "bold",
                  }}
                  {...props}
                >
                  {children}
                </h2>
              );
            },
            h3({ children, ...props }) {
              return (
                <h3
                  style={{
                    marginTop: "20px",
                    marginBottom: "12px",
                    fontSize: "1.3em",
                    fontWeight: "bold",
                  }}
                  {...props}
                >
                  {children}
                </h3>
              );
            },
            h4({ children, ...props }) {
              return (
                <h4
                  style={{
                    marginTop: "20px",
                    marginBottom: "12px",
                    fontSize: "1.1em",
                    fontWeight: "bold",
                  }}
                  {...props}
                >
                  {children}
                </h4>
              );
            },
            // 自定义段落样式
            p({ children, ...props }) {
              return (
                <p
                  style={{
                    marginBottom: "12px",
                    lineHeight: "1.6",
                  }}
                  {...props}
                >
                  {children}
                </p>
              );
            },
            // 自定义链接样式
            a({ children, href, ...props }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#0066cc",
                    textDecoration: "none",
                  }}
                  {...props}
                >
                  {children}
                </a>
              );
            },
            // 自定义列表样式
            ul({ children, ...props }) {
              return (
                <ul
                  style={{
                    marginLeft: "20px",
                    marginBottom: "12px",
                  }}
                  {...props}
                >
                  {children}
                </ul>
              );
            },
            ol({ children, ...props }) {
              return (
                <ol
                  style={{
                    marginLeft: "20px",
                    marginBottom: "12px",
                  }}
                  {...props}
                >
                  {children}
                </ol>
              );
            },
            // 自定义水平线样式
            hr({ ...props }) {
              return (
                <hr
                  style={{
                    margin: "24px 0",
                    border: "none",
                    borderTop: "1px solid #ddd",
                  }}
                  {...props}
                />
              );
            },
            // 自定义引用块样式
            blockquote({ children, ...props }) {
              return (
                <blockquote
                  style={{
                    borderLeft: "4px solid #ddd",
                    paddingLeft: "16px",
                    margin: "16px 0",
                    color: "#666",
                    fontStyle: "italic",
                  }}
                  {...props}
                >
                  {children}
                </blockquote>
              );
            },
          }}
        >
          {readmeContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
