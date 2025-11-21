import { z } from "zod";

const taskItemSchema = z.object({
  title: z.string().min(1, "Başlık gerekli"),
  description: z.string().optional(),
  deadline: z.string().datetime().optional(),
  isRequired: z.boolean().optional().default(true),
});

// tek task ya da array task
export const createTaskSchema = z.union([
  taskItemSchema,         
  z.array(taskItemSchema)  
]);

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  deadline: z.string().datetime().optional().nullable(),
  isRequired: z.boolean().optional(),
});
