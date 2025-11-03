import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { default as React, useCallback, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

export default function EditarPostagem() {
  
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [editar, setEditar] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      fetchPost();
      setEditar(true);
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
          setAutor(json['data']['post']['author']);
          setConteudo(json['data']['post']['content']);
        } catch (err) {
          console.error(err);
        }
      };


  const handleAtualizar = async () => {
    try {
      const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
      const url = `http://${host}:3000/posts/${id}`;

      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title: titulo, content: conteudo, author: autor }),
      });

      if (!res.ok) throw new Error(`Erro ao enviar o post: ${res.status}`);
      Alert.alert('Sucesso', 'Post atualizado com sucesso!', [
        { text: 'OK', onPress: () => router.push('/(tabs)/AdministrativoPosts') },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    }
  };

    const handleEnviar = async () => {
    try {
      const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
      const url = `http://${host}:3000/posts/`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({title: titulo, content: conteudo, author: autor }),
      });

      if (!res.ok) throw new Error(`Erro ao enviar o post: ${res.status}`);
      Alert.alert('Sucesso', 'Post criado com sucesso!', [
        { text: 'OK', onPress: () => router.push('/(tabs)/AdministrativoPosts') },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {editar ? (
              <Text style={styles.tituloPagina}>Edição de Postagens</Text>
            ) : (
              <Text style={styles.tituloPagina}>Criação de Postagens</Text>
            )}

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite aqui o título"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Autor</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite aqui o autor"
        value={autor}
        onChangeText={setAutor}
      />

      <Text style={styles.label}>Conteúdo</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Digite aqui o conteúdo"
        value={conteudo}
        onChangeText={setConteudo}
        multiline
        numberOfLines={6}
      />

             {editar ? (
              <TouchableOpacity style={styles.botao} onPress={handleAtualizar}>
              <Text style={styles.textoBotao}>Salvar alterações</Text>
            </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.botao} onPress={handleEnviar}>
              <Text style={styles.textoBotao}>Criar postagem</Text>
            </TouchableOpacity>
            )}
      
      <TouchableOpacity style={styles.botao} onPress={() => router.back()}>
        <Text style={styles.textoBotao}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ...styles iguais ao seu código original

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  tituloPagina: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    height: 150,
    textAlignVertical: "top",
  },
  botao: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
