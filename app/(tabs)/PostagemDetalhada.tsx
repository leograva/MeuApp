import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ Import correto

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
                    headerStyle: { backgroundColor: '#f8f9fa' },
                    headerTintColor: '#212529',
                    title: 'Detalhes da Postagem',
                }}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{titulo}</Text>
                        <View style={styles.metaInfo}>
                            <View style={styles.authorContainer}>
                                <MaterialIcons name="person" size={16} color="#666" />
                                <Text style={styles.author}>{autor}</Text>
                            </View>
                            <View style={styles.dateContainer}>
                                <MaterialIcons name="calendar-today" size={16} color="#666" />
                                <Text style={styles.date}>{data}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.contentContainer}>
                        <Text style={styles.content}>{conteudo}</Text>
                    </View>
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    titleContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212529',
        marginBottom: 8,
    },
    metaInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    author: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    date: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    contentContainer: {
        padding: 16,
    },
    content: {
        fontSize: 16,
        color: '#495057',
        lineHeight: 24,
        textAlign: 'justify',
    },
    button: {
        backgroundColor: '#000000ff',
        margin: 16,
        padding: 14,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    },
});
