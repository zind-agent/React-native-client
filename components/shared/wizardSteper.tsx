import React from 'react';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';
import { Box } from '../ui/box';
import { useAppStore } from '@/store/appState';
import { Text } from '../Themed';
import { useWizardStore } from '@/store/wizardFormState';

const WizardStepper = () => {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const stepLabels = [t('Information'), t('Goal'), t('Lifestyle'), t('Priority')];

  const { step: currentStep } = useWizardStore();

  return (
    <Box className="flex-row items-start justify-between w-full px-4 mt-4 mb-6">
      {stepLabels.map((stepLabel, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isLast = index === stepLabels.length - 1;

        return (
          <Box key={index} className="flex-1 items-center relative">
            <Box className="items-center z-10">
              <MotiView
                from={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  opacity: 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 20,
                }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 5,
                  elevation: 2,
                  backgroundColor: isCompleted ? Colors.main.primary : isActive ? Colors.main.primary : Colors.main.primaryLight,
                  borderWidth: isActive ? 2 : 0,
                  borderColor: Colors.main.primary,
                }}
              >
                {isCompleted ? (
                  <MotiView
                    from={{ scale: 0, rotate: '-90deg' }}
                    animate={{ scale: 1, rotate: '0deg' }}
                    transition={{
                      type: 'spring',
                      delay: 200,
                      stiffness: 400,
                    }}
                  >
                    <Ionicons name="checkmark" size={18} color="white" />
                  </MotiView>
                ) : (
                  <Text
                    className="text-lg font-bold"
                    style={{
                      color: isActive ? 'white' : Colors.main.background,
                    }}
                  >
                    {stepNumber}
                  </Text>
                )}
              </MotiView>

              <MotiView from={{ opacity: 0.5 }} animate={{ opacity: isActive ? 1 : 0.6 }} transition={{ duration: 300 }}>
                <Text
                  className="text-[10px] text-center font-heading"
                  style={{
                    color: isActive ? Colors.main.background : Colors.main.primaryLight,
                  }}
                >
                  {stepLabel}
                </Text>
              </MotiView>
            </Box>

            {!isLast && (
              <Box className="absolute top-[18px] h-0.5 z-0" style={{ left: language == 'fa' ? '-60%' : '60%', right: language == 'fa' ? '60%' : '-60%' }}>
                <Box className="absolute w-full h-full" style={{ backgroundColor: Colors.main.primaryLight }} />
                <MotiView
                  from={{ width: 0 }}
                  animate={{
                    width: isCompleted ? '100%' : '0%',
                  }}
                  transition={{
                    type: 'timing',
                    duration: 500,
                    delay: isCompleted ? 300 : 0,
                  }}
                  style={{
                    height: '100%',
                    backgroundColor: Colors.main.primary,
                  }}
                />
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default WizardStepper;
