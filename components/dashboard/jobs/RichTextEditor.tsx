"use client";
import dynamic from "next/dynamic";
import { useRef, useEffect } from "react";
import type ReactQuillType from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
}) as unknown as typeof ReactQuillType;

const modules = {
    toolbar: [
        [{ header: [2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
    ],
};

const formats = ["header", "bold", "italic", "underline", "strike", "list", "link"];

export function RichTextEditor({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}) {
    const quillRef = useRef<ReactQuillType>(null);
    const hasSetInitial = useRef(false);

    useEffect(() => {
        const editor = quillRef.current?.getEditor?.();
        if (!editor) return;

        const currentHtml = editor.root.innerHTML;
        if (!hasSetInitial.current || value !== currentHtml) {
            if (document.activeElement && editor.root.contains(document.activeElement)) {
                return;
            }
            const sel = editor.getSelection();
            editor.root.innerHTML = value || "";
            hasSetInitial.current = true;
            if (sel) editor.setSelection(sel);
        }
    }, [value]);

    return (
        <div className="rich-text-editor rounded-lg border border-slate-200 focus-within:border-fuchsia-300 [&_.ql-toolbar]:rounded-t-lg [&_.ql-toolbar]:border-slate-200 [&_.ql-container]:rounded-b-lg [&_.ql-container]:border-slate-200 [&_.ql-editor]:min-h-30 [&_.ql-editor]:text-sm">
            <ReactQuill
                ref={quillRef}
                theme="snow"
                defaultValue={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
            />
        </div>
    );
}