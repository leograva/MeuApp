import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PostagemDetalhada() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [titulo, setTitulo] = React.useState('');
  const [conteudo, setConteudo] = React.useState('');
  const [autor, setAutor] = React.useState('');
  const [data, setData] = React.useState('');

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      fetchPost();
    }, [id])
  );

  const fetchPost = async () => {
    try {
      const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
      const url = `http://${host}:3000/posts/${id}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setTitulo(json['data']['post']['title']);
      setConteudo(json['data']['post']['content']);
      setAutor(json['data']['post']['author']);
      setData(new Date().toLocaleDateString());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
          title: 'Postagem Detalhada',
        }}
      />

      {/* Conteúdo rolável */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.postContainer}>
          {/* Título */}
          <Text style={styles.title}>{titulo}</Text>

          {/* Metadados */}
          {(autor || data) && (
            <View style={styles.metaContainer}>
              {autor ? (
                <View style={styles.metaItem}>
                  <MaterialIcons name="person" size={16} color="#666" />
                  <Text style={styles.metaText}>{autor}</Text>
                </View>
              ) : null}

              {data ? (
                <View style={styles.metaItem}>
                  <MaterialIcons name="calendar-today" size={16} color="#666" />
                  <Text style={styles.metaText}>{data}</Text>
                </View>
              ) : null}
            </View>
          )}

          {/* Conteúdo */}
          <Text style={styles.content}>
            {conteudo}
          </Text>
        </View>
      </ScrollView>

      {/* Botão fixo */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Voltar</Text>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100, // espaço extra para não cobrir texto
  },
  postContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#000',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  content: {
    fontSize: 18,
    color: '#000',
    lineHeight: 20,
    textAlign: 'justify',
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
