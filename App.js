import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import NoteScreen from './screens/NoteScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Register">
                <Stack.Screen name="Register" component={RegisterScreen}/>
                <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar Sesión' }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mis Notas' }} />
                <Stack.Screen name="Note" component={NoteScreen} options={{ title: 'Editar Nota' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
