import { View } from '../Themed';

const Loading = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <View className="w-10 h-10 border-t-2 border-b-2 border-primary-500 rounded-full animate-spin" />
    </View>
  );
};

export default Loading;
