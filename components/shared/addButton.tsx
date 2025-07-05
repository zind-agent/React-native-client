import Plus from '@/assets/Icons/Plus';
import { MotiView } from 'moti';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AddButton = ({ focused }: { focused: boolean }) => {
  return (
    <MotiView
      from={{ width: 60, height: 60 }}
      animate={{ width: focused ? 65 : 60, height: focused ? 65 : 60 }}
      transition={{ type: 'timing', duration: 200 }}
      style={{
        borderRadius: 35,
        marginTop: -35,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          },
          android: { elevation: 5 },
        }),
      }}
    >
      <LinearGradient
        colors={['#a855f7', '#06b6d4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          borderRadius: 35,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Plus />
      </LinearGradient>
    </MotiView>
  );
};

export default AddButton;
