// ConsultoriosStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Importa tus pantallas reales
import ListarConsultorios from "../../Screen/Consultorios/listarConsultorios";
import CrearConsultorio from "../../Screen/Consultorios/crearConsultorio";
import DetalleConsultorio from "../../Screen/Consultorios/detalleConsultorio";
import EditarConsultorio from "../../Screen/Consultorios/editarConsultorio";

const Stack = createStackNavigator();

export default function ConsultoriosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarConsultorios"
        component={ListarConsultorios}
        options={{ title: "Consultorios" }}
      />
      <Stack.Screen
        name="CrearConsultorio"
        component={CrearConsultorio}
        options={{ title: "Crear Consultorio" }}
      />
      <Stack.Screen
        name="DetalleConsultorio"
        component={DetalleConsultorio}
        options={{ title: "Detalle Consultorio" }}
      />
      <Stack.Screen
        name="EditarConsultorio"
        component={EditarConsultorio}
        options={{ title: "Editar Consultorio" }}
      />
    </Stack.Navigator>
  );
}
