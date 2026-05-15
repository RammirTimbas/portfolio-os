import { profileData } from "../../../data/profile";
import { BadgeCheck, MapPin } from "lucide-react";

export default function ProfileHeader() {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center p-6 border-b border-white/5 bg-white/5">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <img
          src={profileData.avatar}
          alt={profileData.name}
          className="relative h-24 w-24 rounded-2xl object-cover ring-1 ring-white/10"
        />
        <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-zinc-900 flex items-center justify-center border border-white/10">
          <BadgeCheck className="text-blue-400" size={14} />
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">{profileData.name}</h1>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
            {profileData.status}
          </span>
        </div>

        <p className="text-sm font-medium text-zinc-400 flex items-center gap-2">
          {profileData.role}
          <span className="h-1 w-1 rounded-full bg-zinc-700" />
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {profileData.location}
          </span>
        </p>

        <p className="text-xs text-zinc-500 leading-relaxed max-w-md">
          {profileData.bio}
        </p>
      </div>
    </div>
  );
}
