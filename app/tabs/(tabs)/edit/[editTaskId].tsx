import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, I18nManager, TouchableOpacity, ScrollView, View } from 'react-native';
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
import { useAppStore } from '@/store/appState';

const EditTask: React.FC = () => {
  const { selectedDate, task } = useTodoStore();
  const { user } = useAppStore();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userTopics, loadUserTopics } = useTopicStore();

  useEffect(() => {
    loadUserTopics(user?.id as string);
  }, [loadUserTopics]);

  const { form, onSubmit } = useTodoForm({ selectedDate, task });
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const startTime = watch('startTime');
  const endTime = watch('endTime');
  const selectedCategoryId = watch('categoryId');

  const selectedTopic = userTopics.find((topic) => topic.id === selectedCategoryId);

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={true}>
          <Box style={styles.header}>
            <HeaderTitle title={t('todos.edit_event')} path={'../(tabs)/'} />
          </Box>

          <Box style={styles.section}>
            <TodoBasicFields control={control} errors={errors} startTime={startTime} endTime={endTime} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker} />
          </Box>

          <Box style={styles.section}>
            <TouchableOpacity
              style={[styles.sectionButton, { opacity: userTopics.length === 0 ? 0.7 : 1 }]}
              onPress={() => setIsModalVisible(true)}
              activeOpacity={0.8}
              disabled={userTopics.length === 0}
            >
              <Box style={styles.sectionButtonContent}>
                <Text style={styles.sectionTitle}>{t('activity.title')}</Text>
                <Text style={[styles.sectionSubtitle, { display: userTopics.length === 0 ? 'flex' : 'none' }]}>{t('create_task.no_topics')}</Text>
                <Text style={[styles.sectionSubtitle, { display: selectedTopic ? 'flex' : 'none' }]}>{selectedTopic ? selectedTopic.title : ''}</Text>
              </Box>
              {userTopics.length === 0 && <CancelIcon color={'transparent'} />}
              {userTopics.length > 0 && <Icon as={ChevronUpIcon} size="md" color={Colors.main.textSecondary} />}
            </TouchableOpacity>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <TopicSelector visible={isModalVisible} onClose={() => setIsModalVisible(false)} topics={userTopics} selectedCategoryId={field.value} onSelectCategory={field.onChange} />
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
        </ScrollView>

        <Box style={styles.fixedButtonContainer}>
          <Button onPress={handleSubmit(onSubmit)} style={styles.buttonStyle}>
            <ButtonText style={styles.buttonText}>{t('button.add_task')}</ButtonText>
          </Button>
        </Box>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
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
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.main.background,
    padding: 18,
    paddingTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.main.cardBackground,
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
    fontSize: 17,
  },
});
