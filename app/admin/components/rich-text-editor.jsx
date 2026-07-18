"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useCallback, useEffect, useState } from "react";

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-semibold transition-colors disabled:opacity-35 ${
        active
          ? "bg-primary text-white"
          : "text-black/70 hover:bg-black/5 hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px shrink-0 bg-black/10" aria-hidden />;
}

export default function RichTextEditor({
  name,
  value = "",
  placeholder = "Start writing… Use the toolbar for headings, lists, and more.",
  folder = "general",
  /** When set, parent manages state (no form hidden field required). */
  onChange,
  /** When false, omit hidden input (parent serializes). Default true. */
  submitField = true,
}) {
  const [html, setHtml] = useState(value || "");

  const pushHtml = useCallback(
    (next) => {
      setHtml(next);
      onChange?.(next);
    },
    [onChange],
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full h-auto my-3" },
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      pushHtml(ed.getHTML());
    },
    onCreate: ({ editor: ed }) => {
      pushHtml(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[280px] px-4 py-3 focus:outline-none " +
          "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2 " +
          "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 " +
          "[&_h4]:text-base [&_h4]:font-semibold [&_h4]:mt-3 [&_h4]:mb-1 " +
          "[&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 " +
          "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-black/60 " +
          "[&_a]:text-primary [&_a]:underline",
      },
    },
  });

  useEffect(() => {
    if (!editor || value == null) return;
    const current = editor.getHTML();
    if (value && value !== current) {
      // Hydrate existing project HTML once the editor mounts
      const empty =
        !current || current === "<p></p>" || current === "<p><br></p>";
      if (empty) {
        editor.commands.setContent(value, false);
        pushHtml(value);
      }
    }
  }, [editor, value, pushHtml]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Link URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  const addImage = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp,image/gif,image/avif";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const body = new FormData();
        body.set("folder", folder);
        body.append("files", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Upload failed");
        const url = data.urls?.[0];
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      } catch (err) {
        window.alert(err.message || "Could not upload image.");
      }
    };
    input.click();
  }, [editor, folder]);

  if (!editor) {
    return (
      <div className="rounded-xl border border-black/10 bg-black/[0.02] px-4 py-12 text-center text-sm text-black/40">
        Loading editor…
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      {/* Hidden field for form submit (skip when parent owns serialization) */}
      {submitField && name ? (
        <input
          type="hidden"
          name={name}
          value={html === "<p></p>" || html === "<p><br></p>" ? "" : html}
        />
      ) : null}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-black/10 bg-black/[0.02] px-2 py-1.5">
        <ToolbarButton
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <i className="fas fa-rotate-left" />
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <i className="fas fa-rotate-right" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Paragraph"
          active={editor.isActive("paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          ¶
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          title="Heading 4"
          active={editor.isActive("heading", { level: 4 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          H4
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <i className="fas fa-bold" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <i className="fas fa-italic" />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <i className="fas fa-underline" />
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <i className="fas fa-strikethrough" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <i className="fas fa-list-ul" />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <i className="fas fa-list-ol" />
        </ToolbarButton>
        <ToolbarButton
          title="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <i className="fas fa-quote-right" />
        </ToolbarButton>
        <ToolbarButton
          title="Horizontal line"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <i className="fas fa-minus" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <i className="fas fa-align-left" />
        </ToolbarButton>
        <ToolbarButton
          title="Align center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <i className="fas fa-align-center" />
        </ToolbarButton>
        <ToolbarButton
          title="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <i className="fas fa-align-right" />
        </ToolbarButton>
        <ToolbarButton
          title="Justify"
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <i className="fas fa-align-justify" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Add link"
          active={editor.isActive("link")}
          onClick={setLink}
        >
          <i className="fas fa-link" />
        </ToolbarButton>
        <ToolbarButton
          title="Remove link"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
        >
          <i className="fas fa-unlink" />
        </ToolbarButton>
        <ToolbarButton title="Insert image from device" onClick={addImage}>
          <i className="fas fa-image" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Clear formatting"
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          <i className="fas fa-text-slash" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      <div className="border-t border-black/5 bg-black/[0.015] px-3 py-1.5 text-[0.65rem] text-black/40">
        Tip: select text, then use the toolbar. Headings, lists, links, and
        images are available for non-technical editors.
      </div>
    </div>
  );
}
