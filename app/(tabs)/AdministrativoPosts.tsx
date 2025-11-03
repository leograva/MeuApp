import { useRouter } from 'expo-router';
import { default as React, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
export default function AdministrativoPosts() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const isMountedRef = useRef(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchPosts = async () => {
      try {
        const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
        const url = `http://${host}:3000/posts`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        let postsData: any[] = [];
        if (json?.data?.posts) postsData = json.data.posts;
        else if (json?.posts) postsData = json.posts;
        else if (Array.isArray(json)) postsData = json;

        if (isMountedRef.current) setPosts(postsData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleDelete = async () => {
    if (!selectedPostId) return;
    try {
      const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
      const url = `http://${host}:3000/posts/${selectedPostId}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setPosts((prev) => prev.filter((p) => p.id !== selectedPostId));
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
      setSelectedPostId(null);
      Alert.alert('Postagem excluída com sucesso!');
    }
  };

  const handleIr = (item: any) => {
    // Passando o id via query string
    router.push(`/(tabs)/CriarEditarPostagem?id=${item.id}`);
  };

  return (

    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar postagens"
        placeholderTextColor="#999"
      />

      <Text style={styles.headerText}>Postagens - Administrativo</Text>

      <TouchableOpacity
                style={styles.editButton}
                onPress={() => (router.push('/(tabs)/CriarEditarPostagem') )}
              >
                <Text style={styles.buttonText}>Criar postagem</Text>
              </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardContent}>{item.content}</Text>

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
                  setSelectedPostId(item.id);
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
                style={styles.returnButton}
                onPress={() => router.back()}
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
              Tem certeza que deseja excluir esta postagem?
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
    backgroundColor: '#000007ff',
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
    backgroundColor: '#6C0000',
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
