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

export default function EditarEstudante() {
  
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [editar, setEditar] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      fetchStudent();
      setEditar(true);
    }, [id])
  );

const fetchStudent = async () => {
        try {
          const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
          const url = `http://${host}:3000/students/${id}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          setNome(json['data']['student']['name']);
          setEmail(json['data']['student']['email']);
        } catch (err) {
          console.error(err);
        }
      };

  const handleAtualizar = async () => {
    try {
      const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
      const url = `http://${host}:3000/students/${id}`;

      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: nome, email: email}),
      });

      if (!res.ok) throw new Error(`Erro ao atualizar o estudante: ${res.status}`);
      Alert.alert('Sucesso', 'Estudante atualizado com sucesso!', [
        { text: 'OK', onPress: () => router.push('/(tabs)/AdministrativoStudents') },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    }
  };

    const handleEnviar = async () => {
    try {
      const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
      const url = `http://${host}:3000/students`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name: nome, email: email}),
      });

      if (!res.ok) throw new Error(`Erro ao atualizar o estudante: ${res.status}`);
      Alert.alert('Sucesso', 'Estudante cadastrado com sucesso!', [
        { text: 'OK', onPress: () => router.push('/(tabs)/AdministrativoStudents') },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {editar ? (
        <Text style={styles.tituloPagina}>Edição de Estudante</Text>
      ) : (
        <Text style={styles.tituloPagina}>Criação de Estudante</Text>
      )}

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite aqui o nome"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite aqui o e-mail"
        value={email}
        onChangeText={setEmail}
      />
      
       {editar ? (
        <TouchableOpacity style={styles.botao} onPress={handleAtualizar}>
        <Text style={styles.textoBotao}>Salvar alterações</Text>
      </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.botao} onPress={handleEnviar}>
        <Text style={styles.textoBotao}>Criar estudante</Text>
      </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.botao]} onPress={() => router.push('/(tabs)/AdministrativoStudents')}>
        <Text style={styles.textoBotao}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ...styles iguais ao seu código original

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9f9f9", // fundo mais suave
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  tituloPagina: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // para Android
  },
  textArea: {
    height: 150,
    textAlignVertical: "top",
  },
  botao: {
    backgroundColor: "#000000ff", // azul moderno
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#000000ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3, // sombra no Android
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
