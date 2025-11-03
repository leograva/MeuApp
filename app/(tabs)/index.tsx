import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
      const url = q ? `http://${host}:3000/posts/search?q=${encodeURIComponent(q)}` : `http://${host}:3000/posts`;
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

  const handleSearch = async (q?: string) => {
    const searchQ = typeof q === 'string' ? q : query;
    try {
      setLoading(true);
      setError(null);
      const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
      const url = searchQ ? `http://${host}:3000/posts/search?q=${encodeURIComponent(searchQ)}` : `http://${host}:3000/posts`;
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts(query);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar postagens"
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={query}
          onChangeText={(t) => setQuery(t)}
          onEndEditing={() => handleSearch()}
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
        />
      </View>
      <Text style={styles.sectionTitle}>Postagens</Text>
      <ScrollView
        contentContainerStyle={styles.postsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && (
          <View style={{ padding: 20 }}>
            <ActivityIndicator size="small" color="#000" />
          </View>
        )}

        {error && (
          <View style={{ padding: 20 }}>
            <Text style={{ color: 'red' }}>{error}</Text>
          </View>
        )}

        {!loading && !error && posts.map((post) => (
          <TouchableOpacity
            key={post.id}
            style={styles.postCard}
            onPress={() => router.push(`/(tabs)/PostagemDetalhada?id=${post.id}`)}
          >
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postAuthor}>{post.author}</Text>
            <Text style={styles.postContent}>{post.content.substring(0, 50)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container2: {
    flexDirection: 'row',
    backgroundColor: '#ffffffff',
    paddingVertical: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    color: '#000000ff',
  },
  postsContainer: {
    padding: 16,
  },
  postCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  postContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#000000ff',
    borderRadius: 8,
    margin: 8,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});
