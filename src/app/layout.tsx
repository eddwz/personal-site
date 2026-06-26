import type { Metadata } from "next";
import { Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DOSSIER: E. ZHOU",
  description: "Official Engineering Brief",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col uppercase text-sm tracking-wide">
        
        {/* Strict Memo Header */}
        <header className="w-full max-w-4xl mx-auto px-6 pt-12 pb-6">
          <div className="memo-border-bottom pb-4 mb-1 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="font-bold text-lg mb-1">DEPARTMENT OF ENGINEERING</div>
              <div className="text-muted-foreground">SUBJECT: DOSSIER E. ZHOU</div>
            </div>
            <div className="text-right">
              <div>DATE: {currentDate}</div>
              <div>CLASS: UNCLASSIFIED</div>
            </div>
          </div>
          <div className="memo-border-bottom pb-1 mb-8" />
          
          <nav className="flex space-x-8 font-bold">
            <a href="/" className="hover:text-primary">[INDEX]</a>
            <a href="/about" className="hover:text-primary">[BACKGROUND]</a>
            <a href="https://www.linkedin.com/in/eddiezh0u/?skipRedirect=true" target="_blank" rel="noreferrer" className="hover:text-primary">[LINKEDIN]</a>
            <a href="https://github.com/eddiezh0u" target="_blank" rel="noreferrer" className="hover:text-primary">[GITHUB]</a>
            <a href="mailto:hello@example.com" className="hover:text-primary">[COMMUNICATE]</a>
          </nav>
        </header>
        
        <main className="flex-1 px-6 max-w-4xl mx-auto w-full">
          {children}
        </main>
        
        <footer className="w-full max-w-4xl mx-auto px-6 py-12 mt-12">
          <div className="memo-border-top pt-4 flex justify-between items-center text-xs text-muted-foreground">
            <span>FILE END</span>
            <span>&copy; {new Date().getFullYear()} E. ZHOU</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
