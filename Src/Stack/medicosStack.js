// MedicosStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Importa tus pantallas reales
import ListarMedicos from "../../Screen/Medicos/listarMedicos";
import CrearMedico from "../../Screen/Medicos/crearMedico";
import DetalleMedico from "../../Screen/Medicos/detalleMedico";
import EditarMedico from "../../Screen/Medicos/editarMedico";

import ListarMedicosP from "../../Screen/Medicos/listarMedicosP";

const Stack = createStackNavigator();

export default function MedicosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarMedicos"
        component={ListarMedicos}
        options={{ title: "Médicos" }}
      />
      <Stack.Screen
        name="CrearMedico"
        component={CrearMedico}
        options={{ title: "Crear Médico" }}
      />
      <Stack.Screen
        name="DetalleMedico"
        component={DetalleMedico}
        options={{ title: "Detalle Médico" }}
      />
      <Stack.Screen
        name="EditarMedico"
        component={EditarMedico}
        options={{ title: "Editar Médico" }}
      />
      <Stack.Screen
        name="ListarMedicosP"
        component={ListarMedicosP}
        options={{ title: "Médicos" }}
      />
    </Stack.Navigator>
  );
}
