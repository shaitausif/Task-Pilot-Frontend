// app/(main)/notes/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Plus } from "lucide-react";
import { requestHandler } from "@/utils";
import { createNote, deleteNote, getAllNotes, updateNote } from "@/lib/apiClient";
import { useToast } from "@/context/ToastContext";
import FormModal from "../forms/FormModal";
import FormWrapper from "../forms/FormWrapper";
import { NoteSchema } from "@/schemas/NoteSchema";
import NoteFormFields from "../forms/NoteForm";
import TaskMoreMenu from "../tasks/TaskMoreMenu";
import DetailModal from "../modals/DetailModal";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../ui/Button";

interface Note {
  _id: string;
  title: string;
  content: string;
  tag?: string[] | string | null;
}

function normalizeTags(tag: any): string[] {
  if (!tag) return [];
  if (Array.isArray(tag)) return tag.filter(Boolean).map(String);
  if (typeof tag === "string") {
    return tag
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  // fallback: try to coerce to string
  try {
    return [String(tag)];
  } catch (e) {
    return [];
  }
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      requestHandler(
        async () => await getAllNotes(),
        setLoading,
        (res) => setNotes(res.data),
        (err: any) => showToast(err.message || "Failed to load notes")
      );
    };
    fetch();
  }, []);

  const filtered = notes.filter((n) =>
    (n.title + " " + n.content + " " + normalizeTags(n.tag).join(" ")).toLowerCase().includes(search.toLowerCase())
  );

    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof NoteSchema>>({
    resolver : zodResolver(NoteSchema),
  })

  const onSubmit: SubmitHandler<any> = (data) => {
    if(!selectedNote) return;
    requestHandler(
      async() => await updateNote(selectedNote._id, data),
      setLoading,
      (res) => {
        setNotes((prev) => prev?.map((t) => (t._id === selectedNote._id ? res.data : t)));
        showToast(res.message, 'success')
        setIsEditing(false)
        setSelectedNote(null)

      },
      (err: any) => showToast(err?.message || "Something went wrong", 'error')
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
          Notes
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
            <span className="hidden sm:inline">Add Note</span>
          </motion.button>
        </div>
      </div>

      {/* Desktop: list on right, sidebar assumed on left */}
      <motion.div className="hidden md:block rounded-xl bg-tp-card p-4 shadow-sm dark:shadow-xl">
        <div className="grid grid-cols-1 gap-4">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-tp-textMuted">No notes found.</div>
          ) : (
            <table className="min-w-full">
              <thead className="text-left text-sm text-tp-textMuted">
                <tr>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Preview</th>
                  <th className="px-4 py-2">Tags</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((note, idx) => (
                  <motion.tr
                    key={note._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="rounded-lg bg-tp-bgLight/10 hover:cursor-pointer"
                  >
                    <td className="px-4 py-3 text-tp-bg font-medium">{note.title}</td>
                    <td className="px-4 py-3 text-tp-textMuted">{note.content.slice(0, 80)}{note.content.length > 80 ? "..." : ""}</td>
                    <td className="px-4 py-3 text-tp-textMuted">{normalizeTags(note.tag).join(", ") || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <TaskMoreMenu
                          onEdit={() => {
                            setSelectedNote(note);
                            setIsEditing(true);
                          }}
                          onDelete={() => {
                            requestHandler(
                              async () => await deleteNote(note._id),
                              null,
                              (res) => {
                                setNotes((prev) => prev.filter((n) => n._id !== note._id));
                                showToast(res.message || "Deleted", "success");
                              },
                              (err: any) => showToast(err?.message || "Delete failed", "error")
                            );
                          }}
                        />
                        <button
                          onClick={() => {
                            setSelectedNote(note);
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
          )}
        </div>
      </motion.div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {filtered.map((note, idx) => (
          <motion.div
            key={note._id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="rounded-xl bg-tp-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold text-tp-bg">{note.title}</div>
                <div className="mt-2 text-sm text-tp-textMuted">{note.content.slice(0, 120)}{note.content.length > 120 ? "..." : ""}</div>
                <div className="mt-3 text-sm text-tp-textMuted">Tag: <span className="text-tp-bg">{normalizeTags(note.tag).join(", ")}</span></div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <TaskMoreMenu
                  onEdit={() => {
                    setSelectedNote(note);
                    setIsEditing(true);
                  }}
                  onDelete={() => {
                    requestHandler(
                      async () => await deleteNote(note._id),
                      null,
                      (res) => {
                        setNotes((prev) => prev.filter((n) => n._id !== note._id));
                        showToast(res.message || "Deleted", "success");
                      },
                      (err: any) => showToast(err?.message || "Delete failed", "error")
                    );
                  }}
                />
                <button
                  onClick={() => {
                    setSelectedNote(note);
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

      {/* create modal */}
      <FormModal open={openCreate} onClose={() => setOpenCreate(false)} title="Add Note">
        <FormWrapper
          schema={NoteSchema}
          onSubmit={async (values) => {
            // convert tagsRaw (if present) to tags array
            
           
            requestHandler(
              // @ts-ignore
              
              async () => await createNote(values),
              null,
              (res) => {
                setNotes((prev) => [res.data, ...prev]);
                showToast(res.message || "Note added", "success");
                setOpenCreate(false);
              },
              (err: any) => showToast(err?.message || "Create failed", "error")
            );
          }}
        >
          <NoteFormFields />
        </FormWrapper>
      </FormModal>

      {/* edit modal */}
      <FormModal
        open={isEditing}
        onClose={() => {
          setIsEditing(false);
          setSelectedNote(null);
        }}
        title="Edit Note"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
      <NoteFormFields
        defaultValue={{
          title : selectedNote?.title,
          content : selectedNote?.content,
          tag : selectedNote?.tag
        }}
        register={register}
        errors={errors}
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
          setSelectedNote(null);
        }}
        title="Note Details"
        data={
          selectedNote
            ? {
                Title: selectedNote.title,
                Content: selectedNote.content,
                tag: selectedNote.tag
              }
            : {}
        }
      />
    </div>
  );
}
