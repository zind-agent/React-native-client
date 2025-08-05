import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

const TopicEdit = () => {
  const { id } = useLocalSearchParams();

  return (
    <Box style={styles.container}>
      <Text>{id}</Text>
    </Box>
  );
};
export default TopicEdit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.background,
  },
});
