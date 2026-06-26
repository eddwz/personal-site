"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [vitals, setVitals] = useState<any>(null);

  useEffect(() => {
    fetch("/api/vitals")
      .then((res) => res.json())
      .then(setVitals);
  }, []);

  return (
    <div className="space-y-16">
      
      <section className="space-y-4">
        <h1 className="font-serif text-2xl font-medium text-ink">Personal Dashboard</h1>
        <p className="text-ink-soft leading-relaxed max-w-[60ch]">
          I'm a Software Engineer who builds scalable backend infrastructure and AI-driven systems. 
          I prefer fast-paced, high-ownership startup environments in NYC over Big Tech bureaucracy.
        </p>
      </section>

      <hr />

      <section className="space-y-6">
        <h2 className="font-serif text-xl font-medium text-ink">Live Context</h2>
        <ul className="list-notebook text-ink-soft space-y-4 font-mono text-sm">
          
          <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <span className="text-ink w-48">Resting Heart Rate</span>
            {!vitals ? (
              <span className="animate-pulse bg-rule h-4 w-16 inline-block rounded" />
            ) : (
              <span>{vitals.restingHeartRate} bpm</span>
            )}
          </li>

          <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <span className="text-ink w-48">Sleep</span>
            {!vitals ? (
              <span className="animate-pulse bg-rule h-4 w-32 inline-block rounded" />
            ) : (
              <span>{vitals.sleepDuration} (Score: {vitals.sleepScore})</span>
            )}
          </li>

          <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <span className="text-ink w-48">Steps Today</span>
            {!vitals ? (
              <span className="animate-pulse bg-rule h-4 w-20 inline-block rounded" />
            ) : (
              <span>{vitals.stepsToday.toLocaleString()}</span>
            )}
          </li>

          <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <span className="text-ink w-48">Weight</span>
            {!vitals ? (
              <span className="animate-pulse bg-rule h-4 w-16 inline-block rounded" />
            ) : (
              <span>{vitals.weight} lbs</span>
            )}
          </li>

        </ul>
      </section>

      <hr />

      <section className="space-y-4">
        <h2 className="font-serif text-xl font-medium text-ink">Connect</h2>
        <p className="text-ink-soft">
          Currently open to full-time roles in NYC.
        </p>
        <ul className="list-notebook text-ink-soft space-y-2">
          <li><a href="mailto:hello@example.com">Email</a></li>
          <li><a href="https://www.linkedin.com/in/eddiezh0u/?skipRedirect=true" target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li><a href="https://github.com/eddiezh0u" target="_blank" rel="noreferrer">GitHub</a></li>
        </ul>
      </section>
      
    </div>
  );
}
