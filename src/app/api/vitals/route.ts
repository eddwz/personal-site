import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data representing live health vitals (e.g., from Fitbit / Apple Health)
  const data = {
    restingHeartRate: 58,
    sleepScore: 84,
    sleepDuration: "7h 12m",
    stepsToday: 4230,
    lastSynced: new Date().toISOString()
  };

  return NextResponse.json(data);
}
