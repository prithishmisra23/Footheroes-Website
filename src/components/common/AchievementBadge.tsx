import { Achievement } from "@/types";
import { Trophy, Shield, Star, Award, Goal } from "lucide-react";

interface AchievementBadgeProps {
  achievement: Achievement;
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const badgeConfig = {
    "GOLDEN_BOOT": { icon: Goal, color: "bg-[#F59E0B]", label: "Golden Boot" },
    "GOLDEN_GLOVE": { icon: Shield, color: "bg-[#3B82F6]", label: "Golden Glove" },
    "MVP": { icon: Star, color: "bg-purple-500", label: "MVP" },
    "TOURNAMENT_WINNER": { icon: Trophy, color: "bg-[#F59E0B]", label: "Champion" },
    "100_GOALS": { icon: Award, color: "bg-red-500", label: "100 Goals Club" }
  };

  const config = badgeConfig[achievement.type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm transition-all group">
      <div className={`w-12 h-12 rounded-full ${config.color} flex items-center justify-center text-white mb-2 shadow-inner group-hover:scale-110 transition-transform`}>
        <Icon size={20} />
      </div>
      <div className="text-center">
        <h4 className="font-bold text-[0.65rem] text-gray-900 dark:text-gray-50 uppercase tracking-wider leading-tight mb-0.5">{config.label}</h4>
        {achievement.season && (
          <p className="font-mono text-[0.6rem] text-gray-400 dark:text-gray-500">{achievement.season}</p>
        )}
      </div>
    </div>
  );
}
