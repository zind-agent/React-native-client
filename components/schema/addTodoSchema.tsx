import z from 'zod';
import { t } from 'i18next';

export const addTodoSchema = z.object({
  title: z.string().min(1, { message: t('append_title_required') }),
  tags: z.array(z.string()),
  startTime: z.string().min(1, { message: t('append_time_required') }),
  endTime: z.string().min(1, { message: t('append_time_required') }),
  status: z.string().optional(),
  categoryId: z.string().optional(),
  goalId: z.string(),
  date: z.string().min(1, { message: t('append_date_required') }),
  description: z.string(),
  createdAt: z.string(),
  reminderDays: z.array(z.string()).optional(),
});

export type AddTodoSchemaType = z.infer<typeof addTodoSchema>;
