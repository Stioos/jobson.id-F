"use client";

import Image from "next/image";
import { useNav } from "@/lib/store";
import { Icon } from "@/components/common/Icon";
import { Linkedin, Twitter, Github } from "lucide-react";

export function Footer() {
  const { navigate } = useNav();
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <button onClick={() => navigate("public", "home")} className="flex items-center" aria-label="JOBSONN home">
              <Image
                src="/jobsonn-logo.png"
                alt="JOBSONN"
                width={130}
                height={36}
                className="h-7 w-auto object-contain"
              />
            </button>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Connecting talent, employers and opportunities through intelligent technology.
            </p>
            <div className="mt-4 flex items-center gap-3 text-muted-foreground">
              <a href="#" className="hover:text-foreground" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
              <a href="#" className="hover:text-foreground" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="hover:text-foreground" aria-label="GitHub"><Github className="h-4 w-4" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">For Candidates</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><button onClick={() => navigate("public", "jobs")} className="text-muted-foreground hover:text-foreground">Jobs</button></li>
              <li><button onClick={() => navigate("public", "companies")} className="text-muted-foreground hover:text-foreground">Companies</button></li>
              <li><button onClick={() => navigate("public", "salary-insights")} className="text-muted-foreground hover:text-foreground">Salary Insights</button></li>
              <li><button onClick={() => navigate("candidate", "overview")} className="text-muted-foreground hover:text-foreground">Candidate Portal</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">For Employers</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><button onClick={() => navigate("employer", "overview")} className="text-muted-foreground hover:text-foreground">Employer Portal</button></li>
              <li><button onClick={() => navigate("employer", "create-job")} className="text-muted-foreground hover:text-foreground">Post a Job</button></li>
              <li><button onClick={() => navigate("employer", "subscription")} className="text-muted-foreground hover:text-foreground">Pricing</button></li>
              <li><button onClick={() => navigate("enterprise", "overview")} className="text-muted-foreground hover:text-foreground">Enterprise</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><button onClick={() => navigate("public", "about")} className="text-muted-foreground hover:text-foreground">About</button></li>
              <li><button onClick={() => navigate("public", "contact")} className="text-muted-foreground hover:text-foreground">Contact</button></li>
              <li><button onClick={() => navigate("public", "blogs")} className="text-muted-foreground hover:text-foreground">Blogs</button></li>
              <li><button onClick={() => navigate("public", "partner-with-us")} className="text-muted-foreground hover:text-foreground">Partners</button></li>
              <li><button onClick={() => navigate("public", "career-resources")} className="text-muted-foreground hover:text-foreground">Resources</button></li>
              <li><button onClick={() => navigate("admin", "support")} className="text-muted-foreground hover:text-foreground">Support</button></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} JOBSONN Technologies. Demo prototype — all data is simulated.</p>
          <div className="flex items-center gap-4">
            <button className="hover:text-foreground">Privacy</button>
            <button className="hover:text-foreground">Terms</button>
            <button className="hover:text-foreground">Cookies</button>
            <button className="hover:text-foreground">DPDP Compliance</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
