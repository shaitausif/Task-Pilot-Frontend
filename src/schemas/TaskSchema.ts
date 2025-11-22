import { z } from "zod";

export const TaskSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Task title must be at least 2 characters" })
    .max(80, { message: "Task title must be less than 60 characters" }).nonempty(),

  description: z
    .string()
    .min(3, { message: "Description is too short" })
    .max(500, { message: "Description too long" })
    .nonempty(),

    // @ts-ignore
  status: z.enum(["Pending", "In-Progress", "Completed"], {
    required_error: "Status is required",
  }),

  // @ts-ignore
  priority: z.enum(["Low", "Medium", "High"], {
    required_error: "Priority is required",
  }),

  dueDate: z
    .string()
    .refine((date) => !isNaN(new Date(date).getTime()), {
      message: "Invalid date format",
    })
    .optional(),
});

export type TaskSchemaType = z.infer<typeof TaskSchema>;
