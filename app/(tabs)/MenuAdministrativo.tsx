import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

export default function MenuAdministrativo() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/(tabs)/Login');
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.replace('/(tabs)/Login');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerText}>Menu Administrativo</Text>

        {/* Botão - Postagens */}
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => router.push('/AdministrativoPosts')}
        >
          <Text style={styles.menuTitle}>Postagens</Text>
          <Text style={styles.menuDescription}>
            Utilize esta opção para adicionar, editar ou excluir postagens do aplicativo.
          </Text>
        </TouchableOpacity>

        {/* Botão - Estudantes */}
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => router.push('/AdministrativoStudents')}
        >
          <Text style={styles.menuTitle}>Estudantes</Text>
          <Text style={styles.menuDescription}>
            Utilize esta opção para adicionar, editar ou excluir estudantes do aplicativo.
          </Text>
        </TouchableOpacity>

        {/* Botão - Professores */}
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => router.push('/AdministrativoTeachers')}
        >
          <Text style={styles.menuTitle}>Professores</Text>
          <Text style={styles.menuDescription}>
            Utilize esta opção para adicionar, editar ou excluir professores do aplicativo.
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Botões inferiores */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => router.push('/(tabs)/Index')}
        >
          <Text style={styles.footerButtonText}>Voltar para lista de postagens</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: '#d32f2f' }]}
          onPress={handleLogout}
        >
          <Text style={styles.footerButtonText}>Fazer Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 120, // espaço para os botões fixos
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 24,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
    textAlign: 'center',
  },
  menuDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  footerButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
