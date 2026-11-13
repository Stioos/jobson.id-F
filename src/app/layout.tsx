import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/layout/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jobson.id"),
  title: {
    default: "jobson.id — Explore Global Opportunities. Build Limitless Careers.",
    template: "%s | jobson.id",
  },
  description:
    "jobson.id is India's AI-powered talent marketplace. 50,000+ live jobs, 12,000+ hiring companies, 2M+ verified candidates. Find jobs, hire talent, upskill with Pay After Placement programs.",
  keywords: [
    "jobson.id",
    "jobs",
    "job portal",
    "recruitment",
    "talent marketplace",
    "career",
    "hiring",
    "ATS",
    "staffing",
    "AI hiring",
    "pay after placement",
    "bootcamp",
    "training",
    "certification",
    "fullstack developer",
    "AI engineer",
    "cloud engineer",
    "DevOps",
    "MLOps",
    "gen AI",
    "agentic automation",
    "LLM",
    "RAG",
    "LangChain",
    "talent solutions",
    "staffing solutions",
    "corporate training",
  ],
  authors: [{ name: "jobson.id" }],
  creator: "jobson.id",
  publisher: "jobson.id",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://jobson.id",
    siteName: "jobson.id",
    title: "jobson.id — Explore Global Opportunities. Build Limitless Careers.",
    description: "AI-powered talent marketplace. 50,000+ jobs, 12,000+ companies, 2M+ candidates. Find jobs, hire talent, upskill with Pay After Placement.",
    images: [
      {
        url: "/jobson-id-logo.png",
        width: 3019,
        height: 563,
        alt: "jobson.id — Talent, Recruitment & Career Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "jobson.id — Explore Global Opportunities. Build Limitless Careers.",
    description: "AI-powered talent marketplace. 50,000+ jobs, 12,000+ companies, 2M+ candidates.",
    images: ["/jobson-id-logo.png"],
  },
  alternates: {
    canonical: "https://jobson.id",
  },
  category: "Jobs & Career",
};

// JSON-LD structured data for AEO (Answer Engine Optimization)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "jobson.id",
  url: "https://jobson.id",
  logo: "https://jobson.id/jobson-id-logo.png",
  description: "AI-powered talent marketplace connecting candidates, employers and recruiters. 50,000+ jobs, 12,000+ companies, 2M+ candidates.",
  sameAs: [
    "https://www.linkedin.com/company/jobson.id",
    "https://twitter.com/jobson.id",
    "https://github.com/jobson.id",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "info@jobson.id",
    url: "https://jobson.id/contact",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "jobson.id",
  url: "https://jobson.id",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://jobson.id/jobs?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

// Global error boundary — catches ANY uncaught error (including chunk load
// errors that escape the page-level boundary) and shows a recovery UI with
// auto-reload instead of Next.js's default error page.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD for AEO — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* JSON-LD for AEO — WebSite with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster position="bottom-right" richColors closeButton />
          {/* Global chunk-error recovery script — runs before React hydrates.
              If a ChunkLoadError was thrown on the previous load, this clears
              stale caches and reloads cleanly. */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  if (window.sessionStorage && sessionStorage.getItem('__chunk_reload_pending')) {
                    sessionStorage.removeItem('__chunk_reload_pending');
                    // Clear any stale service worker caches
                    if ('caches' in window) {
                      caches.keys().then(function(names) {
                        names.forEach(function(name) { caches.delete(name); });
                      });
                    }
                  }
                  // Catch unhandled chunk load errors at the window level
                  window.addEventListener('error', function(e) {
                    if (e && e.error && (e.error.name === 'ChunkLoadError' || (e.error.message && e.error.message.indexOf('Failed to load chunk') !== -1))) {
                      e.preventDefault();
                      if (window.sessionStorage && !sessionStorage.getItem('__chunk_reload_pending')) {
                        sessionStorage.setItem('__chunk_reload_pending', '1');
                        setTimeout(function() { window.location.reload(); }, 1000);
                      }
                    }
                  });
                })();
              `,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
