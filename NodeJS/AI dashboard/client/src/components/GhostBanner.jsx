import { useStore } from '../store/uiStore';
import { EyeOff, X } from 'lucide-react';

export const GhostBanner = () => {
  const { impersonatedUser, stopImpersonation } = useStore();

  if (!impersonatedUser) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs md:text-sm font-medium px-4 py-2.5 flex items-center justify-between shadow-lg relative z-50 animate-bounce-short">
      <div className="flex items-center gap-2 mx-auto">
        <EyeOff size={16} className="animate-pulse" />
        <span>
          <strong>GHOST MODE ACTIVE:</strong> Impersonating <span className="underline decoration-wavy">{impersonatedUser.name}</span> ({impersonatedUser.role}). Actions across the dashboard are restricted to this role's permissions.
        </span>
        <button
          onClick={stopImpersonation}
          className="ml-3 bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-full font-semibold transition-all hover:scale-105 active:scale-95"
        >
          Exit Ghost Mode
        </button>
      </div>
    </div>
  );
};
