import { profileData } from "../../../data/profile";
import { Download, Mail, Code, Briefcase } from "lucide-react";
import { useResumeDownload } from "../../../hooks/useResumeDownload";

export default function ResumePanel() {
  const { downloadResume } = useResumeDownload();

  const handleEmailClick = () => {
    window.location.href = `mailto:${profileData.links.email}`;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profileData.links.email);
  };

  return (
    <div className="p-6 pt-0">
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 backdrop-blur-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-tight">Identity Artifacts</h3>
            <p className="text-xs text-zinc-400">Export developer profile or connect via system channels.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
              onClick={downloadResume}
            >
              <Download size={14} />
              Resume.pdf
            </button>
            <button
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              onClick={handleEmailClick}
            >
              <Mail size={14} />
              Hire Me
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-6">
          <div className="flex gap-4">
            <a
              href={profileData.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
              title="GitHub"
            >
              <Code size={18} />
            </a>
            <a
              href={profileData.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
              title="LinkedIn"
            >
              <Briefcase size={18} />
            </a>
          </div>

          <button
            onClick={handleCopyEmail}
            className="text-[10px] font-mono text-zinc-500 hover:text-blue-400 transition-colors"
          >
            {profileData.links.email}
          </button>
        </div>
      </div>
    </div>
  );
}
