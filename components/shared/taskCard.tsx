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

interface TaskCardProps {
  title: string;
  startTime?: string;
  endTime?: string;
  tags?: string[];
}

const TaskCard: React.FC<TaskCardProps> = ({ title, startTime, endTime, tags }) => {
  const { language } = useAppStore();

  const badageColor = (itemTag: string): string => {
    switch (itemTag) {
      case 'office':
        return Colors.light.tag.office;
      case 'home':
        return Colors.light.tag.homeOpacity;
      case 'urgent':
        return Colors.light.tag.urgent;
      case 'work':
        return Colors.light.tag.work;
      default:
        return Colors.light.tag.office;
    }
  };

  const borderStyles: StyleProp<ViewStyle> = {
    borderRightWidth: language === 'fa' ? 2 : 0,
    borderLeftWidth: language === 'fa' ? 0 : 2,
    borderRightColor: language === 'fa' ? Colors.light.primary : undefined,
    borderLeftColor: language === 'fa' ? undefined : Colors.light.primary,
    backgroundColor: Colors.light.card,
  };

  const iconPosition: StyleProp<ViewStyle> = {
    position: 'absolute',
    top: 20,
    [language === 'fa' ? 'left' : 'right']: 0,
    transform: [{ rotate: '90deg' }],
  };

  return (
    <VStack className="relative p-5 mb-1 rounded-lg mt-1" style={{ backgroundColor: Colors.light.card }}>
      <VStack className="px-3 h-[85px]" style={borderStyles}>
        <HStack className="justify-between">
          <Box>
            <Text style={{ color: Colors.light.darkBlue, fontSize: 18 }}>{title}</Text>
            <Text style={{ color: Colors.light.subtext, fontSize: 12 }}>
              {startTime ?? '00:00'} - {endTime ?? '00:00'}
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
