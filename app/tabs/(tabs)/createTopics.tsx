import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Colors } from '@/constants/Colors';
import { useTodoStore } from '@/store/todoState';
import { t } from 'i18next';
import { Box } from '@/components/ui/box';
import HeaderTitle from '@/components/common/headerTitle';
import { Controller } from 'react-hook-form';
import { AddTodoForm } from '@/components/shared/forms/addTodo/todoForm';
import CategoryPicker from '@/components/shared/categorySelector';
import { Category } from '@/constants/Category';
import { useTopicsFrom } from '@/hooks/useTopicsFrom';
import { TopicAdvancedFields } from '@/components/shared/forms/topciAdvancedField';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/Themed';
import { Switch } from '@/components/ui/switch';

const CreateTopics = () => {
  const { selectedDate } = useTodoStore();
  const { form, onSubmit } = useTopicsFrom(selectedDate);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 10}>
      <VStack className="flex-1 p-7 gap-4">
        <HeaderTitle title={t('create_task.create_task')} path={'../(tabs)/'} />

        <Controller
          name="title"
          control={control}
          render={({ field }) => <AddTodoForm autoFocus style={{ height: 40 }} value={field.value} placeholder={t('event.title')} onChange={field.onChange} error={errors.title?.message} />}
        />

        <TopicAdvancedFields control={control} />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <CategoryPicker selectedCategory={field.value} onCategorySelect={field.onChange} categories={Category} placeholder={t('category.select_category') || 'Select Category'} />
          )}
        />

        <Controller
          name="isPublic"
          control={control}
          render={({ field }) => (
            <HStack className="items-center justify-between border-b-2 px-1 mt-3" style={{ borderColor: Colors.main.border }}>
              <Text style={{ color: Colors.main.textPrimary }} className="text-lg">
                {t('event.is_public')}
              </Text>
              <Switch
                thumbColor={field.value?.valueOf() ? Colors.main.primary : Colors.main.textPrimary}
                trackColor={{ false: Colors.main.border, true: Colors.main.primary }}
                value={field.value}
                onValueChange={field.onChange}
              />
            </HStack>
          )}
        />
      </VStack>
      <Box className="flex-1" />
      <Box style={styles.buttonContainer}>
        <Button onPress={handleSubmit(onSubmit)} style={styles.buttonStyle}>
          <ButtonText style={styles.buttonText}>{t('event.add_topic')}</ButtonText>
        </Button>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default CreateTopics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.background,
  },
  buttonContainer: {
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.main.background,
  },
  buttonStyle: {
    backgroundColor: Colors.main.primary,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    borderRadius: 15,
    height: 50,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  buttonText: {
    color: Colors.main.textPrimary,
    fontWeight: '800',
    fontSize: 17,
  },
});
