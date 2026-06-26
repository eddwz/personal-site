import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data representing local weather and timezone info
  const data = {
    location: "New York, NY",
    temperature: 68, // Fahrenheit
    condition: "Partly Cloudy",
    localTime: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' }),
    timezone: "EST"
  };

  return NextResponse.json(data);
}
