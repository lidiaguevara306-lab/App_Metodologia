import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import * as SQLite from "expo-sqlite";
import * as LocalAuthentication from "expo-local-authentication";

const db = SQLite.openDatabase("asistencia.db");

export default function RegisterScreen() {
  const [matricula, setMatricula] = useState("");
  const [nombre, setNombre] = useState("");
  const [huellaValidada, setHuellaValidada] = useState(false);

  // Crear tabla
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS alumnos (matricula TEXT PRIMARY KEY NOT NULL, nombre TEXT);"
      );
    });
  }, []);

  // 🔐 BOTÓN HUELLA
  const validarHuella = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();

      if (!compatible) {
        Alert.alert("Error", "No hay biometría");
        return;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!enrolled) {
        Alert.alert("Error", "No hay huellas registradas");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Escanea tu huella",
      });

      if (result.success) {
        setHuellaValidada(true);
        Alert.alert("Huella validada");
      } else {
        setHuellaValidada(false);
        Alert.alert("Falló la huella");
      }
    } catch (error) {
      Alert.alert("Error en biometría");
    }
  };

  // 📝 BOTÓN REGISTRAR
  const registrarAlumno = () => {
    if (matricula.trim() === "" || nombre.trim() === "") {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    if (!huellaValidada) {
      Alert.alert("Error", "Primero valida la huella");
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO alumnos (matricula, nombre) values (?, ?);",
        [matricula, nombre],
        () => {
          Alert.alert("Éxito", "Alumno registrado correctamente");

          // Reset
          setMatricula("");
          setNombre("");
          setHuellaValidada(false);
        },
        (_, error) => {
          Alert.alert("Error", "La matrícula ya existe o falló el registro");
          return true;
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Asistencia</Text>

      <TextInput
        style={styles.input}
        placeholder="Matrícula"
        placeholderTextColor="#fff"
        value={matricula}
        onChangeText={setMatricula}
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#fff"
        value={nombre}
        onChangeText={setNombre}
      />

      {/* BOTÓN HUELLA */}
      <TouchableOpacity style={styles.fingerprintButton} onPress={validarHuella}>
        <Text style={styles.buttonText}>Validar Huella</Text>
      </TouchableOpacity>

      {/* BOTÓN REGISTRO */}
      <TouchableOpacity style={styles.registerButton} onPress={registrarAlumno}>
        <Text style={styles.buttonText}>Registrar Alumno</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🎨 ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#557ca6",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
  },
  fingerprintButton: {
    backgroundColor: "#f39c12",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});