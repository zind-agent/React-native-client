import z from 'zod';
import { t } from 'i18next';

export const addTopicSchema = z.object({
  title: z.string().min(1, { message: t('event.append_title_required') }),
  tags: z.array(z.string()),
  status: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  likes: z.number().optional(),
  isPublic: z.boolean().optional(),
});

export type AddTopicSchemaType = z.infer<typeof addTopicSchema>;
