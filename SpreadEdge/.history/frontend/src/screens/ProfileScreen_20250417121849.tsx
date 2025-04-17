import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, List, Avatar, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label="JD"
          style={styles.avatar}
          labelStyle={styles.avatarText}
        />
        <Text variant="headlineMedium" style={styles.name}>
          John Doe
        </Text>
        <Text variant="bodyLarge" style={styles.email}>
          john.doe@example.com
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Account Settings
          </Text>
          <List.Item
            title="Edit Profile"
            left={(props) => <List.Icon {...props} icon="account-edit" />}
            onPress={() => {}}
          />
          <List.Item
            title="Change Password"
            left={(props) => <List.Icon {...props} icon="lock" />}
            onPress={() => {}}
          />
          <List.Item
            title="Payment Methods"
            left={(props) => <List.Icon {...props} icon="credit-card" />}
            onPress={() => {}}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Preferences
          </Text>
          <List.Item
            title="Push Notifications"
            description="Receive trading alerts and updates"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color="#6200ee"
              />
            )}
          />
          <List.Item
            title="Dark Mode"
            description="Switch to dark theme"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                color="#6200ee"
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Support
          </Text>
          <List.Item
            title="Help Center"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            onPress={() => {}}
          />
          <List.Item
            title="Contact Support"
            left={(props) => <List.Icon {...props} icon="email" />}
            onPress={() => {}}
          />
          <List.Item
            title="Terms & Conditions"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            onPress={() => {}}
          />
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor="white"
      >
        Log Out
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  header: {
    padding: 20,
    backgroundColor: '#6200ee',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: 'white',
    marginBottom: 16,
  },
  avatarText: {
    color: '#6200ee',
    fontSize: 32,
  },
  name: {
    color: 'white',
    marginBottom: 4,
  },
  email: {
    color: 'white',
    opacity: 0.8,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  logoutButton: {
    margin: 16,
    backgroundColor: '#F44336',
  },
});

export default ProfileScreen; 