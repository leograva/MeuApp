import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdministrativoTeachers() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<any[]>([]);
  const isMountedRef = useRef(true);
  const [query, setQuery] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);


   const searchTeachers = async (q?: string) => {
          try {
            const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
            const url = q
              ? `http://${host}:3000/teachers/search?q=${encodeURIComponent(q)}`
              : `http://${host}:3000/teachers`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            if (isMountedRef.current) setTeachers(json?.data?.teachers || json?.teachers || []);
          } catch (err: any) {
            console.error(err);
          }
        };

  useEffect(() => {
    isMountedRef.current = true;

    const fetchTeachers = async () => {
      try {
        const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
        const url = `http://${host}:3000/teachers`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        let teachersData: any[] = [];
        if (json?.data?.teachers) teachersData = json.data.teachers;
        else if (json?.teachers) teachersData = json.teachers;
        else if (Array.isArray(json)) teachersData = json;

        if (isMountedRef.current) setTeachers(teachersData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTeachers();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleDelete = async () => {
    if (!selectedTeacherId) return;
    try {
      const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
      const url = `http://${host}:3000/teachers/${selectedTeacherId}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setTeachers((prev) => prev.filter((p) => p.id !== selectedTeacherId));
      Alert.alert('Professor excluído com sucesso!');
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
      setSelectedTeacherId(null);
    }
  };

  const handleIr = (item: any) => {
    router.push(`/(tabs)/CriarEditarProfessor?id=${item.id}`);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Text style={styles.headerText}>Professores - Administrativo</Text>

      {/* Barra de busca */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar professores por palavra-chave"
        placeholderTextColor="#aaa"
        onChangeText={(t) => setQuery(t)}
          onBlur={() => searchTeachers(query)}
          onEndEditing={() => searchTeachers(query)}
          onSubmitEditing={() => searchTeachers(query)}
      />

      {/* Criar professor */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/(tabs)/CriarEditarProfessor')}
      >
        <Text style={styles.createButtonText}>Criar Professor</Text>
      </TouchableOpacity>

      {/* Lista de professores */}
      <FlatList
        data={teachers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardContent}>{item.email}</Text>

            <View style={styles.cardButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => handleIr(item)}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  setSelectedTeacherId(item.id);
                  setShowModal(true);
                }}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Botão de voltar */}
      <TouchableOpacity
        style={styles.returnButton}
        onPress={() => router.push('/(tabs)/MenuAdministrativo')}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>

      {/* Modal de confirmação */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Tem certeza que deseja excluir este professor?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.primaryButton, { flex: 1, marginRight: 8 }]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteButton, { flex: 1 }]}
                onPress={handleDelete}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardContent: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 12,
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  returnButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 10,
    width: '85%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
