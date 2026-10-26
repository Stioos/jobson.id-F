"use client";

import * as React from "react";
import { useNav } from "@/lib/store";
import { PageHeader, SectionCard, Card, CardContent } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Clock, Users, FileText, ArrowRight } from "lucide-react";

interface Template {
  id: string;
  title: string;
  category: string;
  department: string;
  experience: string;
  skills: string[];
  description: string;
  sections: string[];
  uses: number;
}

const TEMPLATES: Template[] = [
  {
    id: "tpl_senior_eng",
    title: "Senior Software Engineer",
    category: "Engineering",
    department: "Engineering",
    experience: "5-8 years",
    skills: ["System Design", "Code Reviews", "Mentorship", "Production Operations"],
    description: "Own complex features end-to-end, mentor mid-level engineers, and drive technical excellence across the team.",
    sections: ["Basic", "Requirements", "Screening", "Compensation"],
    uses: 1240,
  },
  {
    id: "tpl_pm",
    title: "Product Manager",
    category: "Product",
    department: "Product",
    experience: "4-7 years",
    skills: ["Roadmapping", "Stakeholder Management", "Analytics", "User Research"],
    description: "Own product strategy and execution for a key business line. Translate customer insights into shipped features.",
    sections: ["Basic", "Requirements", "Case Study", "Compensation"],
    uses: 880,
  },
  {
    id: "tpl_designer",
    title: "Senior Product Designer",
    category: "Design",
    department: "Design",
    experience: "4-6 years",
    skills: ["Figma", "Design Systems", "User Research", "Prototyping"],
    description: "Drive end-to-end design across web and mobile. Build and maintain the design system.",
    sections: ["Basic", "Portfolio", "Requirements", "Compensation"],
    uses: 642,
  },
  {
    id: "tpl_devops",
    title: "DevOps / SRE Engineer",
    category: "Engineering",
    department: "Platform",
    experience: "3-6 years",
    skills: ["Kubernetes", "Terraform", "AWS", "Observability", "CI/CD"],
    description: "Operate cloud infrastructure at scale. Build self-healing systems and developer-friendly tooling.",
    sections: ["Basic", "Requirements", "Screening", "On-call expectations"],
    uses: 512,
  },
  {
    id: "tpl_sales",
    title: "Enterprise Account Executive",
    category: "Sales",
    department: "Sales",
    experience: "5-10 years",
    skills: ["B2B SaaS", "Negotiation", "Pipeline Management", "Enterprise Sales"],
    description: "Drive new business across enterprise accounts. Manage full sales cycle from prospecting to close.",
    sections: ["Basic", "Requirements", "Quota structure", "Compensation"],
    uses: 398,
  },
  {
    id: "tpl_data_sci",
    title: "Senior Data Scientist",
    category: "Data",
    department: "Data & ML",
    experience: "4-7 years",
    skills: ["Python", "ML Modeling", "SQL", "MLOps", "Statistics"],
    description: "Build production ML models end-to-end. Partner with engineering to ship and operate models at scale.",
    sections: ["Basic", "Requirements", "Take-home", "Compensation"],
    uses: 459,
  },
];

export function EmployerTemplates() {
  const { navigate } = useNav();

  const applyTemplate = (t: Template) => {
    toast.success(`Started new job from "${t.title}" template`, { description: "Template fields pre-filled — review and publish." });
    navigate("employer", "create-job");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Templates"
        description="Start from a proven template — customize and publish in minutes"
        actions={[{ label: "Create template", icon: "Plus", variant: "outline", onClick: () => toast.info("Template builder coming soon") }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <Card key={t.id} className="flex flex-col hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex-1 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{t.title}</h3>
                  <p className="text-xs text-muted-foreground">{t.category} · {t.department}</p>
                </div>
                <Badge variant="secondary">{t.experience}</Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {t.skills.slice(0, 4).map((s) => (
                  <Badge key={s} variant="outline" className="text-xs font-normal">{s}</Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {t.sections.length} sections</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {t.uses} uses</span>
              </div>
              <Button size="sm" className="mt-auto w-full" onClick={() => applyTemplate(t)}>
                Use template <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <SectionCard title="Template tips" description="Get the most from your templates">
        <div className="grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <p className="font-medium mb-1">Standardize roles</p>
            <p className="text-muted-foreground">Use templates to keep job posts consistent across teams.</p>
          </div>
          <div>
            <p className="font-medium mb-1">Reduce bias</p>
            <p className="text-muted-foreground">Pre-vetted language ensures inclusivity by default.</p>
          </div>
          <div>
            <p className="font-medium mb-1">Save time</p>
            <p className="text-muted-foreground">Cut posting time from 30 minutes to under 5.</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
