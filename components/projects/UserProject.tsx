// app/(main)/projects/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Plus } from "lucide-react";
import { requestHandler } from "@/utils";
import {
  createProject,
  deleteProject,
  getAllProjects,
  updateProject,
} from "@/lib/apiClient";
import { useToast } from "@/context/ToastContext";
import FormModal from "../forms/FormModal";
import FormWrapper from "../forms/FormWrapper";
import { ProjectSchema } from "@/schemas/ProjectSchema";
import ProjectFormFields from "../forms/ProjectForm";
import TaskMoreMenu from "../tasks/TaskMoreMenu";
import DetailModal from "../modals/DetailModal";
import Image from "next/image";
import dateFormat from "dateformat";
import Button from "../ui/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { NoteSchema } from "@/schemas/NoteSchema";
import { zodResolver } from "@hookform/resolvers/zod";

interface Project {
  _id: string;
  name: string;
  description?: string;
  status: "ACTIVE" | "ON_HOLD" | "COMPLETED";
  dueDate: Date;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      requestHandler(
        async () => await getAllProjects(),
        setLoading,
        (res) => setProjects(res.data),
        (err: any) => showToast(err.message || "Failed to load projects")
      );
    };
    fetch();
  }, []);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof ProjectSchema>>({
    resolver : zodResolver(ProjectSchema),
  })

  const onSubmit: SubmitHandler<any> = (data) => {
  
    if(!selectedProject) return;
    requestHandler(
      async() => await updateProject(selectedProject?._id, data),
      setLoading,
      (res) => {
        // Updating the task in local state
                setProjects((prev) => prev.map((t) => (t._id === selectedProject._id ? res.data : t)));
                showToast(res.message || "Task updated", "success");
                setIsEditing(false);
                setSelectedProject(null);
      },
      (err: any) => showToast(err.message,'error')
    )
  }

  return (
    <div className="min-h-screen bg-transparent px-4 sm:px-6 pt-10 pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-semibold text-tp-bg"
        >
          Projects
        </motion.h1>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <motion.input
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-60 px-4 py-2 rounded-md border border-tp-border bg-tp-card text-tp-bg focus:ring-2 focus:ring-tp-primary outline-none"
          />

          <motion.button
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-tp-primary px-4 py-2 rounded-md hover:bg-tp-primaryDark transition-all duration-200"
            onClick={() => setOpenCreate(true)}
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Project</span>
          </motion.button>
        </div>
      </div>

      {/* Desktop table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="hidden md:block rounded-xl bg-tp-card p-4 shadow-sm dark:shadow-xl"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-sm text-tp-textMuted">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Due Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-tp-textMuted py-10 text-sm">
                    No projects found.
                  </td>
                </tr>
              )}

              {filtered.map((project, idx) => (
                <motion.tr
                  key={project._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="rounded-lg bg-tp-bgLight/10 hover:cursor-pointer"
                >
                  <td className="px-4 py-3 text-tp-bg font-medium">{project.name}</td>
                  <td className="px-4 py-3 text-tp-textMuted">{project.description || "-"}</td>
                  <td className="px-4 py-3 text-tp-textMuted">{project.status}</td>
                  <td className="px-4 py-3 text-tp-textMuted">{dateFormat(project.dueDate,'d mmm yyyy')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <TaskMoreMenu
                        onEdit={() => {
                          setSelectedProject(project);
                          // open edit modal
                          setIsEditing(true);
                        }}
                        onDelete={() => {
                          requestHandler(
                            async () => await deleteProject(project._id),
                            null,
                            (res) => {
                              showToast(res.message || "Deleted", "success");
                              setProjects((prev) => prev.filter((p) => p._id !== project._id));
                            },
                            (err: any) => showToast(err.message || "Delete failed", "error")
                          );
                        }}
                      />
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setDetailOpen(true);
                        }}
                        className="p-2 rounded-md hover:bg-tp-bgLight/20 text-tp-textMuted hover:text-tp-bg transition"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {filtered.map((project, idx) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="rounded-xl bg-tp-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold text-tp-bg">{project.name}</div>
                <div className="mt-2 text-sm text-tp-textMuted">{project.description || "No description"}</div>
                <div className="mt-3 text-sm text-tp-textMuted">Status: <span className="text-tp-bg">{project.status}</span></div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <TaskMoreMenu
                  onEdit={() => {
                    setSelectedProject(project);
                    setIsEditing(true);
                  }}
                  onDelete={() => {
                    requestHandler(
                      async () => await deleteProject(project._id),
                      null,
                      (res) => {
                        showToast(res.message || "Deleted", "success");
                        setProjects((prev) => prev.filter((p) => p._id !== project._id));
                      },
                      (err: any) => showToast(err.message || "Delete failed", "error")
                    );
                  }}
                />
                <button
                  onClick={() => {
                    setSelectedProject(project);
                    setDetailOpen(true);
                  }}
                  className="px-2 py-1 rounded-md text-sm text-tp-primary border border-tp-border"
                >
                  View
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* centralized create modal */}
      <FormModal open={openCreate} onClose={() => setOpenCreate(false)} title="New Project">
        <FormWrapper
          schema={ProjectSchema}
          onSubmit={async (values) => {
        
            requestHandler(
              // @ts-ignore
              async () => await createProject(values),
              null,
              (res) => {
                setProjects((prev) => [res.data, ...prev]);
                showToast(res.message || "Project created", "success");
                setOpenCreate(false);
              },
              (err: any) => showToast(err?.message || "Create failed", "error")
            );
          }}
        >
          <ProjectFormFields />
        </FormWrapper>
      </FormModal>

      {/* centralized edit modal */}
      <FormModal
        open={isEditing}
        onClose={() => {
          setIsEditing(false);
          setSelectedProject(null);
        }}
        title="Edit Project"
      >
         <form onSubmit={handleSubmit(onSubmit)}>
      <ProjectFormFields
      defaultValue={{
        name : selectedProject?.name,
        description : selectedProject?.description,
        status : selectedProject?.status,
        dueDate : selectedProject?.dueDate
      }}
      errors={errors}
      register={register}
      />

        <div className="pt-5">
          {
            loading ? (
              <Button
              disabled
        type='button'
        >
          <Loader2 className="animate-spin" /> 
        </Button>
            ) : (
              <Button
              
        type='submit'
        >
          Save
        </Button>
            )
          }
        </div>
 </form>
      </FormModal>

      {/* details modal */}
      <DetailModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedProject(null);
        }}
        title="Project Details"
        data={
          selectedProject
            ? {
                Name: selectedProject.name,
                Description: selectedProject.description,
                Status: selectedProject.status,
                dueDate: dateFormat(selectedProject.dueDate,'d mmm yyyy')
              }
            : {}
        }
      />
    </div>
  );
}
