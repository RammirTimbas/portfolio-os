import { useState, useEffect, useRef, type ReactNode } from "react";
import { profileData } from "../../data/profile";
import { apps } from "../../data/apps";
import { useProjectStore } from "../../stores/projectStore";
import { useWindowStore } from "../../stores/windowStore";

interface Props {
  isMobile?: boolean;
}

export default function TerminalApp({ isMobile }: Props) {
  const { projects } = useProjectStore();
  const [history, setHistory] = useState<(string | ReactNode)[]>([
    "Identity CLI [Version 1.0.42]",
    "System: IdentityOS Kernel 5.10.0-react",
    "Copyright (c) 2024 Rammir Timbas. All rights reserved.",
    "",
    "Type 'help' to see available commands.",
    "",
  ]);
  const [input, setInput] = useState("");
  const [terminalColor, setTerminalColor] = useState("text-emerald-500/90");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [startTime] = useState(Date.now());

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { openWindow, windows, closeWindow } = useWindowStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCmd = input.trim();
    if (!fullCmd) return;

    setCommandHistory(prev => [...prev, fullCmd]);
    setHistoryIndex(-1);

    const [cmd, ...args] = fullCmd.toLowerCase().split(" ");
    const argStr = args.join(" ");

    let response: string | ReactNode | (string | ReactNode)[] = "";

    switch (cmd) {
      case "help":
      case "man":
        response = [
          "AVAILABLE COMMANDS:",
          "  identity / whoami - Display personal profile",
          "  neofetch / sys    - Display system/developer specs",
          "  skills            - List technical expertise",
          "  projects / dir    - List all portfolio projects",
          "  cat [project_id]  - View project details",
          "  contact           - Display contact information",
          "  socials           - Social media handles",
          "  apps              - List installed system apps",
          "  open [app_id]     - Launch an application",
          "  ps / top          - List running processes (windows)",
          "  kill [window_id]  - Close a running process",
          "  theme [color]     - Change terminal color (emerald, amber, blue, rose, white)",
          "  uptime            - Show how long the session has been active",
          "  weather           - Get local weather (simulation)",
          "  history           - Show command history",
          "  clear / cls       - Clear the terminal screen",
          "  date / time       - Show current system time",
          "  ping [address]    - Test connection to a host",
          "  echo [text]       - Display text",
          "  sudo [command]    - Execute with 'root' privileges",
          "  restart           - Reboot the system",
          "  exit              - Terminate CLI session",
        ];
        break;

      case "identity":
      case "whoami":
        response = [
          `USER:     ${profileData.name}`,
          `ROLE:     ${profileData.role}`,
          `LOC:      ${profileData.location}`,
          `BIO:      ${profileData.bio}`,
          `STATUS:   ${profileData.status}`,
        ];
        break;

      case "skills":
        response = [
          "TECHNICAL EXPERTISE:",
          ...profileData.systemInfo.stack.map(skill => `  • ${skill}`),
        ];
        break;

      case "contact":
        response = [
          "CONTACT INFORMATION:",
          `  EMAIL:    ${profileData.links.email}`,
          `  GITHUB:   ${profileData.links.github}`,
          `  LINKEDIN: ${profileData.links.linkedin}`,
        ];
        break;

      case "socials":
        response = [
          "SOCIAL CHANNELS:",
          "  GitHub:   github.com/rammirtimbas",
          "  LinkedIn: linkedin.com/in/rammirtimbas",
        ];
        break;

      case "projects":
      case "dir":
        response = [
          "PORTFOLIO ARTIFACTS:",
          ...projects.map(p => `  [${p.status.toUpperCase()}] ${p.id.padEnd(20)} - ${p.title}`),
          "",
          "Use 'cat [project_id]' to see more details."
        ];
        break;

      case "cat":
        if (!argStr) {
          response = "Usage: cat [project_id]";
        } else {
          const project = projects.find(p => p.id === argStr || p.title.toLowerCase() === argStr);
          if (project) {
            response = [
              `PROJECT: ${project.title}`,
              `STATUS:  ${project.status.toUpperCase()}`,
              `TAGS:    ${project.stack.join(", ")}`,
              `DESC:    ${project.longDescription || project.description}`,
              project.github ? `REPO:    ${project.github}` : "",
            ].filter(Boolean);
          } else {
            response = `cat: ${argStr}: No such artifact found.`;
          }
        }
        break;

      case "neofetch":
      case "sys":
      case "fetch":
        response = (
          <div className="flex gap-4 py-2">
            <div className={`${terminalColor.replace('/90', '')} font-bold leading-tight hidden sm:block`}>
              {`      _     _            _   _ _
     (_)   | |          | | (_) |
      _  __| | ___ _ __ | |_ _| |_ _   _
     | |/ _\` |/ _ \\ '_ \\| __| | __| | | |
     | | (_| |  __/ | | | |_| | |_| |_| |
     |_|\\__,_|\\___|_| |_|\\__|_|\\__|\\__, |
                                    __/ |
                                   |___/ `}
            </div>
            <div className="space-y-1">
              <div className={`${terminalColor.replace('/90', '')} font-bold`}>{profileData.name.toLowerCase().replace(" ", "")}@identity</div>
              <div className="text-zinc-500">-----------------</div>
              <div><span className={`${terminalColor.replace('/90', '')} font-bold`}>OS:</span> IdentityOS v1.0.42</div>
              <div><span className={`${terminalColor.replace('/90', '')} font-bold`}>Host:</span> {profileData.role} Workspace</div>
              <div><span className={`${terminalColor.replace('/90', '')} font-bold`}>Kernel:</span> {profileData.systemInfo.kernel}</div>
              <div><span className={`${terminalColor.replace('/90', '')} font-bold`}>Uptime:</span> {profileData.systemInfo.uptime}</div>
              <div><span className={`${terminalColor.replace('/90', '')} font-bold`}>Packages:</span> {apps.length} (appx)</div>
              <div><span className={`${terminalColor.replace('/90', '')} font-bold`}>Shell:</span> IdentityBash 5.0</div>
              <div><span className={`${terminalColor.replace('/90', '')} font-bold`}>Resolution:</span> {window.innerWidth}x{window.innerHeight}</div>
              <div><span className={`${terminalColor.replace('/90', '')} font-bold`}>UI:</span> {profileData.systemInfo.uiLayer}</div>
            </div>
          </div>
        );
        break;

      case "ps":
      case "top":
        response = [
          "RUNNING PROCESSES:",
          "PID".padEnd(38) + " APP_ID".padEnd(20) + " TITLE",
          ...windows.map(w => `${w.id.padEnd(38)} ${w.appId.padEnd(20)} ${w.title}`)
        ];
        break;

      case "kill":
        if (!argStr) {
          response = "Usage: kill [window_id]";
        } else {
          const windowToKill = windows.find(w => w.id === argStr || w.appId === argStr);
          if (windowToKill) {
            closeWindow(windowToKill.id);
            response = `Terminated process ${windowToKill.id} (${windowToKill.title})`;
          } else {
            response = `kill: ${argStr}: Process not found.`;
          }
        }
        break;

      case "open":
        const targetApp = apps.find(a => a.id === argStr || a.title.toLowerCase() === argStr);
        if (targetApp) {
          response = `Initializing ${targetApp.title}...`;
          openWindow({
            id: crypto.randomUUID(),
            appId: targetApp.id,
            title: targetApp.title,
            position: {
              x: window.innerWidth / 2 - targetApp.defaultSize.width / 2 + (Math.random() * 40),
              y: window.innerHeight / 2 - targetApp.defaultSize.height / 2 + (Math.random() * 40),
            },
            isMaximized: targetApp.defaultMaximized ?? false,
            size: targetApp.defaultSize,
            minSize: { width: 420, height: 300 },
          });
        } else if (!argStr) {
          response = "Usage: open [app_id]";
        } else {
          response = `Error: Application '${argStr}' not found.`;
        }
        break;

      case "uptime":
        const seconds = Math.floor((Date.now() - startTime) / 1000);
        const mins = Math.floor(seconds / 60);
        response = `Terminal uptime: ${mins}m ${seconds % 60}s`;
        break;

      case "weather":
        response = [
          "Fetching local conditions...",
          `Location: ${profileData.location}`,
          "Condition: Clear / High Performance",
          "Temperature: 24°C / 75°F",
          "Humidity: 45%",
          "Forecast: Continued growth and scalability."
        ];
        break;

      case "theme":
        const colors: Record<string, string> = {
          emerald: "text-emerald-500/90",
          amber: "text-amber-500/90",
          blue: "text-blue-500/90",
          rose: "text-rose-500/90",
          white: "text-zinc-100/90",
        };
        if (colors[argStr]) {
          setTerminalColor(colors[argStr]);
          response = `Terminal theme set to ${argStr}.`;
        } else {
          response = `Available themes: ${Object.keys(colors).join(", ")}`;
        }
        break;

      case "pwd":
        response = "/home/visitor/identity";
        break;

      case "history":
        response = commandHistory.map((h, i) => `  ${i + 1}  ${h}`);
        break;

      case "ping":
        if (!argStr) {
          response = "Usage: ping [address]";
        } else {
          response = [
            `PING ${argStr} (${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}): 56 data bytes`,
            `64 bytes from ${argStr}: icmp_seq=0 ttl=64 time=${(Math.random() * 10).toFixed(3)} ms`,
            `64 bytes from ${argStr}: icmp_seq=1 ttl=64 time=${(Math.random() * 10).toFixed(3)} ms`,
            `64 bytes from ${argStr}: icmp_seq=2 ttl=64 time=${(Math.random() * 10).toFixed(3)} ms`,
            "",
            `--- ${argStr} ping statistics ---`,
            "3 packets transmitted, 3 packets received, 0.0% packet loss",
          ];
        }
        break;

      case "sudo":
        response = [
          "Nice try. This incident will be reported.",
          "Just kidding. You don't have enough sudo privileges yet."
        ];
        break;

      case "restart":
      case "reboot":
        response = "System rebooting...";
        setTimeout(() => window.location.reload(), 1000);
        break;

      case "date":
      case "time":
        response = new Date().toLocaleString();
        break;

      case "echo":
        response = argStr || "";
        break;

      case "cls":
      case "clear":
        setHistory([]);
        setInput("");
        return;

      case "exit":
        response = "Session terminated. You may now close this window.";
        break;

      default:
        response = `'${cmd}' is not recognized as an internal or external command. Type 'help' for assistance.`;
    }

    const newLines = Array.isArray(response) ? response : [response];
    setHistory([...history, (
      <div className="flex gap-2">
        <span className={`${terminalColor.replace('/90', '')} font-bold`}>visitor@identity:~$</span>
        <span>{input}</span>
      </div>
    ), ...newLines, ""]);
    setInput("");
  };

  return (
    <div
      className={`flex h-full flex-col bg-black p-4 font-mono text-[11px] md:text-sm leading-relaxed ${terminalColor} overflow-hidden`}
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-0.5 custom-scrollbar selection:bg-white/20 selection:text-white">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
        <form onSubmit={handleCommand} className="flex gap-1 md:gap-2 pt-1">
          <span className={`${terminalColor.replace('/90', '')} font-bold shrink-0`}>visitor@identity:~$</span>
          <input
            ref={inputRef}
            autoFocus
            className="flex-1 bg-transparent outline-none border-none text-inherit p-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            inputMode="text"
          />
        </form>
      </div>
    </div>
  );
}
