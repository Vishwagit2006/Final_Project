import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Modal, TouchableOpacity, Alert, Text } from 'react-native';
import { useTheme, Button, Card, TextInput, Chip, Divider, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NgoBottomNav from '../../../components/NgoBottomNav';

const NeedsList = () => {
  const { colors } = useTheme();
  const [needs, setNeeds] = useState([
    {
      id: '1',
      title: 'Emergency Food Supplies',
      description: 'Immediate need for 500 family food kits in flood-affected areas',
      priority: 'Urgent',
      status: 'Pending',
      deadline: '2023-12-15',
      quantity: 500,
      category: 'Food',
      location: 'Assam Flood Zone 3',
      contact: 'John Doe, +91-9876543210'
    },
    {
      id: '2',
      title: 'Chairs',
      description: 'We need the 10 chairs to our charity.',
      priority: 'High',
      status: 'Pending',
      deadline: '2023-10-20',
      quantity: 10,
      category: 'Chair',
      location: 'Chennai T-nagar',
      contact: 'John Doe, +91-9897537688'
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [newNeed, setNewNeed] = useState({
    description: '',
    priority: 'Urgent',
    status: 'Pending',
    deadline: '',
    quantity: '',
    category: 'Food',
    location: '',
    contact: ''
  });

  const priorityOptions = ['Urgent', 'High', 'Medium', 'Low'];

  const validateForm = () => {
    if (!newNeed.description.trim() || !newNeed.quantity || !newNeed.location.trim() || !newNeed.contact.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return false;
    }
    if (newNeed.priority === 'Urgent' && !newNeed.deadline) {
      Alert.alert('Error', 'Urgent needs require a deadline');
      return false;
    }
    return true;
  };

  const handleAddNeed = () => {
    if (!validateForm()) return;

    const newEntry = {
      ...newNeed,
      id: Math.random().toString(),
      quantity: parseInt(newNeed.quantity),
      createdAt: new Date().toISOString(),
    };

    setNeeds([...needs, newEntry]);
    resetForm();
    setIsModalVisible(false);
    Alert.alert('Success', 'Need successfully registered!');
  };

  const handleUpdateNeed = (item) => {
    setEditMode(true);
    setSelectedId(item.id);
    setNewNeed({ ...item });
    setIsModalVisible(true);
  };

  const handleSaveUpdate = () => {
    if (!validateForm()) return;

    const updatedNeeds = needs.map(n =>
      n.id === selectedId ? { ...newNeed, id: selectedId, quantity: parseInt(newNeed.quantity) } : n
    );
    setNeeds(updatedNeeds);
    resetForm();
    setEditMode(false);
    setSelectedId(null);
    setIsModalVisible(false);
    Alert.alert('Updated!', 'Need updated successfully.');
  };

  const handleDeleteNeed = (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this need?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setNeeds(needs.filter(n => n.id !== id));
          Alert.alert('Deleted', 'Need deleted successfully');
        }
      }
    ]);
  };

  const resetForm = () => {
    setNewNeed({
      description: '',
      priority: 'Urgent',
      status: 'Pending',
      deadline: '',
      quantity: '',
      category: 'Food',
      location: '',
      contact: ''
    });
  };

  const getPriorityBadge = (priority) => (
    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(priority) }]} >
      <MaterialCommunityIcons name={getPriorityIcon(priority)} size={16} color="white" />
      <Text style={styles.priorityText}>{priority}</Text>
    </View>
  );

  // Utility: Define priorityOrder for sorting
  const priorityOrder = { Urgent: 1, High: 2, Medium: 3, Low: 4 };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
        <Text style={styles.header}>Request Needs</Text>
        <TouchableOpacity onPress={() => { setIsModalVisible(true); setEditMode(false); resetForm(); }} style={styles.addTopButton}>
          <MaterialCommunityIcons name="plus-circle-outline" size={28} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={needs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])}
        renderItem={({ item }) => (
          <Card style={styles.needCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                {getPriorityBadge(item.priority)}
                <Text style={styles.deadline}>
                  {item.deadline && `Deadline: ${item.deadline}`}
                </Text>
              </View>

              <Text style={styles.needTitle}>{item.description}</Text>

              <View style={styles.metaContainer}>
                <Chip icon="numeric" style={styles.metaChip}>{`Qty: ${item.quantity}`}</Chip>
                <Chip icon="tag" style={styles.metaChip}>{item.category}</Chip>
              </View>

              <Text style={{ fontWeight: '600', marginTop: 4 }}>Location:</Text>
              <Text style={{ marginBottom: 4 }}>{item.location}</Text>
              <Text style={{ fontWeight: '600' }}>Contact:</Text>
              <Text>{item.contact}</Text>

              <Divider style={styles.divider} />

              <View style={styles.statusContainer}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button onPress={() => handleUpdateNeed(item)}>Update</Button>
                  <Button onPress={() => handleDeleteNeed(item.id)} textColor="red">Delete</Button>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => { setIsModalVisible(true); setEditMode(false); resetForm(); }}
      />

      {/* Modal */}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{editMode ? 'Update Need' : 'Register Need'}</Text>

          <TextInput label="Detailed Description *" value={newNeed.description}
            onChangeText={text => setNewNeed({ ...newNeed, description: text })}
            style={styles.input} mode="outlined" multiline numberOfLines={4}
          />

          <Text style={{ marginBottom: 8, fontWeight: '600' }}>Priority *</Text>
          <View style={styles.prioritySelector}>
            {priorityOptions.map(option => (
              <Chip
                key={option}
                selected={newNeed.priority === option}
                onPress={() => setNewNeed({ ...newNeed, priority: option })}
                style={[styles.priorityChip, {
                  backgroundColor: newNeed.priority === option ? getPriorityColor(option) : '#f0f0f0'
                }]}>
                {option}
              </Chip>
            ))}
          </View>

          <TextInput
            label="Quantity Needed"
            value={newNeed.quantity?.toString()}
            onChangeText={text => setNewNeed({ ...newNeed, quantity: text })}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Deadline (YYYY-MM-DD)"
            value={newNeed.deadline}
            onChangeText={text => setNewNeed({ ...newNeed, deadline: text })}
            style={styles.input}
            mode="outlined"
          />

          <TextInput label="Location" value={newNeed.location}
            onChangeText={text => setNewNeed({ ...newNeed, location: text })}
            style={styles.input} mode="outlined"
          />

          <TextInput
            label="Contact Person (Phone or Email)"
            value={newNeed.contact}
            onChangeText={text => setNewNeed({ ...newNeed, contact: text })}
            style={styles.input}
            mode="outlined"
          />

          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              onPress={editMode ? handleSaveUpdate : handleAddNeed}
              style={styles.submitButton}
              labelStyle={styles.buttonLabel}
            >
              {editMode ? 'Update Need' : 'Submit Need'}
            </Button>
            <Button mode="outlined" onPress={() => setIsModalVisible(false)} style={styles.cancelButton} labelStyle={styles.buttonLabel}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNavContainer}>
        <NgoBottomNav />
      </View>
    </View>
  );
};

