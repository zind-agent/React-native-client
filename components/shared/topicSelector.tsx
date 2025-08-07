import { Topic } from '@/storage/topicStorage';
import { Modal, View, FlatList, TouchableOpacity, I18nManager, Platform, StyleSheet } from 'react-native';
import { HStack } from '../ui/hstack';
import { Colors } from '@/constants/Colors';
import { Text } from '../Themed';
import { t } from 'i18next';
import { Box } from '../ui/box';

interface TopicItemProps {
  item: Topic;
  onSelect: () => void;
  isSelected: boolean;
}

interface TopicSelectorProps {
  visible: boolean;
  onClose: () => void;
  topics: Topic[];
  selectedCategoryId: string | undefined | null;
  onSelectCategory: (id: string) => void;
}

const TopicItem: React.FC<TopicItemProps> = ({ item, onSelect, isSelected }) => (
  <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
    <HStack className="items-center gap-3" style={[styles.topicItem, isSelected && styles.topicItemSelected]}>
      <Text>{item.title}</Text>
    </HStack>
  </TouchableOpacity>
);

const TopicSelector = ({ visible, onClose, topics, selectedCategoryId, onSelectCategory }: TopicSelectorProps) => (
  <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent={true}>
    <Box style={styles.modalContainer}>
      <Box style={styles.modalHeader}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelButton}>{t('category.cancel')}</Text>
        </TouchableOpacity>
        <Text style={styles.modalTitle}>{t('category.select_category')}</Text>
        <Box style={styles.placeholder} />
      </Box>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.main.background,
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <View
          style={{
            backgroundColor: Colors.main.background,
            borderRadius: 12,
            maxHeight: '80%',
            padding: 16,
          }}
        >
          <FlatList
            data={topics}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TopicItem
                item={item}
                isSelected={selectedCategoryId === item.id}
                onSelect={() => {
                  onSelectCategory(item.id);
                  onClose();
                }}
              />
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </View>
    </Box>
  </Modal>
);

export default TopicSelector;

const styles = StyleSheet.create({
  topicItem: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    borderWidth: 1,
    borderColor: Colors.main.border,
  },
  topicItemSelected: {
    backgroundColor: Colors.main.primaryLight,
    borderWidth: 2,
    borderColor: Colors.main.primary,
    elevation: 2,
  },
  modalContainer: {
    backgroundColor: Colors.main.background || '#FFFFFF',
    flex: 1,
  },
  modalHeader: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.main.border,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    marginBottom: 10,
  },
  cancelButton: {
    fontSize: 16,
    color: Colors.main.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.main.textPrimary,
  },
  placeholder: {
    width: 50,
  },
});
