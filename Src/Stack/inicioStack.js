
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Pantalla de menú principal
import InicioMenu from "../../Screen/Inicio/inicio"; 

// Importa los stacks de cada módulo
import PacientesStack from "./pacientesStack";
import MedicosStack from "./medicosStack";
import ConsultoriosStack from "./consultoriosStack";
import EspecialidadesStack from "./especialidadesStack";
import CitasStack from "./citasStack";
import RegistroStack from "./registroaStack";

const Stack = createStackNavigator();

export default function InicioStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="InicioMenu" 
        component={InicioMenu} 
        options={{ title: "Inicio" }} 
      />
      <Stack.Screen 
        name="Pacientes" 
        component={PacientesStack} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Medicos" 
        component={MedicosStack} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Consultorios" 
        component={ConsultoriosStack} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Especialidades" 
        component={EspecialidadesStack} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Citas" 
        component={CitasStack} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="RegistroA" 
        component={RegistroStack} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}
