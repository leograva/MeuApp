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

export default function EditarProfessor() {
  
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [editar, setEditar] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      fetchTeacher();
      setEditar(true);
    }, [id])
  );

const fetchTeacher = async () => {
        try {
          const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
          const url = `http://${host}:3000/teachers/${id}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          setNome(json['data']['teacher']['name']);
          setEmail(json['data']['teacher']['email']);
        } catch (err) {
          console.error(err);
        }
      };

  const handleAtualizar = async () => {
    try {
      const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
      const url = `http://${host}:3000/teachers/${id}`;

      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: nome, email: email}),
      });

      if (!res.ok) throw new Error(`Erro ao atualizar o professor: ${res.status}`);
      Alert.alert('Sucesso', 'Professor atualizado com sucesso!', [
        { text: 'OK', onPress: () => router.push('/(tabs)/AdministrativoTeachers') },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    }
  };

  const handleEnviar = async () => {
    try {
      const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
      const url = `http://${host}:3000/teachers/`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name: nome, email: email}),
      });

      if (!res.ok) throw new Error(`Erro ao criar o professor: ${res.status}`);
      Alert.alert('Sucesso', 'Professor criado com sucesso!', [
        { text: 'OK', onPress: () => router.push('/(tabs)/AdministrativoTeachers') },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {editar ? (
              <Text style={styles.tituloPagina}>Edição de Professores</Text>
            ) : (
              <Text style={styles.tituloPagina}>Criação de Professores</Text>
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
             <Text style={styles.textoBotao}>Criar professor</Text>
           </TouchableOpacity>
           )}
      <TouchableOpacity style={styles.botao} onPress={() => router.push('/(tabs)/AdministrativoTeachers')}>
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
