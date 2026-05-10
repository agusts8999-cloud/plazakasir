"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-secondary animate-pulse rounded-2xl" />,
});

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ value, onChange }: EditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="h-[450px] mb-12"
      />
      <style jsx global>{`
        .ql-container {
          border-bottom-left-radius: 1.5rem;
          border-bottom-right-radius: 1.5rem;
          font-family: inherit;
          font-size: 1rem;
        }
        .ql-toolbar {
          border-top-left-radius: 1.5rem;
          border-top-right-radius: 1.5rem;
          background: #f8fafc;
        }
        .ql-editor {
          min-height: 400px;
        }
      `}</style>
    </div>
  );
}
