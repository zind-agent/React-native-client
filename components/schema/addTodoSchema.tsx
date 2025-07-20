import z from 'zod';
import { t } from 'i18next';

export const addTodoSchema = z.object({
  title: z.string().min(1, { message: t('append_title_required') }),
  tags: z.array(z.string()),
  start_time: z.string().min(1, { message: t('append_time_required') }),
  end_time: z.string().min(1, { message: t('append_time_required') }),
  date: z.string().min(1, { message: t('append_date_required') }),
  description: z.string(),
  createdAt: z.string(),
  reminderDays: z.array(z.string()).optional(),
});

export type AddTodoSchemaType = z.infer<typeof addTodoSchema>;
