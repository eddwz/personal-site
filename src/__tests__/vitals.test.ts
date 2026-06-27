import { describe, it, expect, vi } from 'vitest';
import { GET } from '../app/api/vitals/route';
import * as ghLib from '../lib/googleHealth';

// Mock the googleHealth library
vi.mock('../lib/googleHealth', () => ({
  hasGoogleHealth: vi.fn(),
  listAllDataPoints: vi.fn()
}));

describe('/api/vitals', () => {
  it('returns mock data when credentials are not configured', async () => {
    vi.mocked(ghLib.hasGoogleHealth).mockReturnValue(false);
    
    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.restingHeartRate).toBe(58);
  });

  it('handles 400 Bad Request gracefully without crashing the endpoint', async () => {
    vi.mocked(ghLib.hasGoogleHealth).mockReturnValue(true);
    
    // Simulate the exact 400 Bad Request error we saw with the invalid filter
    vi.mocked(ghLib.listAllDataPoints).mockRejectedValue(new Error('Google Health GET /users/me/dataTypes/steps/dataPoints -> 400 Bad Request'));
    
    const response = await GET();
    const data = await response.json();
    
    // The endpoint should still return 200, but with fallback "--" values for the failed metrics
    expect(response.status).toBe(200);
    expect(data.stepsToday).toBe('--');
    expect(data.weight).toBe('--');
    expect(data.sleepDuration).toBe('--');
  });
});
