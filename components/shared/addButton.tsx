import { MotiView } from 'moti';
import { Platform, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, AddIcon, GlobeIcon } from '@/components/ui/icon';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/appState';
import { t } from 'i18next';
import { useState } from 'react';
import { Colors } from '@/constants/Colors';

const AddButton = () => {
  const { setAddInTimeTodoDrawer } = useAppStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View
      style={{
        position: 'relative',
        width: 60,
        height: 60,
        marginTop: -30,
        zIndex: 10,
      }}
    >
      <Pressable onPress={() => setIsOpen(!isOpen)}>
        <LinearGradient
          colors={['#a855f7', '#06b6d4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: 'center',
            zIndex: 10,
            alignItems: 'center',
            ...Platform.select({
              ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
              android: { elevation: 4, shadowColor: '#000' },
            }),
          }}
        >
          <Icon as={AddIcon} size="lg" color={Colors.light.card} />
        </LinearGradient>
      </Pressable>

      {isOpen && (
        <>
          <MotiView
            from={{ opacity: 0, translateY: -40, translateX: -90 }}
            animate={{ opacity: 1, translateY: -50, translateX: -100 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              position: 'absolute',
              width: 120,
              padding: 10,
              backgroundColor: Colors.light.surface,
              borderRadius: 8,
              zIndex: 8,
              flexDirection: 'row',
              alignItems: 'center',
              ...Platform.select({
                ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
                android: { elevation: 2 },
              }),
            }}
          >
            <Pressable
              onPress={() => {
                setAddInTimeTodoDrawer(true);
              }}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Icon as={AddIcon} size="sm" color={Colors.light.info} style={{ marginRight: 8 }} />
              <Text style={{ color: Colors.light.text, fontSize: 14 }}>{t('todos.add_task')}</Text>
            </Pressable>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: -100, translateY: 0 }}
            animate={{ opacity: 1, translateY: 10, translateX: -140 }}
            transition={{ type: 'spring', damping: 80, stiffness: 200 }}
            style={{
              position: 'absolute',
              width: 120,
              zIndex: 8,
              padding: 10,
              backgroundColor: Colors.light.surface,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              ...Platform.select({
                ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
                android: { elevation: 2 },
              }),
            }}
          >
            <Pressable
              onPress={() => {
                router.push('/tabs/(tabs)/addTodoAi');
                setIsOpen(false);
              }}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Icon as={GlobeIcon} size="sm" color={Colors.light.info} style={{ marginRight: 8 }} />
              <Text style={{ color: Colors.light.text, fontSize: 14 }}>{t('todos.add_by_ai')}</Text>
            </Pressable>
          </MotiView>
        </>
      )}
    </View>
  );
};

export default AddButton;
