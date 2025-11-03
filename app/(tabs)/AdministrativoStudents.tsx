import { useRouter } from 'expo-router';
import { default as React, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
export default function AdministrativoStudents() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const isMountedRef = useRef(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchStudents = async () => {
      try {
        const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
        const url = `http://${host}:3000/students`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        let studentsData: any[] = [];
        if (json?.data?.students) studentsData = json.data.students;
        else if (json?.students) studentsData = json.students;
        else if (Array.isArray(json)) studentsData = json;

        if (isMountedRef.current) setStudents(studentsData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudents();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleDelete = async () => {
    if (!selectedStudentId) return;
    try {
      const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
      const url = `http://${host}:3000/students/${selectedStudentId}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStudents((prev) => prev.filter((p) => p.id !== selectedStudentId));
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
      setSelectedStudentId(null);
    }
  };

  const handleIr = (item: any) => {
    // Passando o id via query string
    router.push(`/(tabs)/CriarEditarEstudante?id=${item.id}`);
  };

  return (

    

    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar estudantes"
        placeholderTextColor="#999"
      />

      <Text style={styles.headerText}>Estudantes - Administrativo</Text>

       <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => (router.push('/(tabs)/CriarEditarEstudante'))}
                    >
                      <Text style={styles.buttonText}>Criar estudante</Text>
                    </TouchableOpacity>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardContent}>{item.email}</Text>

            <View style={styles.cardButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleIr(item)}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  setSelectedStudentId(item.id);
                  setShowModal(true);
                }}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
            
          </View>
          
        )}
      />

      <TouchableOpacity
            style={[styles.returnButton, { marginBottom: 16 }]} // Adjust marginBottom to align
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
            <Text>
              Tem certeza que deseja excluir este estudante?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={[styles.editButton, { flex: 1, marginRight: 10 }]}
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
    </View>
  );
}

// ...styles iguais ao seu código original

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#F2F2F2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardContent: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
   returnButton: {
    backgroundColor: '#000000ff',
    marginTop: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#000000ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#000000ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
  },
});
