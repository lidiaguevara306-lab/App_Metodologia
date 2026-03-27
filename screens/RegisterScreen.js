import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";

import * as SQLite from "expo-sqlite";
import * as LocalAuthentication from "expo-local-authentication";

const db = SQLite.openDatabaseSync("asistencia.db");

export default function RegisterScreen() {
  const [matricula, setMatricula] = useState("");
  const [nombre, setNombre] = useState("");
  const [huellaValidada, setHuellaValidada] = useState(false);
  const [alumnos, setAlumnos] = useState([]);

  // Crear tabla y cargar datos
  useEffect(() => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS alumnos (
        matricula TEXT PRIMARY KEY NOT NULL,
        nombre TEXT
      );
    `);

    cargarAlumnos();
  }, []);

  // 🔄 Cargar registros
  const cargarAlumnos = () => {
    try {
      const result = db.getAllSync("SELECT * FROM alumnos;");
      setAlumnos(result);
    } catch (error) {
      console.log("Error al cargar alumnos", error);
    }
  };

  // 🔐 Validar huella
  const validarHuella = async () => {
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
  };

  // 📝 Registrar alumno
  const registrarAlumno = () => {
    if (matricula.trim() === "" || nombre.trim() === "") {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    if (!huellaValidada) {
      Alert.alert("Error", "Primero valida la huella");
      return;
    }

    try {
      db.runSync(
        "INSERT INTO alumnos (matricula, nombre) VALUES (?, ?);",
        [matricula, nombre]
      );

      Alert.alert("Éxito", "Alumno registrado");

      setMatricula("");
      setNombre("");
      setHuellaValidada(false);

      cargarAlumnos(); // 🔥 actualizar lista

    } catch (error) {
      Alert.alert("Error", "La matrícula ya existe");
    }
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

      <TouchableOpacity style={styles.fingerprintButton} onPress={validarHuella}>
        <Text style={styles.buttonText}>Validar Huella</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={registrarAlumno}>
        <Text style={styles.buttonText}>Registrar Alumno</Text>
      </TouchableOpacity>

      {/* 📋 LISTA DE REGISTROS */}
      <Text style={styles.subtitle}>Alumnos registrados:</Text>

      <FlatList
        data={alumnos}
        keyExtractor={(item) => item.matricula}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.matricula} - {item.nombre}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

// 🎨 ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#557ca6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 20,
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    color: "#fff",
  },
  fingerprintButton: {
    backgroundColor: "#f39c12",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  item: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  itemText: {
    color: "#fff",
  },
});