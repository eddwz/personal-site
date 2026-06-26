"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Activity, Moon, MapPin, Cloud, Zap, Footprints } from "lucide-react";

export default function Home() {
  const [vitals, setVitals] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetch("/api/vitals")
      .then((res) => res.json())
      .then(setVitals);

    fetch("/api/weather")
      .then((res) => res.json())
      .then(setWeather);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="space-y-20"
    >
      <motion.section variants={itemVariants} className="space-y-6 pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-sm font-medium shadow-sm">
          <Zap size={14} className="fill-blue-600" />
          <span>Available for full-time roles in NYC</span>
        </div>
        <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight text-foreground">
          Hi, I'm Eddie.
        </h1>
        <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-2xl">
          I'm a Software Engineer who builds scalable backend infrastructure and AI-driven systems. 
          I prefer fast-paced, high-ownership startup environments over Big Tech bureaucracy.
        </p>
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-8">
        <h2 className="font-display text-2xl font-semibold text-foreground">Live Context</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Heart Rate Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity size={80} />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
              <Activity size={16} className="text-rose-500" />
              Resting HR
            </div>
            <div className="mt-auto">
              {!vitals ? (
                <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-slate-800">{vitals.restingHeartRate}</span>
                  <span className="text-muted-foreground text-sm font-medium">bpm</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sleep Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group lg:col-span-2"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Moon size={80} />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
              <Moon size={16} className="text-indigo-500" />
              Sleep Recovery
            </div>
            <div className="mt-auto flex flex-col sm:flex-row gap-4 sm:gap-12">
              {!vitals ? (
                <div className="h-8 w-32 bg-muted rounded animate-pulse" />
              ) : (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold text-slate-800">{vitals.sleepDuration}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Score</span>
                    <span className="font-display text-4xl font-bold text-indigo-500">{vitals.sleepScore}</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Steps Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group"
          >
            <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
              <Footprints size={16} className="text-emerald-500" />
              Steps
            </div>
            <div className="mt-auto">
              {!vitals ? (
                <div className="h-8 w-24 bg-muted rounded animate-pulse" />
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-slate-800">{vitals.stepsToday.toLocaleString()}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Location & Weather Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-6 flex flex-col gap-4 md:col-span-2 lg:col-span-4"
          >
            <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
              <MapPin size={16} className="text-primary" />
              Current Location
            </div>
            
            {!weather ? (
              <div className="h-12 w-64 bg-muted rounded animate-pulse mt-2" />
            ) : (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-2">
                <div>
                  <h3 className="font-display text-3xl font-bold text-slate-800">{weather.location}</h3>
                  <p className="text-muted-foreground mt-1">{weather.localTime} {weather.timezone}</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <Cloud size={32} className="text-sky-500" />
                  <div>
                    <div className="font-display text-2xl font-bold text-slate-800">{weather.temperature}°F</div>
                    <div className="text-muted-foreground text-sm">{weather.condition}</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

        </div>
      </motion.section>
    </motion.div>
  );
}
