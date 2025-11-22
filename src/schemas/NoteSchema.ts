import { z } from "zod";

export const NoteSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters" })
    .max(80, { message: "Title must be less than 80 characters" }),

  content: z
    .string()
    .min(5, { message: "Content is too short" })
    .max(500, { message: "Content too long" }),

  tag: z.string(),
});

export type NoteSchemaType = z.infer<typeof NoteSchema>;
