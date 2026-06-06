import { motion } from "framer-motion";
import { Construction } from "lucide-react";

export function PlaceholderPage({ title }) {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center text-center">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mb-6 rounded-3xl bg-amber-500/10 p-6 text-amber-500"
      >
        <Construction className="h-16 w-16" />
      </motion.div>
      <h1 className="text-4xl font-black text-white">{title}</h1>
      <p className="mt-4 max-w-md text-slate-400">
        This section is currently under development to ensure a world-class experience. 
        Stay tuned for the full release of <strong>SchoolzPro</strong>!
      </p>
    </div>
  );
}

export const MyExamsPage = () => <PlaceholderPage title="My Exams" />;
export const LeaderboardPage = () => <PlaceholderPage title="Leaderboard" />;
export const SettingsPage = () => <PlaceholderPage title="Settings" />;
export const AllStudentsPage = () => <PlaceholderPage title="All Students" />;
