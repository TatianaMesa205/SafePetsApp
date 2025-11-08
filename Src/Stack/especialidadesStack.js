// EspecialidadesStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Importa tus pantallas reales
import ListarEspecialidades from "../../Screen/Especialidades/listarEspecialidades";
import CrearEspecialidad from "../../Screen/Especialidades/crearEspecialidad";
import DetalleEspecialidad from "../../Screen/Especialidades/detalleEspecialidad";
import EditarEspecialidad from "../../Screen/Especialidades/editarEspecialidad";

import ListarEspecialidadesP from "../../Screen/Especialidades/listarEspecialidadesP";

const Stack = createStackNavigator();

export default function EspecialidadesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarEspecialidades"
        component={ListarEspecialidades}
        options={{ title: "Especialidades" }}
      />
      <Stack.Screen
        name="CrearEspecialidad"
        component={CrearEspecialidad}
        options={{ title: "Crear Especialidad" }}
      />
      <Stack.Screen
        name="DetalleEspecialidad"
        component={DetalleEspecialidad}
        options={{ title: "Detalle Especialidad" }}
      />
      <Stack.Screen
        name="EditarEspecialidad"
        component={EditarEspecialidad}
        options={{ title: "Editar Especialidad" }}
      />
      <Stack.Screen
        name="ListarEspecialidadesP"
        component={ListarEspecialidadesP}
        options={{ title: "Especialidades" }}
      />

    </Stack.Navigator>
  );
}
