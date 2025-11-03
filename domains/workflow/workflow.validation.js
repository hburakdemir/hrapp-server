import { z } from "zod";

export const createWorkflowSchema = z.object({
    name: z.string().min(3,"workflo adı en az 3 karakter olmalıdır"),
    stages:z.array(z.string().min(1,"en az bir aşama tanımlanmalıdır")),
})


export const updateWorkflowSchema = z.object({
    name:z.string().min(3).optional(),
    stages:z.array(z.string()).optional(),
    isActive:z.boolean().optional()
})

export const assignWorkflowSchema = z.object({
  candidateId: z.number().int().positive(),
  workflowId: z.number().int().positive(),
});