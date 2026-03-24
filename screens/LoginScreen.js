import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function LoginScreen({ navigation, route }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Obtenemos las credenciales registradas desde la pantalla de registro
    const registeredUser = route.params?.registeredUser || '';
    const registeredPassword = route.params?.registeredPassword || '';

    // Función para manejar inicio de sesión manual
    const handleLogin = () => {
        if (username === registeredUser && password === registeredPassword) {
            navigation.replace('Home');
        } else {
            Alert.alert('Error', 'Credenciales incorrectas. Intenta de nuevo.');
        }
    };

    // Función para manejar inicio de sesión con huella digital
    const handleBiometricLogin = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
            Alert.alert('Error', 'Tu dispositivo no soporta autenticación biométrica.');
            return;
        }

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) {
            Alert.alert('Error', 'No hay métodos biométricos registrados.');
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Autentícate con tu huella digital',
            cancelLabel: 'Cancelar',
        });

        if (result.success) {
            Alert.alert('Éxito', 'Autenticación exitosa.');
            navigation.replace('Home');
        } else {
            Alert.alert('Error', 'Autenticación fallida.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}> ｡‧˚ʚ Iniciar Sesión ɞ˚‧｡</Text>
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
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>-` Entrar ´-</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.biometricsButton} onPress={handleBiometricLogin}>
                <Text style={styles.buttonText}>꩜ Iniciar con Huella ꩜</Text>
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
        backgroundColor: '#7aaee6', // Fondo azul claro
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff', // Texto blanco
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#fff', // Bordes blancos
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Fondo semitransparente para inputs
        color: '#fff', // Texto blanco
    },
    button: {
        backgroundColor: '#ffffff', // Fondo blanco
        padding: 12,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    biometricsButton: {
        backgroundColor: '#daf5db', // Verde para botón de huella
        padding: 12,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#7aaee6', // Texto azul claro en los botones
        fontSize: 18,
        fontWeight: 'bold',
    },
});
