"use client";

import { motion } from "framer-motion";
import { Activity, BarChart3, Users, Trophy, CalendarDays, ListOrdered, TrendingUp, MessageCircle } from "lucide-react";

const features = [
  {
    icon: <Activity size={24} className="text-[#F75A0A]" />,
    title: "Live Match Scoring",
    description: "Real-time updates, goals, cards, and substitutions straight from the pitch to the app."
  },
  {
    icon: <BarChart3 size={24} className="text-[#FFD166]" />,
    title: "Player Statistics",
    description: "Your digital football CV. Track goals, assists, clean sheets, and career milestones."
  },
  {
    icon: <Users size={24} className="text-[#F75A0A]" />,
    title: "Team Profiles",
    description: "Manage your squad, track team form, and build a historic record of your club's success."
  },
  {
    icon: <Trophy size={24} className="text-[#FFD166]" />,
    title: "Tournament Management",
    description: "Organize leagues and cups seamlessly with automated standings and knockout brackets."
  },
  {
    icon: <CalendarDays size={24} className="text-[#F75A0A]" />,
    title: "Fixtures & Results",
    description: "Never miss a match. See who is playing where, and check historical results instantly."
  },
  {
    icon: <ListOrdered size={24} className="text-[#FFD166]" />,
    title: "Leaderboards",
    description: "See who the top scorers and assist kings are across your city's local leagues."
  },
  {
    icon: <TrendingUp size={24} className="text-[#F75A0A]" />,
    title: "Player Performance",
    description: "Get rated match-by-match. Earn Man of the Match awards and build your reputation."
  },
  {
    icon: <MessageCircle size={24} className="text-[#FFD166]" />,
    title: "Football Community",
    description: "Connect with local players, find ringers for your 5-a-side, and scout new talent."
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-[#111111] py-24 sm:py-32 border-t border-stone-800">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FFD166]">
            The Platform
          </p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl text-white leading-tight">
            Everything Football, <br />
            <span className="text-stone-400">In One Place.</span>
          </h2>
          <p className="mt-4 text-lg text-stone-400">
            Say goodbye to scattered WhatsApp groups and Excel sheets. Foot Heroes brings professional-grade organization to your local game.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-[2rem] border border-stone-800 bg-[#171717] p-8 sm:p-10 transition-all hover:border-stone-600 hover:bg-[#202020]"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-black/50 border border-stone-800 transition-colors group-hover:border-stone-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-sm text-stone-400 leading-relaxed font-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
