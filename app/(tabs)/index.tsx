import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const isMountedRef = useRef(true);

  const fetchPosts = async (q?: string) => {
    setLoading(true);
    setError(null);
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
      if (isMountedRef.current) setError(err.message || 'Erro ao buscar posts');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchPosts();
    return () => {
      isMountedRef.current = false;
    };
  }, []);


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts(query);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar postagens por palavra-chave"
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={query}
          onChangeText={(t) => setQuery(t)}
          onBlur={() => fetchPosts(query)}
          onEndEditing={() => fetchPosts(query)}
          onSubmitEditing={() => fetchPosts(query)}
          returnKeyType="search"
        />
      </View>

      {/* Título */}
      <Text style={styles.sectionTitle}>Postagens</Text>

      {/* Lista de posts */}
      <ScrollView
        contentContainerStyle={styles.postsContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading && (
          <View style={{ padding: 20 }}>
            <ActivityIndicator size="small" color="#000" />
          </View>
        )}

        {error && (
          <View style={{ padding: 20 }}>
            <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
          </View>
        )}

        {!loading &&
          !error &&
          posts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.postCard}
              onPress={() => router.push(`/(tabs)/PostagemDetalhada?id=${post.id}`)}
            >
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postAuthor}>{post.author}</Text>
              <Text style={styles.postContent}>
                {post.content?.substring(0, 80) || ''}
              </Text>
            </TouchableOpacity>
          ))}

        {!loading && !error && posts.length === 0 && (
          <View style={{ padding: 20 }}>
            <Text style={{ textAlign: 'center', color: '#666' }}>Nenhuma postagem encontrada.</Text>
          </View>
        )}
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    marginVertical: 16,
    color: '#000',
  },
  postsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100, // espaço pro botão fixo
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    marginBottom: 16,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  postAuthor: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    textAlign: 'justify',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
