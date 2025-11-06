import { z } from "zod";

const validTypes = ["FILE_UPLOAD", "DATE_SELECTION", "CASE_ASSIGNMENT", "MESSAGE", "IMAGE_UPLOAD"];

export const createTaskSchema = z.object({
  body: z.object({
    type: z.enum(validTypes, { message: "Geçersiz task türü" }),
    title: z.string().min(1, "Başlık gerekli"),
    description: z.string().optional(),
    deadline: z.string().datetime().optional(),
    scheduledDate: z.string().datetime().optional(),
    caseContent: z.string().optional(),
    isRequired: z.boolean().optional().default(true),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    deadline: z.string().datetime().optional().nullable(),
    scheduledDate: z.string().datetime().optional().nullable(),
    caseContent: z.string().optional().nullable(),
    isRequired: z.boolean().optional(),
  }),
});
