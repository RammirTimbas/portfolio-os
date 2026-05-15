import { useState, useEffect, useRef } from "react";
import { projects } from "../../../data/projects";
import type { Project } from "../../../types/project";

interface Props {
  onRun: (project: Project) => void;
}

export default function WorkspaceTerminal({ onRun }: Props) {
  const [history, setHistory] = useState<string[]>([
    "Microsoft Windows [Version 10.0.22631.3593]",
    "(c) Microsoft Corporation. All rights reserved.",
    "",
    "C:\\Users\\rammir\\Workspace> dir",
    "Listing all artifacts in directory...",
    ...projects.map(p => `${p.metadata?.lastModified || '2024-01-01'}  <DIR>          ${p.id}`),
    "",
    "Type 'help' for available commands.",
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

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

    if (cmd === "help") {
      response = [
        "LS / DIR    - List all project artifacts",
        "RUN [id]    - Execute a specific module",
        "CAT [id]    - Read artifact documentation",
        "INFO [id]   - Show technical metadata",
        "CLS / CLEAR - Clear terminal screen",
      ];
    } else if (cmd === "ls" || cmd === "dir") {
      response = projects.map(p => `[OBJ] ${p.id.padEnd(20)} ${p.status.toUpperCase()}`);
    } else if (cmd === "cls" || cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    } else if (cmd.startsWith("run ")) {
      const id = cmd.split(" ")[1];
      const project = projects.find(p => p.id === id);
      if (project) {
        response = `INITIALIZING EXECUTION ENVIRONMENT FOR ${id.toUpperCase()}...`;
        onRun(project);
      } else {
        response = `ERROR: Artifact '${id}' not found.`;
      }
    } else if (cmd.startsWith("cat ")) {
      const id = cmd.split(" ")[1];
      const project = projects.find(p => p.id === id);
      if (project) {
        response = [
          `READING ${id.toUpperCase()}.DOC...`,
          `TITLE: ${project.title}`,
          `BRIEF: ${project.description}`,
          `STACK: ${project.stack.join(", ")}`,
        ];
      } else {
        response = `ERROR: Artifact '${id}' not found.`;
      }
    } else if (cmd.startsWith("info ")) {
      const id = cmd.split(" ")[1];
      const project = projects.find(p => p.id === id);
      if (project) {
        response = [
          `METADATA FOR ${id.toUpperCase()}:`,
          `VERSION: ${project.metadata?.version || '1.0.0'}`,
          `SIZE: ${project.metadata?.size || 'N/A'}`,
          `LAST_MOD: ${project.metadata?.lastModified || 'N/A'}`,
          `CATEGORY: ${project.category}`,
        ];
      } else {
        response = `ERROR: Artifact '${id}' not found.`;
      }
    } else {
      response = `'${cmd}' is not recognized as an internal or external command.`;
    }

    const newLines = Array.isArray(response) ? response : [response];
    setHistory([...history, `C:\\Users\\rammir\\Workspace> ${input}`, ...newLines, ""]);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col bg-[#012456] p-6 font-mono text-sm leading-relaxed text-zinc-200">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-0.5 custom-scrollbar">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
        <form onSubmit={handleCommand} className="flex gap-2 pt-1">
          <span className="text-zinc-200">C:\\Users\\rammir\\Workspace{'>'}</span>
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
