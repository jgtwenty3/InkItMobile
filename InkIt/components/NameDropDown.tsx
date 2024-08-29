import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';

interface DropdownItem {
  id: string;
  name: string;
}

interface CustomDropdownProps {
  items: DropdownItem[];
  selectedItemId: string | null;
  onSelect: (itemId: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ items, selectedItemId, onSelect }) => {
  const [visible, setVisible] = useState(false);
  const selectedItem = items.find(item => item.id === selectedItemId);

  return (
    <View>
      <TouchableOpacity style={styles.dropdown} onPress={() => setVisible(!visible)}>
        <Text style={styles.dropdownText}>{selectedItem ? selectedItem.name : 'Select a client'}</Text>
      </TouchableOpacity>
      {visible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                      onSelect(item.id);
                      setVisible(false);
                    }}
                  >
                    <Text style={styles.itemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  dropdownText: {
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: 300,
  },
  item: {
    padding: 10,
  },
  itemText: {
    fontSize: 16,
  },
});

export default CustomDropdown;
