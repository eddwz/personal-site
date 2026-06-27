import { NextResponse } from "next/server";
import { hasGoogleHealth, listAllDataPoints } from "@/lib/googleHealth";

export const revalidate = 1800; // Cache for 30 minutes

export async function GET() {
  if (!hasGoogleHealth()) {
    // Return mock data if no credentials are provided
    return NextResponse.json({
      restingHeartRate: 58,
      sleepDuration: "7h 14m",
      sleepScore: 88,
      stepsToday: 12450,
      weight: "165.2 lbs",
      timestamp: new Date().toISOString(),
      historicalHR: [{ date: "2026-06-20", value: 55 }, { date: "2026-06-21", value: 56 }, { date: "2026-06-22", value: 58 }],
      historicalSleep: [{ date: "2026-06-20", value: 7.2 }, { date: "2026-06-21", value: 6.8 }, { date: "2026-06-22", value: 8.1 }],
      historicalWeight: [{ date: "2026-06-20", value: 166.5 }, { date: "2026-06-21", value: 166.0 }, { date: "2026-06-22", value: 165.2 }],
      historicalHRV: [{ date: "2026-06-20", value: 45 }, { date: "2026-06-21", value: 48 }, { date: "2026-06-22", value: 52 }]
    });
  }

  try {
    let restingHeartRate = "--";
    let sleepDuration = "--";
    let sleepScore = "--";
    let stepsToday = "--";
    let weight = "--";
    
    let historicalHR: any[] = [];
    let historicalSleep: any[] = [];
    let historicalWeight: any[] = [];
    let historicalHRV: any[] = [];

    // 1. Fetch Resting Heart Rate (90 items)
    try {
      const hrPoints = await listAllDataPoints("daily-resting-heart-rate", undefined, 90);
      if (hrPoints.length > 0) {
        const latestHr = hrPoints[hrPoints.length - 1];
        if (latestHr.dailyRestingHeartRate?.beatsPerMinute) {
          restingHeartRate = latestHr.dailyRestingHeartRate.beatsPerMinute;
        }
        historicalHR = hrPoints.map((pt: any) => ({
          date: pt.dailyRestingHeartRate?.date || pt.startTime || "Unknown",
          value: pt.dailyRestingHeartRate?.beatsPerMinute || 0
        })).filter((pt: any) => pt.value > 0);
      }
    } catch (e) {
      console.error("HR fetch failed", e);
    }

    // 2. Fetch Sleep (90 items)
    try {
      const sleepPoints = await listAllDataPoints("sleep", undefined, 90);
      if (sleepPoints.length > 0) {
        const latestSleep = sleepPoints[sleepPoints.length - 1];
        if (latestSleep.sleep?.summary?.minutesAsleep) {
          const minutes = parseInt(latestSleep.sleep.summary.minutesAsleep);
          const h = Math.floor(minutes / 60);
          const m = minutes % 60;
          sleepDuration = `${h}h ${m}m`;
          sleepScore = minutes > 420 ? "Good" : "Fair"; 
        }
        historicalSleep = sleepPoints.map((pt: any) => {
          const m = parseInt(pt.sleep?.summary?.minutesAsleep || "0");
          return {
            date: pt.sleep?.interval?.civil_end_time?.split('T')[0] || "Unknown",
            value: Number((m / 60).toFixed(1)) // Convert to hours for charting
          };
        }).filter((pt: any) => pt.value > 0);
      }
    } catch (e) {
      console.error("Sleep fetch failed", e);
    }

    // 3. Fetch Steps (1 item for live context)
    try {
      const stepPoints = await listAllDataPoints("steps", undefined, 1);
      if (stepPoints.length > 0) {
        const latestSteps = stepPoints[stepPoints.length - 1];
        if (latestSteps.steps?.count) {
          stepsToday = latestSteps.steps.count;
        }
      }
    } catch (e) {
      console.error("Steps fetch failed", e);
    }

    // 4. Fetch Weight (90 items)
    try {
      const weightPoints = await listAllDataPoints("weight", undefined, 90);
      if (weightPoints.length > 0) {
        const latestWeight = weightPoints[0];
        if (latestWeight.weight?.value) {
          weight = `${latestWeight.weight.value}`;
        }
        historicalWeight = weightPoints.map((pt: any) => ({
          date: pt.startTime?.split('T')[0] || pt.weight?.date || "Unknown",
          value: pt.weight?.value || 0
        })).filter((pt: any) => pt.value > 0).reverse(); 
      }
    } catch (e) {
      console.error("Weight fetch failed", e);
    }

    // 5. Fetch HRV (90 items)
    try {
      const hrvPoints = await listAllDataPoints("heart-rate-variability", undefined, 90);
      if (hrvPoints.length > 0) {
        historicalHRV = hrvPoints.map((pt: any) => ({
          date: pt.startTime?.split('T')[0] || "Unknown",
          value: pt.heartRateVariability?.rmssd || pt.heartRateVariability?.value || 0
        })).filter((pt: any) => pt.value > 0).reverse();
      }
    } catch (e) {
      console.error("HRV fetch failed", e);
    }

    return NextResponse.json({
      restingHeartRate,
      sleepDuration,
      sleepScore,
      stepsToday,
      weight,
      timestamp: new Date().toISOString(),
      historicalHR,
      historicalSleep,
      historicalWeight,
      historicalHRV
    });

  } catch (error: any) {
    console.error("Vitals fetch failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