// Utility functions
const getPriorityColor = (priority) => ({
  Urgent: '#ff4444',
  High: '#ffbb33',
  Medium: '#00C851',
  Low: '#33b5e5'
}[priority]);

const getPriorityIcon = (priority) => ({
  Urgent: 'alert-octagon',
  High: 'alert',
  Medium: 'alert-circle',
  Low: 'information'
}[priority]);

const getStatusColor = (status) => ({
  Pending: '#ff4444',
  'In Progress': '#ffbb33',
  Resolved: '#00C851'
}[status]);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  header: { flex: 2, textAlign: 'center', fontSize: 22, fontWeight: '700' },
  addTopButton: { flex: 1, alignItems: 'flex-end' },
  needCard: { marginBottom: 12, borderRadius: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  priorityBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 16 },
  priorityText: { color: 'white', marginLeft: 4, fontWeight: '600' },
  deadline: { fontSize: 12, color: '#666' },
  metaContainer: { flexDirection: 'row', gap: 8, marginVertical: 8 },
  metaChip: { backgroundColor: '#e0e0e0' },
  divider: { marginVertical: 8 },
  statusContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusText: { fontWeight: '600' },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#2E7D32' },
  modalContainer: { flex: 1, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 24 },
  input: { marginBottom: 16 },
  buttonRow: { flexDirection: 'row', gap: 16, marginTop: 24 },
  submitButton: { flex: 1, backgroundColor: '#2E7D32' },
  cancelButton: { flex: 1 },
  buttonLabel: { fontWeight: '600' },
  prioritySelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  priorityChip: { marginVertical: 4 },
  bottomNavContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#eee' },
});

export default NeedsList;
