"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { registerForEarlyAccess } from "@/app/actions/register";

export function EarlyAccessSection() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [role, setRole] = useState("Player");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({ name: "", email: "" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // Basic Validation
    let newErrors = { name: "", email: "" };
    let isValid = true;
    setSubmitError("");

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      setIsSubmitting(true);
      
      const response = await registerForEarlyAccess({
        ...formData,
        role,
      });

      setIsSubmitting(false);

      if (response.success) {
        setSubmitted(true);
      } else {
        setSubmitError(response.error || "Something went wrong.");
      }
    }
  }

  return (
    <section id="early-access" className="bg-[#171717] py-24 sm:py-32 relative isolate overflow-hidden">
      
      {/* Decorative Blur */}
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-[#F75A0A] opacity-10 blur-[100px]" />
      <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[#FFD166] opacity-10 blur-[80px]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-2 gap-16 items-center">
        
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFD166]">
            Founding members
          </p>
          <h2 className="mt-4 font-serif text-5xl sm:text-6xl text-white leading-tight">
            Get on the pitch <br /> early.
          </h2>
          <p className="mt-6 text-xl text-stone-300 leading-relaxed font-medium">
            Join the first wave of players, teams, organizers, and scouts building a better record for grassroots football.
          </p>
          
          <div className="mt-8 space-y-4 text-sm text-stone-200">
            <p className="flex items-center gap-3">
              <CheckCircle2 className="text-[#FFD166]" size={20} /> 
              Priority access at launch
            </p>
            <p className="flex items-center gap-3">
              <CheckCircle2 className="text-[#FFD166]" size={20} /> 
              Create your verified football profile
            </p>
            <p className="flex items-center gap-3">
              <CheckCircle2 className="text-[#FFD166]" size={20} /> 
              Early product updates and feedback access
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-[#F75A0A] to-[#FFD166] opacity-20 blur-xl" />
          <div className="rounded-2xl bg-[#F7F4EE] p-8 sm:p-10 text-black shadow-2xl relative z-10">
            
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                  >
                    <CheckCircle2 className="mx-auto text-[#F75A0A]" size={64} />
                  </motion.div>
                  <h3 className="mt-6 text-3xl font-bold">You&apos;re on the list.</h3>
                  <p className="mt-3 text-stone-600 text-lg">
                    Thanks — we&apos;ll let you know when Foot Heroes is ready.
                  </p>
                  <button 
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "" });
                    }}
                    className="mt-8 text-sm font-bold text-[#F75A0A] hover:text-[#D94801]"
                  >
                    Register another account
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-2xl font-bold">Register your interest</h3>
                  <p className="mt-2 text-sm text-stone-600">No payment or commitment required.</p>
                  
                  <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
                    <div>
                      <label className="block text-sm font-bold text-stone-800">Full Name *</label>
                      <input 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`mt-2 w-full rounded-xl border-2 bg-white px-4 py-3 outline-none transition-colors ${errors.name ? 'border-red-500 focus:ring-red-500/10' : 'border-stone-200 focus:border-[#F75A0A] focus:ring-4 focus:ring-[#F75A0A]/10'}`} 
                        placeholder="John Doe" 
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-stone-800">Email Address *</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`mt-2 w-full rounded-xl border-2 bg-white px-4 py-3 outline-none transition-colors ${errors.email ? 'border-red-500 focus:ring-red-500/10' : 'border-stone-200 focus:border-[#F75A0A] focus:ring-4 focus:ring-[#F75A0A]/10'}`} 
                        placeholder="john@example.com" 
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-stone-800">Phone Number (Optional)</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-2 w-full rounded-xl border-2 border-stone-200 bg-white px-4 py-3 outline-none transition-colors focus:border-[#F75A0A] focus:ring-4 focus:ring-[#F75A0A]/10" 
                        placeholder="+91 98765 43210" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-stone-800">Football Role</label>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {["Player", "Coach", "Organizer", "Fan"].map((item) => (
                          <button 
                            type="button" 
                            onClick={() => setRole(item)} 
                            key={item} 
                            className={`rounded-lg border-2 px-2 py-2.5 text-xs font-bold transition-all ${
                              role === item 
                                ? "border-[#F75A0A] bg-[#F75A0A] text-white shadow-md" 
                                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <button 
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-[#F75A0A] py-4 font-bold text-white transition-colors hover:bg-[#D94801] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={18} /> Processing...
                        </>
                      ) : (
                        <>
                          Join Early Access <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                    
                    {submitError && (
                      <div className="mt-4 text-center text-sm font-bold text-red-500 bg-red-500/10 py-3 rounded-lg border border-red-500/20">
                        {submitError}
                      </div>
                    )}
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </section>
  );
}

// Needed because AnimatePresence is used but not imported from framer-motion above.
// Will add import explicitly.
