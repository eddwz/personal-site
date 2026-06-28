"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ChartCard({ title, data, dataKey, color, unit, isLoading }: any) {
  if (isLoading) {
    return (
      <div className="border border-rule bg-rule/5 rounded-xl p-4 flex flex-col h-48 shadow-sm backdrop-blur transition-all">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-ink-soft text-sm font-medium">{title}</h3>
          <span className="animate-pulse bg-rule h-4 w-12 rounded"></span>
        </div>
        <div className="flex-1 w-full bg-rule/20 animate-pulse rounded-md" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="border border-rule rounded-xl p-4 flex flex-col items-center justify-center h-48 bg-rule/5 shadow-sm backdrop-blur">
        <span className="text-ink-soft text-sm">No historical data</span>
      </div>
    );
  }

  // Calculate min and max for the Y axis to zoom in on the data appropriately
  const values = data.map((d: any) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  // Add some padding to domain
  const domainMin = Math.max(0, min - (max - min) * 0.2);
  const domainMax = max + (max - min) * 0.2;

  return (
    <div className="border border-rule rounded-xl p-4 flex flex-col h-48 group hover:border-ink/30 transition-colors shadow-sm bg-rule/5 backdrop-blur relative overflow-hidden">
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="text-ink-soft text-sm font-medium">{title}</h3>
        <span className="text-ink text-sm font-mono">{data[data.length - 1].value} {unit}</span>
      </div>
      <div className="flex-1 w-full min-h-0 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color-${dataKey}-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={[domainMin, domainMax]} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--paper)', borderColor: 'var(--rule)', borderRadius: '8px', fontSize: '12px', color: 'var(--ink)' }}
              itemStyle={{ color: 'var(--ink)' }}
              labelStyle={{ color: 'var(--ink-soft)', marginBottom: '4px' }}
              formatter={(value: any) => [`${value} ${unit}`, title]}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#color-${dataKey}-${title.replace(/\s+/g, '')})`} 
              strokeWidth={2}
              activeDot={{ r: 4, strokeWidth: 0, fill: color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Home() {
  const [vitals, setVitals] = useState<any>(null);
  const [days, setDays] = useState<30 | 70 | 90>(30);

  useEffect(() => {
    fetch("/api/vitals")
      .then((res) => res.json())
      .then(setVitals);
  }, []);

  const filterData = (data: any[]) => {
    if (!data) return [];
    return data.slice(-days); // Since data is newest last, slice from the end
  };

  return (
    <div className="space-y-16 pb-16">
      
      <section className="space-y-4">
        <h1 className="font-serif text-2xl font-medium text-ink">Personal Dashboard</h1>
        <p className="text-ink-soft leading-relaxed max-w-[60ch]">
          I'm a Software Engineer who builds scalable backend infrastructure and AI-driven systems.
        </p>
      </section>

      <hr />

      <section className="space-y-6">
        <h2 className="font-serif text-xl font-medium text-ink flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <span>Live Context</span>
          {vitals && vitals.timestamp && (
            <span className="text-xs font-sans text-ink-soft opacity-70">
              As of {new Date(vitals.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </span>
          )}
        </h2>
        
        {/* New Grid Layout for Live Context */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="bg-rule/10 border border-rule rounded-xl p-4 shadow-sm backdrop-blur flex flex-col">
            <span className="text-ink-soft text-xs mb-2 font-medium">Resting HR</span>
            {!vitals ? (
              <span className="animate-pulse bg-rule h-6 w-16 rounded" />
            ) : (
              <span className="text-ink font-mono text-lg">{vitals.restingHeartRate} <span className="text-xs text-ink-soft">bpm</span></span>
            )}
          </div>

          <div className="bg-rule/10 border border-rule rounded-xl p-4 shadow-sm backdrop-blur flex flex-col">
            <span className="text-ink-soft text-xs mb-2 font-medium">Sleep</span>
            {!vitals ? (
              <span className="animate-pulse bg-rule h-6 w-20 rounded" />
            ) : (
              <span className="text-ink font-mono text-lg">{vitals.sleepDuration} <span className="text-xs text-ink-soft">score: {vitals.sleepScore}</span></span>
            )}
          </div>

          <div className="bg-rule/10 border border-rule rounded-xl p-4 shadow-sm backdrop-blur flex flex-col">
            <span className="text-ink-soft text-xs mb-2 font-medium">Steps Today</span>
            {!vitals ? (
              <span className="animate-pulse bg-rule h-6 w-20 rounded" />
            ) : (
              <span className="text-ink font-mono text-lg">{vitals.stepsToday.toLocaleString()}</span>
            )}
          </div>

          <div className="bg-rule/10 border border-rule rounded-xl p-4 shadow-sm backdrop-blur flex flex-col">
            <span className="text-ink-soft text-xs mb-2 font-medium">Weight</span>
            {!vitals ? (
              <span className="animate-pulse bg-rule h-6 w-16 rounded" />
            ) : (
              <span className="text-ink font-mono text-lg">{vitals.weight} <span className="text-xs text-ink-soft">lbs</span></span>
            )}
          </div>

        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-medium text-ink">Historical Trends</h2>
          
          <div className="flex items-center bg-rule/30 rounded-full p-1 text-xs font-mono backdrop-blur">
            {[30, 70, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d as any)}
                className={`px-3 py-1 rounded-full transition-colors ${days === d ? 'bg-paper shadow-sm text-ink' : 'text-ink-soft hover:text-ink'}`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ChartCard 
            title="Weight" 
            isLoading={!vitals}
            data={vitals ? filterData(vitals.historicalWeight) : []} 
            dataKey="value" 
            color="#60a5fa" // blue-400 (glowy for dark mode)
            unit="lbs"
          />
          <ChartCard 
            title="Resting HR" 
            isLoading={!vitals}
            data={vitals ? filterData(vitals.historicalHR) : []} 
            dataKey="value" 
            color="#f87171" // red-400
            unit="bpm"
          />
          <ChartCard 
            title="Sleep" 
            isLoading={!vitals}
            data={vitals ? filterData(vitals.historicalSleep) : []} 
            dataKey="value" 
            color="#a855f7" // purple-500
            unit="hrs"
          />
          <ChartCard 
            title="HRV" 
            isLoading={!vitals}
            data={vitals ? filterData(vitals.historicalHRV) : []} 
            dataKey="value" 
            color="#34d399" // emerald-400
            unit="ms"
          />
        </div>
      </section>

      <hr />

      <section className="space-y-4">
        <h2 className="font-serif text-xl font-medium text-ink">Connect</h2>
        <p className="text-ink-soft">
          Currently open to full-time roles in NYC.
        </p>
        <ul className="list-notebook text-ink-soft space-y-2">
          <li><a href="mailto:eddiezhou05@gmail.com">Email</a></li>
          <li><a href="https://www.linkedin.com/in/eddiezh0u/?skipRedirect=true" target="_blank" rel="noreferrer">LinkedIn</a></li>
        </ul>
      </section>
      
    </div>
  );
}
