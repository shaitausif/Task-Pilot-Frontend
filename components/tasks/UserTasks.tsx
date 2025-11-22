"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Plus } from "lucide-react";
import { requestHandler } from "@/utils";
import { createTask, deleteTask, getAllTasks, updateTask } from "@/lib/apiClient";
import { useToast } from "@/context/ToastContext";
import dateFormat from "dateformat";
import DetailModal from "../modals/DetailModal";
import TaskMoreMenu from "./TaskMoreMenu";
import FormModal from "../forms/FormModal";
import FormWrapper from "../forms/FormWrapper";
import { TaskSchema } from "@/schemas/TaskSchema";
import TaskFormFields from "../forms/TaskForm";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Button from "../ui/Button";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  createdAt: Date;
}

export default function UserTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [openform, setopenform] = useState(false);
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false); // Using detailOpen state
  
  const { showToast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      requestHandler(
        async () => await getAllTasks(),
        setLoading,
        (res) => {
          setTasks(res.data);
        },
        (err: any) => showToast(err.message || "Failed to load tasks")
      );
    };
    fetchTasks();
  }, []);

  const filtered = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof TaskSchema>>({
    resolver: zodResolver(TaskSchema),
  });

  const onSubmit: SubmitHandler<any> = (data) => {
    if (!selectedTask) return;
    requestHandler(
      async () => await updateTask(selectedTask?._id, data),
      setLoading,
      (res) => {
        setTasks((prev) => prev.map((t) => (t._id === selectedTask._id ? res.data : t)));
        showToast(res.message || "Task updated", "success");
        setIsEditing(false);
        setSelectedTask(null);
      },
      (err: any) => showToast(err.message, 'error')
    );
  };

  return (
    <div className="min-h-screen bg-transparent px-4 sm:px-6 pt-10 pb-16 max-w-7xl mx-auto">
      {/* Header row (omitted for brevity) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-semibold text-tp-bg"
        >
          Tasks
        </motion.h1>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Input (omitted for brevity) */}
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

          {/* New Task Button & Modal (omitted for brevity) */}
          <motion.button
            onClick={() => {
              setopenform(true);
            }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-tp-primary px-4 py-2 rounded-md hover:bg-tp-primaryDark transition-all duration-200"
          >
            <Plus className="" size={18} />
            <span className="hidden sm:inline ">New Task</span>
          </motion.button>
          
          <FormModal open={openform} onClose={() => setopenform(false)} title="New Task">
            <FormWrapper
              schema={TaskSchema}
              onSubmit={async (values) => {
                requestHandler(
                  // @ts-ignore
                  async () => await createTask(values),
                  null,
                  (res) => {
                    setTasks((prev) => [res.data, ...prev]);
                    showToast(res.message || "Task created", "success");
                    setopenform(false);
                  },
                  (err: any) => {
                    showToast(err?.message, "error");
                  }
                );
              }}
            >
              <TaskFormFields />
            </FormWrapper>
          </FormModal>
        </div>
      </div>

      {/* TABLE FOR LARGE SCREENS */}
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
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Priority</th>
                <th className="px-4 py-2">Due Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-tp-textMuted py-10 text-sm">
                    No tasks found.
                  </td>
                </tr>
              )}

              {filtered.map((task, index) => (
                <motion.tr
                  key={task._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-lg bg-tp-bgLight/10 text-base lg:hover:text-[15px] hover:cursor-pointer duration-200"
                >
                  <td 
                    className="px-4 py-3 text-tp-bg font-medium"
                    // Removed redundant onClick from <tr>, put logic on a specific button/cell
                  >
                    {task.title}
                  </td>
                  <td className="px-4 py-3 text-tp-textMuted">{task.status}</td>
                  <td className="px-4 py-3 text-tp-textMuted">{task.priority}</td>
                  <td className="px-4 py-3 text-tp-textMuted">
                    {dateFormat(task.dueDate, "d mmm, yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                       {/* NEW VIEW BUTTON for desktop */}
                       <button
                         onClick={() => {
                           setSelectedTask(task);
                           setDetailOpen(true);
                         }}
                         className="p-2 rounded-md hover:bg-tp-bgLight/20 text-tp-textMuted hover:text-tp-bg transition"
                       >
                         View
                       </button>
                      <TaskMoreMenu
                        onEdit={() => {
                          setSelectedTask(task);
                          setTimeout(() => setIsEditing(true), 100);
                        }}
                        onDelete={() => {
                          requestHandler(
                            async () => await deleteTask(task._id),
                            null,
                            (res) => {
                              showToast(res.message || "Task deleted", 'success');
                              setTasks((prev) => prev.filter((tsk) => tsk._id !== task._id));
                            },
                            (err: any) => {
                              showToast(err.message, 'error');
                            }
                          );
                        }}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* MOBILE CARD LIST VIEW */}
      <div className="md:hidden space-y-4">
        {filtered.map((task, index) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-xl bg-tp-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              {/* Task Details */}
              <div
                // Use a dedicated View button or click on the title/card to open the details
                onClick={() => {
                    setSelectedTask(task);
                    setDetailOpen(true);
                }}
                className="flex-1 cursor-pointer"
              >
                <div className="text-lg font-semibold text-tp-bg">
                  {task.title}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="text-tp-textMuted">Status:</div>
                  <div className="text-tp-bg">{task.status}</div>

                  <div className="text-tp-textMuted">Priority:</div>
                  <div className="text-tp-bg">{task.priority}</div>

                  <div className="text-tp-textMuted">Due:</div>
                  <div className="text-tp-bg">
                    {dateFormat(task.dueDate, "d mmm, yyyy")}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <TaskMoreMenu
                onEdit={() => {
                  setSelectedTask(task);
                  setTimeout(() => setIsEditing(true), 100);
                }}
                onDelete={() => {
                  requestHandler(
                    async () => await deleteTask(task._id),
                    null,
                    (res) => {
                      showToast(res.message || "Task deleted", 'success');
                      setTasks((prev) => prev.filter((tsk) => tsk._id !== task._id));
                    },
                    (err: any) => {
                      showToast(err.message, 'error');
                    }
                  );
                }}
              />
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-tp-textMuted py-10 text-sm">
            No tasks found.
          </p>
        )}
      </div>

      {/* CENTRALIZED DETAIL MODAL (Fixed: Uses detailOpen state and selectedTask data) */}
      <DetailModal
        open={detailOpen} // Controlled by the dedicated state
        onClose={() => {
            setDetailOpen(false);
            setSelectedTask(null); // Clear selection on close
        }}
        title="Task Details"
        data={
          selectedTask
            ? {
                Title: selectedTask.title,
                Description: selectedTask.description,
                Status: selectedTask.status,
                Priority: selectedTask.priority,
                "Due Date": dateFormat(selectedTask.dueDate, "d mmm yyyy"),
              }
            : {}
        }
      />

      {/* CENTRALIZED EDIT MODAL (omitted for brevity) */}
      <FormModal
        open={isEditing}
        onClose={() => {
          setIsEditing(false);
          setSelectedTask(null);
        }}
        title="Edit Task"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TaskFormFields defaultValue={{
            title: selectedTask?.title,
            description: selectedTask?.description,
            status: selectedTask?.status,
            priority: selectedTask?.priority,
            dueDate: selectedTask?.dueDate,
          }} register={register} errors={errors} />

          <div className="pt-5">
            {loading ? (
              <Button disabled type="button">
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button type="submit">Save</Button>
            )}
          </div>
        </form>
      </FormModal>
    </div>
  );
}