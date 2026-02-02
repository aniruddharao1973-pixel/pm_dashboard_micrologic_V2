import { Bot } from "lucide-react";

export default function AiAssistantButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="AI Assistant"
      aria-label="Open AI Assistant"
      className="
        fixed
        right-4
        bottom-[max(1rem,env(safe-area-inset-bottom))]
        z-[60]

        w-12 h-12
        sm:w-14 sm:h-14

        rounded-full
        bg-indigo-600 hover:bg-indigo-700
        text-white

        flex items-center justify-center
        shadow-xl

        transition-all duration-200
        hover:scale-105
        active:scale-95
        focus:outline-none
        focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
      "
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  );
}
