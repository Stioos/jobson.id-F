"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  PageHeader,
  SectionCard,
  Card,
  CardContent,
  EmptyState,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { candidateProfiles } from "@/lib/mock-data";
import type { CandidateProfile } from "@/lib/types";

interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
}

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  link: z.string().optional(),
});
type ProjectForm = z.infer<typeof projectSchema>;

export function CandidatePortfolio() {
  const profile: CandidateProfile = candidateProfiles[0];
  const [projects, setProjects] = React.useState<Project[]>(
    profile.projects.map((p, i) => ({ ...p, id: `p_${i}` }))
  );
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Project | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const form = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: "", description: "", link: "" },
  });

  function openNew() {
    setEditing(null);
    form.reset({ title: "", description: "", link: "" });
    setOpen(true);
  }

  function openEdit(p: Project) {
    setEditing(p);
    form.reset({ title: p.title, description: p.description, link: p.link ?? "" });
    setOpen(true);
  }

  function onSubmit(values: ProjectForm) {
    if (editing) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editing.id ? { ...p, ...values, link: values.link || undefined } : p
        )
      );
      toast.success("Project updated");
    } else {
      setProjects((prev) => [
        ...prev,
        { id: `p_${Date.now()}`, ...values, link: values.link || undefined },
      ]);
      toast.success("Project added");
    }
    setOpen(false);
    setEditing(null);
  }

  function confirmDelete() {
    if (!deleteId) return;
    setProjects((prev) => prev.filter((p) => p.id !== deleteId));
    toast.success("Project removed");
    setDeleteId(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio & Projects"
        description="Showcase your work — open-source, side projects, freelance, and more."
        actions={[
          { label: "Add project", variant: "default", onClick: openNew },
        ]}
      />

      {/* Links */}
      <SectionCard title="External links" description="Where recruiters can see more of your work.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <LinkCard label="GitHub" value={profile.links.github} icon="GitBranch" />
          <LinkCard label="LinkedIn" value={profile.links.linkedin} icon="Users" />
          <LinkCard label="Portfolio" value={profile.links.portfolio} icon="Globe" />
        </div>
      </SectionCard>

      {/* Projects */}
      <SectionCard
        title="Projects"
        description={`${projects.length} project${projects.length === 1 ? "" : "s"} in your portfolio`}
      >
        {projects.length === 0 ? (
          <EmptyState
            icon={<Icon name="FolderGit2" className="h-5 w-5" />}
            title="No projects yet"
            description="Add your first project to showcase your work."
            action={<Button onClick={openNew}>Add project</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {projects.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon name="FolderGit2" className="h-5 w-5" />
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(p)}
                      >
                        <Icon name="PenSquare" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setDeleteId(p.id)}
                      >
                        <Icon name="AlertTriangle" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="mt-3 font-medium">{p.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                  {p.link && (
                    <a
                      href={`https://${p.link}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-brand hover:underline"
                    >
                      <Icon name="Globe" className="h-3 w-3" /> {p.link}
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Project dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit project" : "Add project"}</DialogTitle>
            <DialogDescription>
              Highlight impact, technologies, and outcomes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register("title")} placeholder="Open-source design system" />
              {form.formState.errors.title && (
                <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                {...form.register("description")}
                placeholder="1.2K GitHub stars. Used by 8 teams. Built with React, TypeScript, Tailwind."
              />
              {form.formState.errors.description && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="link">Link (optional)</Label>
              <Input id="link" {...form.register("link")} placeholder="github.com/you/project" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function LinkCard({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Icon name={icon} className="h-4 w-4" /> {label}
        </div>
        {value ? (
          <a
            href={`https://${value}`}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block text-sm text-brand hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">Not added</p>
        )}
      </CardContent>
    </Card>
  );
}
