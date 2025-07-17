import React from 'react';
import { VStack } from '../ui/vstack';
import { Text } from '../Themed';
import { Colors } from '@/constants/Colors';
import { Badge, BadgeText } from '../ui/badge';
import { Platform, StyleProp, ViewStyle } from 'react-native';
import { HStack } from '../ui/hstack';
import { Box } from '../ui/box';
import { Icon } from '../ui/icon';
import { DotIcon } from '@/assets/Icons/DotIcons';
import { useAppStore } from '@/store/appState';
import { Button } from '../ui/button';
import { Todo } from '@/storage/todoStorage';

const TaskCard: React.FC<Todo> = ({ title, start_time, end_time, tags, id }) => {
  const { language } = useAppStore();

  const badageColor = (itemTag: string): string => {
    switch (itemTag) {
      case 'office':
        return Colors.main.tag.office;
      case 'home':
        return Colors.main.tag.homeOpacity;
      case 'urgent':
        return Colors.main.tag.urgent;
      case 'work':
        return Colors.main.tag.work;
      default:
        return Colors.main.tag.office;
    }
  };

  const borderStyles: StyleProp<ViewStyle> = {
    borderRightWidth: language === 'fa' ? 2 : 0,
    borderLeftWidth: language === 'fa' ? 0 : 2,
    borderRightColor: language === 'fa' ? Colors.main.primary : undefined,
    borderLeftColor: language === 'fa' ? undefined : Colors.main.primary,
    backgroundColor: Colors.main.card,
  };

  const iconPosition: StyleProp<ViewStyle> = {
    position: 'absolute',
    top: 20,
    [language === 'fa' ? 'left' : 'right']: 0,
    transform: [{ rotate: '90deg' }],
  };

  return (
    <VStack className="relative p-5 mb-1 rounded-lg mt-1" style={{ backgroundColor: Colors.main.card, elevation: 1 }}>
      <VStack className="px-3 h-[85px]" style={borderStyles}>
        <HStack className="justify-between">
          <Box>
            <Text style={{ color: Colors.main10275A, fontSize: 18 }}>{title}</Text>
            <Text style={{ color: Colors.main8E9EAB, fontSize: 12 }}>
              {start_time ?? '00:00'} - {end_time ?? '00:00'}
            </Text>
          </Box>
          <Button className="px-0 bg-transparent">
            <Icon as={DotIcon} style={iconPosition} />
          </Button>
        </HStack>
        <HStack className="flex-wrap">
          {tags?.map((item) => (
            <Badge className="mt-1" style={{ backgroundColor: badageColor(item), marginHorizontal: 5 }} key={item}>
              <BadgeText>{item}</BadgeText>
            </Badge>
          ))}
        </HStack>
      </VStack>
    </VStack>
  );
};

export default TaskCard;
