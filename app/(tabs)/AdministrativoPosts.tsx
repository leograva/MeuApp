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

export default function AdministrativoPosts() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const isMountedRef = useRef(true);
  const [query, setQuery] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

   const searchPosts = async (q?: string) => {
      try {
        const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
        const url = q
          ? `http://${host}:3000/posts/search?q=${encodeURIComponent(q)}`
          : `http://${host}:3000/posts`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (isMountedRef.current) setPosts(json?.data?.posts || json?.posts || []);
      } catch (err: any) {
        console.error(err);
      }
    };
  

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
      Alert.alert('Postagem excluída com sucesso!');
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
      setSelectedPostId(null);
    }
  };

  const handleIr = (item: any) => {
    router.push(`/(tabs)/CriarEditarPostagem?id=${item.id}`);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Text style={styles.headerText}>Postagens - Administrativo</Text>

      {/* Barra de busca */}
      <TextInput
        placeholder="Buscar postagens por palavra-chave"
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={query}
          onChangeText={(t) => setQuery(t)}
          onBlur={() => searchPosts(query)}
          onEndEditing={() => searchPosts(query)}
          onSubmitEditing={() => searchPosts(query)}
          returnKeyType="search"
      />

      {/* Botão de criar nova postagem */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/(tabs)/CriarEditarPostagem')}
      >
        <Text style={styles.createButtonText}>Criar Postagem</Text>
      </TouchableOpacity>

      {/* Lista de postagens */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardContent}>
              {item.content?.substring(0, 100) || 'Sem conteúdo'}
            </Text>

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

      {/* Botão de voltar */}
      <TouchableOpacity style={styles.returnButton} onPress={() => router.back()}>
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
              Tem certeza que deseja excluir esta postagem?
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
    lineHeight: 20,
    textAlign: 'justify',
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
