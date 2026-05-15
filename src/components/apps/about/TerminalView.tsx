import { useState, useEffect, useRef } from "react";
import { profileData } from "../../../data/profile";
import { useResumeDownload } from "../../../hooks/useResumeDownload";

export default function TerminalView() {
  const [history, setHistory] = useState<string[]>([
    "Identity CLI [Version 1.0.42]",
    "(c) 2024 RT Systems. All rights reserved.",
    "",
    "Type 'help' to see available identity protocols.",
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { downloadResume } = useResumeDownload();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let response: string | string[] = "";

    switch (cmd) {
      case "help":
        response = [
          "WHOAMI          - Display user identity profile",
          "SYSTEM --SPECS  - Show technical stack and kernel info",
          "UPTIME          - Show total professional experience duration",
          "EXPORT --RESUME - Download identity artifact (PDF)",
          "CONTACT         - List available communication channels",
          "CLEAR           - Flush terminal buffer",
        ];
        break;
      case "whoami":
        response = [
          `USER: ${profileData.name}`,
          `ROLE: ${profileData.role}`,
          `BIO: ${profileData.bio}`,
          `STATUS: ${profileData.status}`,
        ];
        break;
      case "system --specs":
        response = [
          "--- TECHNICAL STACK ---",
          ...profileData.systemInfo.stack.map(s => `[CORE] ${s}`),
          `RUNTIME: ${profileData.systemInfo.runtime}`,
        ];
        break;
      case "uptime":
        response = `TOTAL SYSTEM UPTIME: ${profileData.systemInfo.uptime}`;
        break;
      case "contact":
        response = [
          `EMAIL: ${profileData.links.email}`,
          `GITHUB: ${profileData.links.github}`,
          `LINKEDIN: ${profileData.links.linkedin}`,
        ];
        break;
      case "export --resume":
      case "download resume":
        response = "INITIALIZING EXPORT SEQUENCE... [DONE]";
        downloadResume();
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      default:
        response = `ERROR: '${cmd}' is not recognized as an internal or external command.`;
    }

    const newLines = Array.isArray(response) ? response : [response];
    setHistory([...history, `> ${input}`, ...newLines, ""]);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col bg-zinc-950 p-6 font-mono text-sm leading-relaxed text-blue-400">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-0.5 custom-scrollbar">
        {history.map((line, i) => (
          <div key={i} className={line.startsWith(">") ? "text-white font-bold" : line.startsWith("ERROR") ? "text-red-400" : "text-blue-400/90"}>
            {line}
          </div>
        ))}
        <form onSubmit={handleCommand} className="flex gap-2 pt-1">
          <span className="text-emerald-500 font-bold">visitor@identity:~$</span>
          <input
            autoFocus
            className="flex-1 bg-transparent outline-none border-none text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}
