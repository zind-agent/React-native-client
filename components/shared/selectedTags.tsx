import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { HStack } from '../ui/hstack';
import { Button, ButtonText } from '../ui/button';
import { tags } from '@/constants/TodoAddTags';

import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionTitleText, AccordionContent, AccordionIcon } from '@/components/ui/accordion';

import { ChevronDownIcon, ChevronUpIcon } from '../ui/icon';

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
    <Accordion size="md" variant="filled" type="single" isCollapsible className="my-5 border-0">
      <AccordionItem value="tags">
        <AccordionHeader>
          <AccordionTrigger className="rounded-lg h-16" style={{ backgroundColor: Colors.main.lightBlue }}>
            {({ isExpanded }) => (
              <>
                <AccordionTitleText>
                  {t('tags')} ({selectedTags.length})
                </AccordionTitleText>
                {isExpanded ? <AccordionIcon as={ChevronUpIcon} className="ml-3" /> : <AccordionIcon as={ChevronDownIcon} className="ml-3" />}
              </>
            )}
          </AccordionTrigger>
        </AccordionHeader>

        <AccordionContent>
          <HStack className="justify-start items-center gap-2  p-2 flex-wrap">
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SelectedTags;
