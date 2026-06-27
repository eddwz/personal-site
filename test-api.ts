import { hasGoogleHealth, listAllDataPoints } from "../../src/lib/googleHealth";

async function test() {
  try {
    const steps = await listAllDataPoints("steps", undefined, 1);
    console.log("Steps:", JSON.stringify(steps, null, 2));
  } catch (e) {
    console.error("Steps Error:", e);
  }
  
  try {
    const weight = await listAllDataPoints("weight", undefined, 1);
    console.log("Weight:", JSON.stringify(weight, null, 2));
  } catch (e) {
    console.error("Weight Error:", e);
  }
}
test();
