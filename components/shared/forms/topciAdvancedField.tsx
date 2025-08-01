import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/Themed';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import SelectedTags from '@/components/common/selectedTags';
import { AddTopicSchemaType } from '@/components/schema/addTopicSchema';
import { StyleSheet } from 'react-native';
import { Box } from '@/components/ui/box';

interface TopicAdvancedFieldsProps {
  control: Control<AddTopicSchemaType>;
}

export const TopicAdvancedFields: React.FC<TopicAdvancedFieldsProps> = ({ control }) => {
  return (
    <VStack className="gap-4">
      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <VStack style={styles.description}>
            <Text style={{ color: Colors.main.textPrimary }}>{t('profile.description')}</Text>
            <Textarea
              className="my-1 w-full rounded-lg px-4 h-[100px]"
              style={{
                backgroundColor: Colors.main.background,
                borderWidth: 1,
                borderColor: Colors.main.primaryLight,
              }}
              size="sm"
              isReadOnly={false}
              isInvalid={!!fieldState.error}
              isDisabled={false}
            >
              <TextareaInput
                value={field.value}
                onChangeText={field.onChange}
                placeholder={t('activity.write_description_topic')}
                className="h-10 items-start text-[14px]"
                style={{ textAlignVertical: 'top', color: Colors.main.textPrimary }}
                placeholderTextColor={Colors.main.primaryLight}
              />
            </Textarea>
          </VStack>
        )}
      />

      <Box style={styles.tags}>
        <Controller control={control} name="tags" render={({ field }) => <SelectedTags field={field} />} />
      </Box>
    </VStack>
  );
};

const styles = StyleSheet.create({
  description: {
    backgroundColor: Colors.main.cardBackground,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 4,
  },
  tags: {
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.main.cardBackground,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
});
