import { z } from 'zod';

// Task oluşturma validation şeması (basitleştirilmiş)
export const createTaskSchema = z.object({
  type: z.enum(['FILE_UPLOAD', 'DATE_SELECTION', 'CASE_ASSIGNMENT', 'MESSAGE', 'IMAGE_UPLOAD'], {
    required_error: 'Task türü zorunludur',
    invalid_type_error: 'Geçersiz task türü'
  }),
  
  title: z.string({
    required_error: 'Task başlığı zorunludur'
  })
    .min(3, 'Task başlığı en az 3 karakter olmalıdır')
    .max(200, 'Task başlığı en fazla 200 karakter olabilir'),
  
  description: z.string()
    .max(1000, 'Açıklama en fazla 1000 karakter olabilir')
    .optional(),
  
  deadline: z.string()
    .datetime({ message: 'Deadline geçerli bir ISO tarihi olmalıdır' })
    .optional(),
  
  scheduledDate: z.string()
    .datetime({ message: 'Planlanan tarih geçerli bir ISO tarihi olmalıdır' })
    .optional(),
  
  caseContent: z.string()
    .min(10, 'Case içeriği en az 10 karakter olmalıdır')
    .max(5000, 'Case içeriği en fazla 5000 karakter olabilir')
    .optional(),
  
  isRequired: z.boolean()
    .default(true)
});

// Task güncelleme validation şeması
export const updateTaskSchema = z.object({
  title: z.string()
    .min(3, 'Task başlığı en az 3 karakter olmalıdır')
    .max(200, 'Task başlığı en fazla 200 karakter olabilir')
    .optional(),
  
  description: z.string()
    .max(1000, 'Açıklama en fazla 1000 karakter olabilir')
    .optional(),
  
  deadline: z.string()
    .datetime({ message: 'Deadline geçerli bir ISO tarihi olmalıdır' })
    .nullable()
    .optional(),
  
  scheduledDate: z.string()
    .datetime({ message: 'Planlanan tarih geçerli bir ISO tarihi olmalıdır' })
    .nullable()
    .optional(),
  
  caseContent: z.string()
    .max(5000, 'Case içeriği en fazla 5000 karakter olabilir')
    .optional(),
  
  isRequired: z.boolean()
    .optional()
});

// Params validation şemaları
export const stageIdParamSchema = z.object({
  stageId: z.string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'Stage ID pozitif bir sayı olmalıdır'
    })
});

export const taskIdParamSchema = z.object({
  taskId: z.string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'Task ID pozitif bir sayı olmalıdır'
    })
});

// Query validation şemaları
export const taskListQuerySchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'DENIED'])
    .optional(),
  
  type: z.enum(['FILE_UPLOAD', 'DATE_SELECTION', 'CASE_ASSIGNMENT', 'MESSAGE', 'IMAGE_UPLOAD'])
    .optional(),
  
  page: z.string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val >= 1, {
      message: 'Sayfa numarası 1 veya daha büyük olmalıdır'
    })
    .default('1'),
  
  limit: z.string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val >= 1 && val <= 100, {
      message: 'Limit 1-100 arasında olmalıdır'
    })
    .default('10')
});

// Task template validation şeması (basitleştirilmiş)
export const taskTemplateSchema = z.object({
  type: z.enum(['FILE_UPLOAD', 'DATE_SELECTION', 'CASE_ASSIGNMENT', 'MESSAGE', 'IMAGE_UPLOAD'], {
    required_error: 'Task türü zorunludur'
  }),
  
  title: z.string({
    required_error: 'Task başlığı zorunludur'
  })
    .min(3, 'Task başlığı en az 3 karakter olmalıdır')
    .max(200, 'Task başlığı en fazla 200 karakter olabilir'),
  
  description: z.string()
    .max(1000, 'Açıklama en fazla 1000 karakter olabilir')
    .optional(),
  
  caseContent: z.string()
    .min(10, 'Case içeriği en az 10 karakter olmalıdır')
    .max(5000, 'Case içeriği en fazla 5000 karakter olabilir')
    .optional(),
  
  isRequired: z.boolean()
    .default(true),
  
  defaultDeadlineDays: z.number()
    .int('Varsayılan deadline tam sayı olmalıdır')
    .min(1, 'Varsayılan deadline en az 1 gün olmalıdır')
    .max(365, 'Varsayılan deadline en fazla 365 gün olabilir')
    .optional()
});