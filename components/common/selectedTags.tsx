import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { HStack } from '../../ui/hstack';
import { Button, ButtonText } from '../../ui/button';
import { tags } from '@/constants/TodoAddTags';
import { Text } from '../../Themed';

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
    <HStack className="justify-start items-center gap-2  p-2 flex-wrap">
      <Text style={{ color: Colors.main.textPrimary, fontSize: 16, fontWeight: '800' }}>
        {t('tags')} ({selectedTags.length})
      </Text>
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
    </HStack>
  );
};

export default SelectedTags;
