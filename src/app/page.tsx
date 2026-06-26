"use client";

import { useEffect, useState } from "react";

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

  return (
    <div className="space-y-12 pb-12">
      <section>
        <h1 className="font-serif text-3xl font-bold normal-case mb-4">Executive Summary</h1>
        <div className="memo-border p-6 bg-white max-w-2xl">
          <p className="normal-case text-base leading-relaxed text-foreground">
            E. Zhou is a Software Engineer specializing in scalable backend infrastructure 
            and AI-driven systems. Target environment designated as fast-paced, high-ownership 
            startup sectors. Big Tech bureaucracy explicitly avoided.
          </p>
          <div className="mt-4 pt-4 memo-border-top text-xs text-primary font-bold">
            STATUS: AVAILABLE FOR DEPLOYMENT // LOC: NYC
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-bold text-lg">LIVE BIOMETRIC TELEMETRY</h2>
        
        <div className="memo-border">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border bg-white">
            
            <div className="p-4">
              <div className="text-muted-foreground mb-2">RESTING HR</div>
              {!vitals ? (
                <div className="animate-pulse bg-muted h-6 w-16" />
              ) : (
                <div className="font-serif text-3xl font-bold normal-case">{vitals.restingHeartRate} <span className="text-sm font-sans uppercase font-normal text-muted-foreground">BPM</span></div>
              )}
            </div>

            <div className="p-4">
              <div className="text-muted-foreground mb-2">SLEEP DURATION / SCORE</div>
              {!vitals ? (
                <div className="animate-pulse bg-muted h-6 w-32" />
              ) : (
                <div className="font-serif text-3xl font-bold normal-case">{vitals.sleepDuration} <span className="text-sm font-sans uppercase font-normal text-muted-foreground">({vitals.sleepScore})</span></div>
              )}
            </div>

            <div className="p-4">
              <div className="text-muted-foreground mb-2">STEPS (24H)</div>
              {!vitals ? (
                <div className="animate-pulse bg-muted h-6 w-24" />
              ) : (
                <div className="font-serif text-3xl font-bold normal-case">{vitals.stepsToday.toLocaleString()}</div>
              )}
            </div>

          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-bold text-lg">ENVIRONMENTAL CONDITIONS</h2>
        
        <div className="memo-border p-4 bg-white">
          {!weather ? (
             <div className="animate-pulse bg-muted h-6 w-64" />
          ) : (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-muted-foreground mb-1">LOCATION</div>
                <div className="font-serif text-2xl font-bold normal-case">{weather.location}</div>
                <div className="text-xs mt-1">{weather.localTime} {weather.timezone}</div>
              </div>
              <div className="text-left md:text-right">
                <div className="text-muted-foreground mb-1">ATMOSPHERE</div>
                <div className="font-serif text-2xl font-bold normal-case">{weather.temperature}°F</div>
                <div className="text-xs mt-1">{weather.condition}</div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
