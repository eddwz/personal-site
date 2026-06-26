import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Eddie Zhou",
  description: "About me",
};

export default function About() {
  return (
    <div className="container-prose space-y-12">
      <section className="space-y-6">
        <h1 className="font-serif text-3xl font-medium text-ink">About Me</h1>
        <div className="space-y-4 text-ink-soft leading-relaxed">
          <p>
            I am a Computer Science student at Duke University, focused on building minimal, 
            highly reliable backend infrastructure and AI-driven systems.
          </p>
          <p>
            This site is an experiment in extreme restraint. Built with Next.js, it avoids the 
            standard portfolio tropes—no dark mode, no animations, no complex grids. Just 
            content and live data formatted like a well-kept notebook.
          </p>
        </div>
      </section>

      <hr />

      <section className="space-y-6">
        <h2 className="font-serif text-xl font-medium text-ink">Background</h2>
        <div className="space-y-6 text-ink-soft leading-relaxed">
          <p>
            Previously, I worked as a Software Engineering Intern at <strong>Meta</strong> and <strong>ReadAI</strong>. 
            While navigating large-scale, high-availability architecture was an incredible learning experience, 
            I discovered that the traditional Big Tech environment isn't for me.
          </p>
          <p>
            I am actively seeking full-time roles in fast-paced, high-ownership startup 
            environments in NYC—places where I can move quickly, freely utilize modern AI tools, and take 
            total ownership of complex engineering problems.
          </p>
        </div>
      </section>

      <hr />

      <section className="space-y-6">
        <h2 className="font-serif text-xl font-medium text-ink">Contact</h2>
        <p className="text-ink-soft">
          If you're building a high-velocity team in NYC and need a tech-stack agnostic engineer, 
          let's talk.
        </p>
        <ul className="list-notebook text-ink-soft space-y-2">
          <li><a href="mailto:hello@example.com">Email</a></li>
          <li><a href="https://www.linkedin.com/in/eddiezh0u/?skipRedirect=true" target="_blank" rel="noreferrer">LinkedIn</a></li>
        </ul>
      </section>
    </div>
  );
}
