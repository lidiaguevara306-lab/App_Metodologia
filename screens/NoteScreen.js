import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function NoteScreen({ route, navigation }) {
    const { note, onSave } = route.params; // Recibimos la nota y la función para guardar cambios
    const [text, setText] = useState(note.text); // Estado local para editar el texto

    const handleSave = () => {
        if (text.trim() === '') {
            alert('El contenido no puede estar vacío.');
            return;
        }
        onSave(text); // Llamamos a la función pasada desde HomeScreen
        navigation.goBack(); // Volvemos a la pantalla anterior
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Editar Nota</Text>
            <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                multiline
                placeholder="Escribe tu nota aquí"
                placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Guardar</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#fff',
        padding: 10,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: '#333',
        fontSize: 16,
        flex: 1,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
