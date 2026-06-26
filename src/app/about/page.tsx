import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BACKGROUND | DOSSIER E. ZHOU",
  description: "Official Engineering Brief",
};

export default function About() {
  return (
    <div className="space-y-12 pb-12">
      <section>
        <h1 className="font-serif text-3xl font-bold normal-case mb-6">Background Briefing</h1>
        <div className="memo-border p-6 bg-white max-w-3xl space-y-4">
          <p className="normal-case text-base leading-relaxed text-foreground">
            Subject is a Computer Science student at Duke University. Demonstrated expertise 
            in backend infrastructure, systems design, and AI/ML architectures.
          </p>
          <p className="normal-case text-base leading-relaxed text-foreground">
            Previous deployments include Software Engineering Internships at <strong>Meta</strong> and <strong>ReadAI</strong>. 
            Post-deployment analysis indicates a strong preference against standard Big Tech environments. 
            Subject is actively seeking full-time integration with fast-paced, high-ownership startup 
            environments in NYC. Tactical priorities include rapid iteration, modern AI tool utilization, 
            and total ownership of complex problems.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-bold text-lg">OPERATIONAL EXPERIENCE</h2>
        
        <div className="memo-border bg-white divide-y divide-border">
          
          <div className="p-6 flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <div className="font-bold mb-1">ORG: META</div>
              <div className="text-muted-foreground text-xs">ROLE: SWE INTERN</div>
            </div>
            <div className="md:w-3/4 normal-case text-base text-foreground">
              Operated on large-scale backend systems. Gained hands-on experience navigating 
              complex, high-availability architecture. Concluded deployment with a refined 
              preference for agile, fast-moving teams.
            </div>
          </div>

          <div className="p-6 flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <div className="font-bold mb-1">ORG: READAI</div>
              <div className="text-muted-foreground text-xs">ROLE: SWE INTERN</div>
            </div>
            <div className="md:w-3/4 normal-case text-base text-foreground">
              Contributed to shipping AI-driven features in a high-velocity environment.
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
