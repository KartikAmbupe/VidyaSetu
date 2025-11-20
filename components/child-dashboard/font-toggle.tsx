"use client";

export default function FontToggle() {
  return (
    <button
      onClick={() => document.documentElement.classList.toggle('dyslexic-mode')}
      className="px-3 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-80 transition w-full"
    >
      Toggle Dyslexic Mode Font
    </button>
  );
}