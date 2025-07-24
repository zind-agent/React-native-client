import React, { memo, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Drawer, DrawerBackdrop, DrawerContent, DrawerBody } from '@/components/ui/drawer';
import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionTitleText, AccordionContent, AccordionIcon } from '@/components/ui/accordion';
import { Button, ButtonText } from '@/components/ui/button';
import { ChevronDownIcon, ChevronUpIcon } from '@/components/ui/icon';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/appState';
import { useTodoStore } from '@/store/todoState';
import { t } from 'i18next';
import { useTodoForm } from '@/hooks/useTodoForm';
import { TodoBasicFields } from '../todoBaseField';
import { TodoAdvancedFields } from '../todoAdvancedField';
import Loading from '@/components/common/Loading';

const AddTodoInTime = memo(() => {
  const { addInTimeTodoDrawer, setAddInTimeTodoDrawer } = useAppStore();
  const { editLoading, selectedDate } = useTodoStore();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { form, onSubmit } = useTodoForm(selectedDate);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const startTime = watch('start_time');
  const endTime = watch('end_time');

  if (editLoading) {
    return <Loading />;
  }

  return (
    <Drawer isOpen={addInTimeTodoDrawer} onClose={() => setAddInTimeTodoDrawer(false)} size="lg" anchor="bottom" className="bg-black/50">
      <DrawerBackdrop />
      <DrawerContent style={{ backgroundColor: Colors.main.cardBackground }} className="h-max rounded-t-[30px] border-t-0 p-3 px-7">
        <DrawerBody>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 10}>
            <TodoBasicFields control={control} errors={errors} startTime={startTime} endTime={endTime} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker} />
            <Accordion size="md" variant="filled" type="single" isCollapsible className="mb-5 mt-3 bg-transparent">
              <AccordionItem value="advanced">
                <AccordionHeader>
                  <AccordionTrigger className="border-b-[1px] h-12 rounded-md" style={{ borderColor: Colors.main.primary, backgroundColor: Colors.main.background + 50 }}>
                    {({ isExpanded }) => (
                      <>
                        <AccordionTitleText style={{ color: Colors.main.textPrimary }}>{t('options')}</AccordionTitleText>
                        {isExpanded ? <AccordionIcon as={ChevronUpIcon} className="ml-3 text-white" /> : <AccordionIcon as={ChevronDownIcon} className="ml-3 text-white" />}
                      </>
                    )}
                  </AccordionTrigger>
                </AccordionHeader>

                <AccordionContent style={{ backgroundColor: Colors.main.background + 50 }} className="rounded-b-lg">
                  <TodoAdvancedFields control={control} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button onPress={handleSubmit(onSubmit)} className="w-full h-16 rounded-lg" style={{ backgroundColor: Colors.main.primary }}>
              {editLoading && <Loading />}
              <ButtonText className="text-xl" style={{ color: Colors.main.background, fontWeight: '800' }}>
                {t('submit')}
              </ButtonText>
            </Button>
          </KeyboardAvoidingView>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
});

export default AddTodoInTime;
