import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext'; // Import do contexto

export default function MenuAdministrativo() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth(); // <--- adiciona o setIsLoggedIn

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace(`/(tabs)/Login`); // substitui a tela atual para evitar voltar
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return null; // enquanto redireciona, não renderiza nada
  }

  const handleLogout = () => {
    setIsLoggedIn(false); // altera estado global
    router.replace('/(tabs)/Login'); // redireciona
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Menu Administrativo</Text>

      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => router.push('/AdministrativoPosts')}
      >
        <Text style={styles.menuTitle}>Postagens</Text>
        <Text style={styles.menuText}>
          Utilize essa opção para adicionar, editar ou excluir postagens do aplicativo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => router.push('/AdministrativoStudents')}
      >
        <Text style={styles.menuTitle}>Estudantes</Text>
        <Text style={styles.menuText}>
          Utilize essa opção para adicionar, editar ou excluir estudantes do aplicativo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => router.push('/AdministrativoTeachers')}
      >
        <Text style={styles.menuTitle}>Professores</Text>
        <Text style={styles.menuText}>
          Utilize essa opção para adicionar, editar ou excluir professores do aplicativo
        </Text>
      </TouchableOpacity>

      <View style={styles.navButtons}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => router.push('/(tabs)/Index')}
        >
          <Text style={styles.navButtonText}>Voltar para Tela Inicial</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navButton, { backgroundColor: '#d32f2f' }]} 
          onPress={handleLogout}
        >
          <Text style={styles.navButtonText}>Fazer Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  menuButton: {
    backgroundColor: '#e0e0e0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  navButtons: {
    marginTop: 30,
  },
  navButton: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
