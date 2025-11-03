import { MaterialIcons } from '@expo/vector-icons';
import { Slot, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthProvider } from '../context/AuthContext';

export default function TabsLayout() {
  const router = useRouter();

  return (
    <AuthProvider>
    <View style={{ flex: 1 }}>
      <Slot />

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => router.push(`/(tabs)/Index`)}>
          <MaterialIcons name="person" size={16} color="#666" />
          <Text>Lista de Postagens</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => router.push(`/(tabs)/MenuAdministrativo`)}>
          <MaterialIcons name="admin-panel-settings" size={16} color="#666" />
          <Text>Menu Administrativo</Text>
        </TouchableOpacity>
      </View>
    </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
