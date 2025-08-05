import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
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

const CreateTask = () => {
  const { selectedDate } = useTodoStore();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const { form, onSubmit } = useTodoForm(selectedDate);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 10}>
      <View style={styles.inner}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <HeaderTitle title={t('create_task.create_task')} path={'../(tabs)/'} />
          <TodoBasicFields control={control} errors={errors} startTime={startTime} endTime={endTime} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker} />

          <Button style={styles.accordionHeader} onPress={() => setIsAccordionOpen(!isAccordionOpen)}>
            <Box style={styles.accordionHeaderContent}>
              <Text style={styles.accordionTitle}>{t('event.options')}</Text>
              <Icon as={isAccordionOpen ? ChevronUpIcon : ChevronDownIcon} size="lg" color={Colors.main.textPrimary} />
            </Box>
          </Button>

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
                <TodoAdvancedFields control={control} />
              </MotiView>
            )}
          </AnimatePresence>
        </ScrollView>

        <Box style={styles.buttonContainer}>
          <Button onPress={handleSubmit(onSubmit)} style={styles.buttonStyle}>
            <ButtonText style={styles.buttonText}>{t('button.submit')}</ButtonText>
          </Button>
        </Box>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.background,
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20,
  },
  buttonContainer: {
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.main.background,
  },
  buttonStyle: {
    backgroundColor: Colors.main.primary,
    width: '90%',
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
    fontSize: 20,
  },
  accordionHeader: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 10,
    marginBottom: 10,
    height: 50,
    elevation: 3,
    shadowRadius: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
  },
  accordionHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.main.textPrimary,
  },
  accordionContent: {
    overflow: 'visible',
    backgroundColor: Colors.main.cardBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
});
