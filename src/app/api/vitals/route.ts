import { NextResponse } from "next/server";
import { hasGoogleHealth, listAllDataPoints } from "@/lib/googleHealth";

function ymd(date: Date) {
  return date.toISOString().slice(0, 10);
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export const revalidate = 1800; // Cache for 30 minutes

export async function GET() {
  if (!hasGoogleHealth()) {
    // Return mock data if no credentials are provided
    return NextResponse.json({
      restingHeartRate: 58,
      sleepDuration: "7h 14m",
      sleepScore: 88,
      stepsToday: 12450,
      weight: "165.2 lbs"
    });
  }

  try {
    const todayYmd = ymd(new Date());
    const weekAgoYmd = ymd(daysAgo(7));
    
    // 1. Fetch Resting Heart Rate (latest from last 7 days)
    let restingHeartRate = "--";
    try {
      const hrFilter = `daily_resting_heart_rate.date >= "${weekAgoYmd}"`;
      const hrPoints = await listAllDataPoints("daily-resting-heart-rate", hrFilter);
      if (hrPoints.length > 0) {
        // Find the most recent point
        const latestHr = hrPoints[hrPoints.length - 1];
        if (latestHr.dailyRestingHeartRate?.beatsPerMinute) {
          restingHeartRate = latestHr.dailyRestingHeartRate.beatsPerMinute;
        }
      }
    } catch (e) {
      console.error("HR fetch failed", e);
    }

    // 2. Fetch Sleep (latest from last 7 days)
    let sleepDuration = "--";
    let sleepScore = "--";
    try {
      const sleepFilter = `sleep.interval.civil_end_time >= "${weekAgoYmd}T00:00:00"`;
      const sleepPoints = await listAllDataPoints("sleep", sleepFilter);
      if (sleepPoints.length > 0) {
        // Find the most recent sleep session
        const latestSleep = sleepPoints[sleepPoints.length - 1];
        if (latestSleep.sleep?.summary?.minutesAsleep) {
          const minutes = parseInt(latestSleep.sleep.summary.minutesAsleep);
          const h = Math.floor(minutes / 60);
          const m = minutes % 60;
          sleepDuration = `${h}h ${m}m`;
          // Approximate a score based on duration if none provided
          sleepScore = minutes > 420 ? "Good" : "Fair"; 
        }
      }
    } catch (e) {
      console.error("Sleep fetch failed", e);
    }

    // 3. Fetch Steps
    let stepsToday = "--";
    try {
      // The steps endpoint does not support filtering by steps.date, so we fetch the most recent point.
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

    // 4. Fetch Weight
    let weight = "--";
    try {
      // Fetch the most recent weight point
      const weightPoints = await listAllDataPoints("weight", undefined, 1);
      if (weightPoints.length > 0) {
        const latestWeight = weightPoints[0];
        if (latestWeight.weight?.value) {
          // Assuming the value is in kg, convert to lbs for display if preferred, 
          // or just display what we get. We'll assume the API returns lbs or kg 
          // based on user settings, so we just display the value.
          weight = `${latestWeight.weight.value}`;
        }
      }
    } catch (e) {
      console.error("Weight fetch failed", e);
    }

    return NextResponse.json({
      restingHeartRate,
      sleepDuration,
      sleepScore,
      stepsToday,
      weight,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("Vitals fetch failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
