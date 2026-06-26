import type { Metadata } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eddie Zhou",
  description: "Software Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col pt-12 px-6 md:px-12 selection:bg-ink/10">
        
        {/* Minimal Notebook Header */}
        <header className="w-full max-w-2xl mx-auto mb-16 flex items-baseline justify-between text-sm">
          <div className="font-serif font-bold text-lg text-ink">
            <a href="/">Eddie.</a>
          </div>
          <nav className="flex space-x-6 text-ink-soft font-medium">
            <a href="/about" className="hover:text-ink transition-colors">About</a>
            <a href="https://www.linkedin.com/in/eddiezh0u/?skipRedirect=true" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">LinkedIn</a>
            <a href="https://github.com/eddiezh0u" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">GitHub</a>
          </nav>
        </header>
        
        <main className="flex-1 w-full max-w-2xl mx-auto">
          {children}
        </main>
        
        <footer className="w-full max-w-2xl mx-auto py-12 mt-16 border-t border-rule text-ink-soft text-sm flex justify-between">
          <span>&copy; {new Date().getFullYear()}</span>
          <span>New York City</span>
        </footer>
      </body>
    </html>
  );
}
