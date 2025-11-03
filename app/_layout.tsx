import { MaterialIcons } from '@expo/vector-icons';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthProvider } from '../context/AuthContext';

export default function TabsLayout() {
  const router = useRouter();
  const segments = useSegments() as string[];

const isActive = (path: string) => segments.includes(path);

  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        <Slot />

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => router.push(`/(tabs)/Index`)}
          >
            <MaterialIcons
              name="list-alt"
              size={24}
              color={isActive('Index') ? '#000000ff' : '#666'}
            />
            <Text style={[styles.tabText, isActive('Index') && styles.activeTabText]}>
              Lista de Postagens
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => router.push(`/(tabs)/MenuAdministrativo`)}
          >
            <MaterialIcons
              name="manage-accounts"
              size={24}
              color={isActive('MenuAdministrativo') ? '#000000ff' : '#666'}
            />
            <Text style={[styles.tabText, isActive('MenuAdministrativo') && styles.activeTabText]}>
              Menu Administrativo
            </Text>
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
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeTabText: {
    color: '#000000ff',
    fontWeight: '600',
  },
});
