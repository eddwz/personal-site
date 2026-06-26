import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Eddie Zhou",
  description: "Software Engineer at Duke University",
};

export default function About() {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <section className="space-y-6 pt-10">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
          About Me
        </h1>
        <div className="space-y-6 text-muted-foreground leading-relaxed max-w-3xl text-lg">
          <p>
            I'm a Computer Science student at Duke University with a deep passion for 
            backend infrastructure, systems design, and AI/ML. 
          </p>
          <p>
            Previously, I worked as a Software Engineering Intern at <strong>Meta</strong> and <strong>ReadAI</strong>. 
            While those experiences were incredibly valuable, I've realized that the Big Tech environment 
            isn't for me. I'm actively seeking full-time roles in fast-paced, high-ownership startup 
            environments in NYC—places where I can move quickly, freely utilize modern AI tools, and take 
            total ownership of complex problems.
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="font-display text-2xl font-semibold text-foreground">Experience</h2>
        
        <div className="space-y-6">
          <div className="glass-card p-6 md:p-8 relative overflow-hidden group border-l-4 border-l-primary hover:border-l-primary/80 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
              <h3 className="text-xl font-bold text-slate-800">Software Engineering Intern</h3>
              <span className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full w-fit">
                Meta
              </span>
            </div>
            <p className="text-muted-foreground">
              Worked on large-scale backend systems. Gained hands-on experience navigating 
              complex, high-availability architecture while discovering my preference for 
              agile, fast-moving teams.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8 relative overflow-hidden group border-l-4 border-l-indigo-500 hover:border-l-indigo-500/80 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
              <h3 className="text-xl font-bold text-slate-800">Software Engineering Intern</h3>
              <span className="text-sm font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full w-fit">
                ReadAI
              </span>
            </div>
            <p className="text-muted-foreground">
              Contributed to shipping AI-driven features in a fast-paced environment.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="font-display text-2xl font-semibold text-foreground">Let's Connect</h2>
        <div className="glass-card p-8 bg-gradient-to-br from-blue-50 to-transparent">
          <p className="text-muted-foreground max-w-2xl text-lg mb-6">
            If you're building a fast-paced, high-ownership team in NYC and need a 
            tech-stack agnostic SWE who loves moving quickly, let's talk.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a 
              href="mailto:hello@example.com" 
              className="px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              Email Me
            </a>
            <a 
              href="https://www.linkedin.com/in/eddiezh0u/?skipRedirect=true" 
              target="_blank" 
              rel="noreferrer"
              className="px-6 py-3 bg-white text-slate-800 font-medium rounded-full hover:bg-slate-50 border border-slate-200 shadow-sm transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
