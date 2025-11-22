import { z } from "zod";

export const ProjectSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Project title must be at least 3 characters" })
    .max(80, { message: "Project title must be under 80 characters" }),

  description: z
    .string()
    .min(5, { message: "Description is too short" })
    .max(700, { message: "Description too long" })
    .optional(),

    // @ts-ignore
  status: z.enum(["Active", "On Hold", "Completed"], {
    required_error: "Status is required",
  }),

  dueDate: z
    .string()
    .optional()
    .refine((date) => (date ? !isNaN(new Date(date).getTime()) : true), {
      message: "Invalid date format",
    }),

  members: z.array(z.string()).optional(), // user IDs
});

export type ProjectSchemaType = z.infer<typeof ProjectSchema>;
