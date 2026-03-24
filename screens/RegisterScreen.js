import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const checkExistingUser = async () => {
            const storedUsername = await AsyncStorage.getItem('username');
            if (storedUsername) {
                setUsername(storedUsername); // Opcional: cargar nombre de usuario existente
            }
        };
        checkExistingUser();
    }, []);

    const handleRegister = async () => {
        if (username.trim() === '' || password.trim() === '') {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('password', password);
        Alert.alert('¡Registro exitoso!', 'Ahora puedes iniciar sesión.');
    };

    const navigateToLogin = () => {
        navigation.navigate('Login'); // Ir a la pantalla de inicio de sesión
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>✿ Registro ✿</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                placeholderTextColor="#fff"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#fff"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Registrarse</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={navigateToLogin}>
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#557ca6',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#fff',
    },
    registerButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginButton: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
