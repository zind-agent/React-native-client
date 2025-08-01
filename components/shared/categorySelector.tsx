import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Platform, I18nManager } from 'react-native';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { Box } from '../ui/box';
import { HStack } from '../ui/hstack';

export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

export interface CategoryPickerProps {
  selectedCategory?: string | undefined;
  onCategorySelect: (category: string) => void;
  categories: Category[];
  onAddCategory?: (category: Category) => void;
  placeholder?: string;
  style?: any;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({ selectedCategory, onCategorySelect, categories, placeholder, style }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const categboryItems = categories.find((category) => category.id === selectedCategory);

  const handleCategorySelect = (category: string) => {
    onCategorySelect(category);
    setIsModalVisible(false);
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity style={[styles.categoryItem, item.id === selectedCategory && styles.selectedCategoryItem]} onPress={() => handleCategorySelect(item.id)}>
      <HStack className="items-center">
        {item.color && <View style={[styles.categoryColorIndicator, { backgroundColor: item.color }]} />}
        <Text style={[styles.categoryText, item.id === selectedCategory && styles.selectedCategoryText]}>{item.name}</Text>
      </HStack>
      {item.icon && <Text style={styles.categoryIcon}>{item.icon}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={style}>
      <TouchableOpacity style={styles.pickerButton} onPress={() => setIsModalVisible(true)}>
        <View>
          {categboryItems ? (
            <HStack style={styles.selectedCategoryDisplay}>
              {categboryItems.color && <View style={[styles.categoryColorIndicator, { backgroundColor: categboryItems.color }]} />}
              <Text style={styles.categoryText}>{categboryItems.name}</Text>
            </HStack>
          ) : (
            <Text style={styles.placeholderText}>{placeholder}</Text>
          )}
        </View>
        <Text style={[styles.dropdownIcon, styles.dropdownIconRTL]}>▼</Text>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <Box style={styles.modalContainer}>
          <Box style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(false);
              }}
            >
              <Text style={styles.cancelButton}>{t('category.cancel')}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{t('category.select_category')}</Text>
            <Box style={styles.placeholder} />
          </Box>
          <FlatList data={categories} keyExtractor={(item) => item.id} renderItem={renderCategoryItem} style={styles.categoryList} />
        </Box>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerButton: {
    borderWidth: 1,
    borderColor: Colors.main.border || '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.main.cardBackground || '#FFFFFF',
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },
  selectedCategoryDisplay: {
    alignItems: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.main.textSecondary || '#999999',
  },
  dropdownIcon: {
    fontSize: 12,
    color: Colors.main.textSecondary || '#999999',
  },
  dropdownIconRTL: {
    marginRight: I18nManager.isRTL ? 0 : 8,
    marginLeft: I18nManager.isRTL ? 8 : 0,
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
    borderBottomColor: Colors.main.border || '#E0E0E0',
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
  },
  cancelButton: {
    fontSize: 16,
    color: Colors.main.primary || '#007AFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.main.textPrimary || '#000000',
  },
  placeholder: {
    width: 50,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedCategoryItem: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: Colors.main.border,
  },
  categoryColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: I18nManager.isRTL ? 0 : 12,
    marginLeft: I18nManager.isRTL ? 12 : 0,
  },
  categoryText: {
    fontSize: 16,
    color: Colors.main.textPrimary || '#000000',
  },
  selectedCategoryText: {
    color: Colors.main.primary || '#007AFF',
    fontWeight: '500',
  },
  categoryIcon: {
    fontSize: 18,
  },
});

export default CategoryPicker;
