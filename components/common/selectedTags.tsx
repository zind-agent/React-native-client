import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { tags } from '@/constants/TodoAddTags';
import { Text } from '../Themed';
import { Button, ButtonText } from '../ui/button';
import { VStack } from '../ui/vstack';
import { Box } from '../ui/box';
import { StyleSheet } from 'react-native';

interface SelectedTagsProps {
  field: any;
}

const SelectedTags = ({ field }: SelectedTagsProps) => {
  const selectedTags = field.value || [];

  const toggleTag = (tagValue: string) => {
    if (selectedTags.includes(tagValue)) {
      field.onChange(selectedTags.filter((v: string) => v !== tagValue));
    } else {
      field.onChange([...selectedTags, tagValue]);
    }
  };

  return (
    <VStack className="justify-start items-start gap-3">
      <Text style={styles.text}>{t('event.tags')} </Text>
      <Box style={styles.tags}>
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.key);
          return (
            <Button
              key={tag.key}
              style={{
                backgroundColor: isSelected ? tag.color : 'transparent',
                borderWidth: 1,
                borderColor: tag.color,
              }}
              className="h-8 px-3 rounded-md"
              onPress={() => toggleTag(tag.key)}
            >
              <ButtonText
                className="text-sm"
                style={{
                  fontWeight: '800',
                  color: isSelected ? 'white' : tag.color,
                }}
              >
                {tag.label}
              </ButtonText>
            </Button>
          );
        })}
      </Box>
    </VStack>
  );
};

export default SelectedTags;

const styles = StyleSheet.create({
  text: {
    color: Colors.main.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  tags: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
