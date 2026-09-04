"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

const MAX_MESSAGES = 6;

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `msg-${Date.now()}-${Math.random()}`;
}

function move(list, from, to) {
  if (from === to || from == null || to == null) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/**
 * Editable list of quick replies.
 *
 * Reordering is plain HTML5 drag-and-drop on the handle — no dependency — and
 * the handle doubles as a keyboard control (arrow keys move the row), so the
 * order isn't only reachable with a mouse.
 */
export function SuggestedMessagesField({ messages, onChange }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const update = (index, text) =>
    onChange(messages.map((m, i) => (i === index ? { ...m, text } : m)));

  const remove = (index) => onChange(messages.filter((_, i) => i !== index));

  const add = () =>
    onChange([...messages, { id: newId(), text: "" }]);

  const reorder = (from, to) => {
    if (to < 0 || to >= messages.length) return;
    onChange(move(messages, from, to));
  };

  const endDrag = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium">Suggested messages</p>
        <span className="text-xs text-muted-foreground">
          {messages.length}/{MAX_MESSAGES}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Shown as tappable chips under the greeting. Drag the handle, or focus it
        and use the arrow keys, to reorder.
      </p>

      <ul className="mt-3 space-y-2">
        {messages.map((message, index) => (
          <li
            key={message.id}
            onDragOver={(event) => {
              event.preventDefault();
              setOverIndex(index);
            }}
            onDrop={(event) => {
              event.preventDefault();
              reorder(dragIndex, index);
              endDrag();
            }}
            className={cn(
              "flex items-center gap-2 rounded-lg transition-colors",
              overIndex === index && dragIndex !== null && dragIndex !== index
                ? "bg-muted"
                : null,
              dragIndex === index && "opacity-50",
            )}
          >
            <button
              type="button"
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragEnd={endDrag}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  reorder(index, index - 1);
                } else if (event.key === "ArrowDown") {
                  event.preventDefault();
                  reorder(index, index + 1);
                }
              }}
              aria-label={`Reorder "${message.text || "empty message"}"`}
              className="shrink-0 cursor-grab rounded-md px-1 py-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
            >
              <GripIcon />
            </button>

            <input
              type="text"
              value={message.text}
              placeholder="Message text"
              aria-label={`Suggested message ${index + 1}`}
              onChange={(event) => update(index, event.target.value)}
              className={cn(
                "min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm",
                "transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            />

            <button
              type="button"
              onClick={() => remove(index)}
              aria-label={`Delete "${message.text || "empty message"}"`}
              className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <TrashIcon />
            </button>
          </li>
        ))}
      </ul>

      {messages.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
          No suggested messages — the greeting will stand alone.
        </p>
      ) : null}

      <button
        type="button"
        onClick={add}
        disabled={messages.length >= MAX_MESSAGES}
        className={cn(
          "mt-3 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground",
          "transition-colors hover:bg-primary-hover",
          "disabled:pointer-events-none disabled:opacity-40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        Add message
      </button>
    </div>
  );
}

function GripIcon() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" aria-hidden="true">
      {[2, 8, 14].map((y) =>
        [1, 9].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" />),
      )}
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}
