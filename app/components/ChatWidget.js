"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const GREETING = {
  id: "greeting",
  role: "assistant",
  text: "Hello! I'm the ARIFA assistant. Ask about our research, training, events, or opportunities.",
};

/**
 * Clean floating chat widget (V1 UI shell).
 * Backend (streaming + knowledge) wires into `handleSend` next.
 * Rendered from SiteChrome so it never appears on /admin.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const logRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open ]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, open ]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  function handleSend(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text },
      {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: "Thanks — I noted that. Full answers with ARIFA sources arrive in the next step. For anything urgent, use Contact ARIFA below.",
      },
    ]);
    setInput("");
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="arifa-chat-panel"
          aria-label="Open ARIFA assistant chat"
          className="fixed bottom-6 right-6 z-[90] flex items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ width: 52, height: 52 }}
        >
          <i className="fa-regular fa-comment-dots text-lg" aria-hidden="true" />
        </button>
      )}

      {open && (
        <section
          id="arifa-chat-panel"
          role="dialog"
          aria-modal="false"
          aria-label="ARIFA assistant"
          className="fixed bottom-6 right-4 left-4 z-[90] flex max-h-[70vh] h-[480px] flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-xl sm:left-auto sm:right-6 sm:w-[380px]"
        >
          <header className="flex items-start justify-between gap-3 border-b border-line bg-surface-alt px-4 py-3">
            <div>
              <p className="text-sm font-bold text-ink">ARIFA Assistant</p>
              <p className="text-xs text-muted">
                Answers from ARIFA&apos;s published materials
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-md p-2 text-muted hover:bg-surface-warm hover:text-ink"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </header>

          <div
            ref={logRef}
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-white"
                      : "border border-line bg-surface-alt text-ink-soft"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}
          </div>

          <footer className="border-t border-line px-4 py-3">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <label htmlFor="arifa-chat-input" className="sr-only">
                Ask ARIFA something
              </label>
              <input
                id="arifa-chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about research, training, events…"
                className="min-w-0 flex-1 rounded-lg border border-line-strong bg-white px-3 py-2 text-sm text-ink placeholder:text-subtle focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                <i className="fa-solid fa-paper-plane text-xs" aria-hidden="true" />
              </button>
            </form>
            <p className="mt-2 text-xs text-muted">
              Can&apos;t find it?{" "}
              <Link
                href="/contact-us"
                className="font-semibold text-primary underline underline-offset-2 hover:text-primary-dark"
              >
                Contact ARIFA
              </Link>
            </p>
          </footer>
        </section>
      )}
    </>
  );
}
