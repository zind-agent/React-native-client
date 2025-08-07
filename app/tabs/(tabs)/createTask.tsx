import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, I18nManager, TouchableOpacity, SafeAreaView } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Colors } from '@/constants/Colors';
import { useTodoStore } from '@/store/todoState';
import { t } from 'i18next';
import { useTodoForm } from '@/hooks/useTodoForm';
import { Box } from '@/components/ui/box';
import { TodoBasicFields } from '@/components/shared/forms/todoBaseField';
import { TodoAdvancedFields } from '@/components/shared/forms/todoAdvancedField';
import HeaderTitle from '@/components/common/headerTitle';
import { AnimatePresence, MotiView } from 'moti';
import { Text } from '@/components/Themed';
import { ChevronDownIcon, ChevronUpIcon, Icon } from '@/components/ui/icon';
import { useTopicStore } from '@/store/topcisState';
import { Controller } from 'react-hook-form';
import DaySelector from '@/components/common/daySelecter';
import TopicSelector from '@/components/shared/topicSelector';
import { CancelIcon } from '@/assets/Icons/Cancel';

const CreateTask: React.FC = () => {
  const { selectedDate } = useTodoStore();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { topics, loadUserTopics } = useTopicStore();

  useEffect(() => {
    loadUserTopics('0');
  }, [loadUserTopics]);

  const { form, onSubmit } = useTodoForm(selectedDate);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const startTime = watch('startTime');
  const endTime = watch('endTime');
  const selectedCategoryId = watch('categoryId');

  const selectedTopic = topics.find((topic) => topic.id === selectedCategoryId);

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <Box style={styles.inner}>
          <Box style={styles.header}>
            <HeaderTitle title={t('create_task.create_task')} path={'../(tabs)/'} />
          </Box>

          <Box style={styles.section}>
            <TodoBasicFields control={control} errors={errors} startTime={startTime} endTime={endTime} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker} />
          </Box>

          <Box style={styles.section}>
            <TouchableOpacity style={[styles.sectionButton, { opacity: 0.7 }]} onPress={() => setIsModalVisible(true)} activeOpacity={0.8} disabled={topics.length === 0}>
              <Box style={styles.sectionButtonContent}>
                <Text style={styles.sectionTitle}>{t('activity.title')}</Text>
                <Text style={[styles.sectionSubtitle, { display: topics.length === 0 ? 'flex' : 'none' }]}>{t('create_task.no_topics')}</Text>
                <Text style={[styles.sectionSubtitle, { display: selectedTopic ? 'flex' : 'none' }]}>{selectedTopic ? selectedTopic.title : ''}</Text>
              </Box>
              {topics.length === 0 && <CancelIcon color={'transparent'} />}
              {topics.length > 0 && <Icon as={ChevronUpIcon} size="md" color={Colors.main.textSecondary} />}
            </TouchableOpacity>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <TopicSelector visible={isModalVisible} onClose={() => setIsModalVisible(false)} topics={topics} selectedCategoryId={field.value} onSelectCategory={field.onChange} />
              )}
            />
          </Box>

          <Box style={styles.section}>
            <TouchableOpacity style={styles.sectionButton} onPress={toggleAccordion} activeOpacity={0.8}>
              <Box style={styles.sectionButtonContent}>
                <Text style={styles.sectionTitle}>{t('event.options')}</Text>
              </Box>
              <Icon as={isAccordionOpen ? ChevronUpIcon : ChevronDownIcon} size="md" color={Colors.main.textSecondary} />
            </TouchableOpacity>

            <AnimatePresence>
              {isAccordionOpen && (
                <MotiView
                  from={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    type: 'timing',
                    duration: 300,
                    height: { type: 'spring', stiffness: 100, damping: 20 },
                  }}
                  style={styles.accordionContent}
                >
                  <Controller name="reminderDays" control={control} render={({ field }) => <DaySelector field={field} />} />
                  <TodoAdvancedFields control={control} />
                </MotiView>
              )}
            </AnimatePresence>
          </Box>

          <Box style={styles.buttonContainer}>
            <Button onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
              <ButtonText style={styles.submitButtonText}>{t('button.submit')}</ButtonText>
            </Button>
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.background,
  },
  keyboardView: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionButton: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionButtonContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.main.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.main.textSecondary,
  },
  accordionContent: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  submitButton: {
    backgroundColor: Colors.main.button,
    borderRadius: 12,
    height: 52,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: Colors.main.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
});
