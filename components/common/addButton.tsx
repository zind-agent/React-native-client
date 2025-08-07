import { memo, useMemo, useCallback, useState } from 'react';
import { MotiView } from 'moti';
import { Platform, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, AddIcon, GlobeIcon } from '@/components/ui/icon';
import { usePathname, useRouter } from 'expo-router';
import { t } from 'i18next';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { Text } from '../Themed';
import { Box } from '../ui/box';

interface MenuItemProps {
  onPress: () => void;
  icon: React.ComponentType<any>;
  text: string;
  animationProps: {
    from: { opacity: number; translateY: number; translateX: number };
    animate: { opacity: number; translateY: number; translateX: number };
    transition: { type: 'spring'; damping: number; stiffness: number };
  };
  style?: ViewStyle;
}

interface Styles {
  container: ViewStyle;
  hidden: ViewStyle;
  overlay: ViewStyle;
  overlayPressable: ViewStyle;
  gradientButton: ViewStyle;
  menuItem: ViewStyle;
  menuItemPressable: ViewStyle;
  menuItemText: TextStyle;
  iconMargin: ViewStyle;
}

interface ShadowStyles {
  shadow: ViewStyle;
}

const shadowStyles = StyleSheet.create<ShadowStyles>({
  shadow: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
    android: { elevation: 2, shadowColor: '#000' },
    default: {},
  }),
});

const MenuItem: React.FC<MenuItemProps> = memo(({ onPress, icon, text, animationProps, style }) => (
  <MotiView {...animationProps} style={[styles.menuItem, shadowStyles.shadow, { direction: 'rtl' }, style]}>
    <Pressable onPress={onPress} style={styles.menuItemPressable}>
      <Icon as={icon} size="sm" color={Colors.main.info} style={styles.iconMargin} />
      <Text style={styles.menuItemText}>{text}</Text>
    </Pressable>
  </MotiView>
));

MenuItem.displayName = 'MenuItem';

const AddButton: React.FC = memo(() => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();

  const isHidden = useMemo(() => path === '/tabs/profile', [path]);

  const containerStyle = useMemo(() => [styles.container, isHidden && styles.hidden], [isHidden]);

  const gradientButtonStyle = useMemo(() => [styles.gradientButton, shadowStyles.shadow], []);

  const gradientColors = useMemo(() => ['#a855f7', '#06b6d4'] as const, []);
  const gradientStart = useMemo(() => ({ x: 0, y: 0 }), []);
  const gradientEnd = useMemo(() => ({ x: 1, y: 1 }), []);

  const firstMenuAnimation = {
    from: { opacity: 0, translateY: -40, translateX: -90 },
    animate: { opacity: 1, translateY: -60, translateX: -50 },
    transition: { type: 'spring', damping: 20, stiffness: 200 } as const,
  };

  const secondMenuAnimation = {
    from: { opacity: 0, translateX: -100, translateY: 0 },
    animate: { opacity: 1, translateY: 8, translateX: -80 },
    transition: { type: 'spring', damping: 30, stiffness: 200 } as const,
  };

  const addTaskText = useMemo(() => t('button.add_task'), []);
  const addByAiText = useMemo(() => t('button.add_by_ai'), []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleAddTask = useCallback(() => {
    handleClose();
    router.push('/tabs/(tabs)/createTask');
  }, [handleClose]);

  const handleAddByAi = useCallback(() => {
    router.push('/tabs/(tabs)/addTodoAi');
    handleClose();
  }, [router, handleClose]);

  if (isHidden) {
    return null;
  }

  return (
    <Box style={containerStyle}>
      {isOpen && (
        <Box style={styles.overlay}>
          <Pressable style={styles.overlayPressable} onPress={handleClose} />
        </Box>
      )}

      <Pressable onPress={toggleOpen}>
        <LinearGradient colors={gradientColors} start={gradientStart} end={gradientEnd} style={gradientButtonStyle}>
          <Icon as={AddIcon} size="xl" color={Colors.main.background} />
        </LinearGradient>
      </Pressable>

      {isOpen && (
        <>
          <MenuItem onPress={handleAddTask} icon={AddIcon} text={addTaskText} animationProps={firstMenuAnimation} />
          <MenuItem onPress={handleAddByAi} icon={GlobeIcon} text={addByAiText} animationProps={secondMenuAnimation} style={{ justifyContent: 'center' }} />
        </>
      )}
    </Box>
  );
});

AddButton.displayName = 'AddButton';

export default AddButton;

const styles = StyleSheet.create<Styles>({
  container: {
    position: 'relative',
    width: 60,
    height: 60,
    marginTop: -40,
    zIndex: 1001,
    direction: Platform.OS === 'ios' ? 'rtl' : 'rtl',
  },
  hidden: {
    display: 'none',
  },
  overlay: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 1000,
  },
  overlayPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  gradientButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    zIndex: 1002,
    alignItems: 'center',
  },
  menuItem: {
    position: 'absolute',
    minWidth: 150,
    padding: 13,
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 8,
    zIndex: 1002,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemPressable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: Colors.main.textPrimary,
    fontSize: 14,
  },
  iconMargin: {
    marginRight: 8,
  },
});
