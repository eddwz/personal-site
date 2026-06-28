import { NextResponse } from "next/server";
import { hasGoogleHealth, listAllDataPoints } from "@/lib/googleHealth";

export const revalidate = 1800; // Cache for 30 minutes

function parseDate(dateObj: any, fallbackStr?: string) {
  if (dateObj?.year && dateObj?.month && dateObj?.day) {
    return `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`;
  }
  if (typeof dateObj === "string") return dateObj.split('T')[0];
  if (fallbackStr && typeof fallbackStr === "string") return fallbackStr.split('T')[0];
  return "Unknown";
}

export async function GET() {
  if (!hasGoogleHealth()) {
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

    const [hrPoints, sleepPoints, stepPoints, weightPoints, hrvPoints] = await Promise.all([
      listAllDataPoints("daily-resting-heart-rate", undefined, 90).catch((e) => { console.error("HR error", e); return []; }),
      listAllDataPoints("sleep", undefined, 90).catch((e) => { console.error("Sleep error", e); return []; }),
      listAllDataPoints("steps", undefined, 1).catch((e) => { console.error("Steps error", e); return []; }),
      listAllDataPoints("weight", undefined, 90).catch((e) => { console.error("Weight error", e); return []; }),
      listAllDataPoints("heart-rate-variability", undefined, 90).catch((e) => { console.error("HRV error", e); return []; })
    ]);

    // 1. Process Resting Heart Rate
    if (hrPoints.length > 0) {
      const latestHr = hrPoints[hrPoints.length - 1];
      if (latestHr.dailyRestingHeartRate?.beatsPerMinute) {
        restingHeartRate = latestHr.dailyRestingHeartRate.beatsPerMinute;
      }
      historicalHR = hrPoints.map((pt: any) => ({
        date: parseDate(pt.dailyRestingHeartRate?.date, pt.startTime),
        value: Number(pt.dailyRestingHeartRate?.beatsPerMinute || 0)
      })).filter((pt: any) => pt.value > 0);
    }

    // 2. Process Sleep
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
          date: parseDate(pt.sleep?.interval?.civil_end_time),
          value: Number((m / 60).toFixed(1))
        };
      }).filter((pt: any) => pt.value > 0);
    }

    // 3. Process Steps
    if (stepPoints.length > 0) {
      const latestSteps = stepPoints[stepPoints.length - 1];
      if (latestSteps.steps?.count) {
        stepsToday = latestSteps.steps.count;
      }
    }

    // 4. Process Weight
    if (weightPoints.length > 0) {
      const latestWeight = weightPoints[0];
      if (latestWeight.weight?.value) {
        weight = `${latestWeight.weight.value}`;
      }
      historicalWeight = weightPoints.map((pt: any) => ({
        date: parseDate(pt.weight?.date, pt.startTime),
        value: Number(pt.weight?.value || 0)
      })).filter((pt: any) => pt.value > 0).reverse(); 
    }

    // 5. Process HRV
    if (hrvPoints.length > 0) {
      historicalHRV = hrvPoints.map((pt: any) => ({
        date: parseDate(pt.heartRateVariability?.date, pt.startTime),
        value: Number(pt.heartRateVariability?.rmssd || pt.heartRateVariability?.value || 0)
      })).filter((pt: any) => pt.value > 0).reverse();
    }

    // 6. Calculate the actual latest Sync Time across all metrics
    let latestSyncTime = 0;
    const allLatestPoints = [
      hrPoints.length > 0 ? hrPoints[hrPoints.length - 1] : null,
      sleepPoints.length > 0 ? sleepPoints[sleepPoints.length - 1] : null,
      stepPoints.length > 0 ? stepPoints[stepPoints.length - 1] : null,
      weightPoints.length > 0 ? weightPoints[0] : null,
      hrvPoints.length > 0 ? hrvPoints[hrvPoints.length - 1] : null
    ].filter(Boolean);

    allLatestPoints.forEach(pt => {
      const timeStr = pt.endTime || pt.startTime || pt.updateTime;
      if (timeStr) {
        const t = new Date(timeStr).getTime();
        if (t > latestSyncTime) {
          latestSyncTime = t;
        }
      }
    });

    const finalTimestamp = latestSyncTime > 0 ? new Date(latestSyncTime).toISOString() : new Date().toISOString();

    return NextResponse.json({
      restingHeartRate,
      sleepDuration,
      sleepScore,
      stepsToday,
      weight,
      timestamp: finalTimestamp,
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
