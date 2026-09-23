"use client";

import { motion } from "framer-motion";
import { User, Shield, Whistle, Map, Heart } from "lucide-react"; // Using Whistle (not standard, will use Megaphone instead if needed, let's stick to standard ones like User, Shield, Megaphone, Flag, Heart)
import { Flag, Megaphone } from "lucide-react";

const roles = [
  {
    id: "players",
    title: "For Players",
    icon: <User size={20} className="text-white" />,
    description: "Build your verified profile, track your career stats, and earn Man of the Match awards.",
    color: "bg-blue-600"
  },
  {
    id: "teams",
    title: "For Teams",
    icon: <Shield size={20} className="text-white" />,
    description: "Manage your squad, track team form, and build a historic record of your club's success.",
    color: "bg-[#F75A0A]"
  },
  {
    id: "coaches",
    title: "For Coaches",
    icon: <Megaphone size={20} className="text-white" />,
    description: "Analyze team performance, manage matchday squads, and track player development.",
    color: "bg-emerald-600"
  },
  {
    id: "organizers",
    title: "For Organizers",
    icon: <Flag size={20} className="text-white" />,
    description: "Run tournaments smoothly with automated brackets, live standings, and match scheduling.",
    color: "bg-[#FFD166]"
  },
  {
    id: "fans",
    title: "For Fans",
    icon: <Heart size={20} className="text-white" />,
    description: "Follow your favorite local teams, get live score updates, and support your friends.",
    color: "bg-purple-600"
  }
];

export function EcosystemSection() {
  return (
    <section className="bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl text-white leading-tight">
            Built For Everyone <br className="sm:hidden"/> In Football
          </h2>
          <p className="mt-4 text-lg text-stone-400">
            A complete ecosystem connecting every participant in the beautiful game.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex flex-col rounded-[2rem] border border-stone-800 bg-[#111111] p-8 overflow-hidden group hover:border-stone-700 transition-colors"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-stone-800 transition-colors duration-300" style={{ backgroundColor: "transparent" }} />
              
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ${role.color}`}>
                {role.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">{role.title}</h3>
              <p className="text-sm text-stone-400 leading-relaxed font-medium flex-1">
                {role.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
