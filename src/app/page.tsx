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

function ChartCard({ title, data, dataKey, color, unit }: any) {
  if (!data || data.length === 0) {
    return (
      <div className="border border-rule rounded-lg p-4 flex flex-col items-center justify-center h-48 bg-rule/20">
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
    <div className="border border-rule rounded-lg p-4 flex flex-col h-48 group hover:border-ink/20 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-ink-soft text-sm font-medium">{title}</h3>
        <span className="text-ink text-sm font-mono">{data[data.length - 1].value} {unit}</span>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color-${dataKey}-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={[domainMin, domainMax]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#111' }}
              labelStyle={{ color: '#666', marginBottom: '4px' }}
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
        <h2 className="font-serif text-xl font-medium text-ink flex items-baseline justify-between">
          <span>Live Context</span>
          {vitals && vitals.timestamp && (
            <span className="text-xs font-sans text-ink-soft opacity-70">
              As of {new Date(vitals.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </span>
          )}
        </h2>
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

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-medium text-ink">Historical Trends</h2>
          
          <div className="flex items-center bg-rule/30 rounded-full p-1 text-xs font-mono">
            {[30, 70, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d as any)}
                className={`px-3 py-1 rounded-full transition-colors ${days === d ? 'bg-white shadow-sm text-ink' : 'text-ink-soft hover:text-ink'}`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ChartCard 
            title="Weight" 
            data={vitals ? filterData(vitals.historicalWeight) : []} 
            dataKey="value" 
            color="#3b82f6" 
            unit="lbs"
          />
          <ChartCard 
            title="Resting HR" 
            data={vitals ? filterData(vitals.historicalHR) : []} 
            dataKey="value" 
            color="#ef4444" 
            unit="bpm"
          />
          <ChartCard 
            title="Sleep" 
            data={vitals ? filterData(vitals.historicalSleep) : []} 
            dataKey="value" 
            color="#8b5cf6" 
            unit="hrs"
          />
          <ChartCard 
            title="HRV" 
            data={vitals ? filterData(vitals.historicalHRV) : []} 
            dataKey="value" 
            color="#10b981" 
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
