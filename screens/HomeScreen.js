import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        const loadNotes = async () => {
            const savedNotes = await AsyncStorage.getItem('notes');
            if (savedNotes) {
                setNotes(JSON.parse(savedNotes));
            }
        };
        loadNotes();
    }, []);

    useEffect(() => {
        const saveNotes = async () => {
            await AsyncStorage.setItem('notes', JSON.stringify(notes));
        };
        saveNotes();
    }, [notes]);

    const addNote = () => {
        if (newNote.trim() === '') {
            Alert.alert('Error', 'El contenido de la nota no puede estar vacío.');
            return;
        }
        setNotes([...notes, { id: Date.now().toString(), text: newNote }]);
        setNewNote('');
    };

    const editNote = (id, newText) => {
        setNotes(notes.map((note) => (note.id === id ? { ...note, text: newText } : note)));
    };

    const confirmDelete = (id) => {
        Alert.alert(
            "¿Eliminar esta nota?", // Título del cuadro de confirmación
            "Esta acción no se puede deshacer. ¿Estás seguro?", // Descripción del cuadro
            [
                {
                    text: "Cancelar", // Botón para cancelar
                    style: "cancel", // Estilo de cancelación
                },
                {
                    text: "Eliminar", // Botón para confirmar eliminación
                    onPress: () => setNotes(notes.filter((note) => note.id !== id)),
                    style: "destructive", // Estilo destructivo
                },
            ]
        );
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('password');
        navigation.replace('Register');
    };

    const renderItem = ({ item }) => (
        <View style={styles.noteContainer}>
            <Text style={styles.noteText}>{item.text}</Text>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                        navigation.navigate('Note', {
                            note: item,
                            onSave: (newText) => editNote(item.id, newText),
                        })
                    }
                >
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => confirmDelete(item.id)} // Se llama a confirmDelete aquí
                >
                    <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>☆ Mis Notas ☆</Text>
            <FlatList
                data={notes}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No hay notas aún. ˙ᵕ˙</Text>
                }
            />
            <TextInput
                style={styles.input}
                placeholder="Escribe una nueva nota..."
                placeholderTextColor="#ffffff"
                value={newNote}
                onChangeText={setNewNote}
            />
            <TouchableOpacity style={styles.addButton} onPress={addNote}>
                <Text style={styles.addButtonText}>Añadir Nota</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#a5c4e6',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    noteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 10,
        borderRadius: 8,
    },
    noteText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    editButton: {
        backgroundColor: '#f7de92',
        padding: 8,
        borderRadius: 5,
        marginLeft: 5,
    },
    deleteButton: {
        backgroundColor: '#d9534f',
        padding: 8,
        borderRadius: 5,
        marginLeft: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        color: '#fff',
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        marginTop: 20,
        fontStyle: 'italic',
    },
});
