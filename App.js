import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import SobreScreen from "./screens/Sobre";
import VeiculosSalvos from "./screens/VeiculosSalvos";
import VeiculoViewScreen from "./screens/VeiculoView";

import CadastroVeiculoScreen from "./screens/CadastroVeiculo";

const tabBarListeners = ({ navigation, route }) => ({
  tabPress: () => navigation.navigate(route.name),
});

const StackSobre = createNativeStackNavigator();

function Sobre() {
  return (
    <StackSobre.Navigator initialRouteName="Sobre">
      <StackSobre.Screen
        name="Sobre"
        component={SobreScreen}
        options={{
          title: "Sobre",
        }}
      />
    </StackSobre.Navigator>
  );
}

const StackCadastroVeiculo = createNativeStackNavigator();

function CadastroVeiculoNavigator() {
  return (
    <StackCadastroVeiculo.Navigator initialRouteName="CadastroVeiculo">
      <StackCadastroVeiculo.Screen
        name="CadastroVeiculo"
        component={CadastroVeiculoScreen}
        options={({ navigation }) => ({
          title: "Seleção de veículo",
        })}
      />
    </StackCadastroVeiculo.Navigator>
  );
}

const StackVeiculosSalvos = createNativeStackNavigator();

function VeiculosSalvosNavigator() {
  return (
    <StackVeiculosSalvos.Navigator initialRouteName="VeiculosSalvos">
      <StackVeiculosSalvos.Screen
        name="VeiculosSalvos"
        component={VeiculosSalvos}
        options={({ navigation }) => ({
          title: "Veículos Salvos",
        })}
      />
      <StackVeiculosSalvos.Screen
        name="VeiculoView"
        component={VeiculoViewScreen}
        options={{
          title: "Carregando...",
        }}
      />
    </StackVeiculosSalvos.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function tabScreenOptions({ route }) {
  return {
    headerShown: false,
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === "CadastroVeiculoTab") {
        iconName = focused ? "car" : "car-outline";
      } else if (route.name === "VeiculosSalvosTab") {
        iconName = focused ? "car-info" : "car-info";
      } else if (route.name === "SobreTab") {
        iconName = focused ? "information" : "information-outline";
      }

      return (
        <MaterialCommunityIcons name={iconName} size={size} color={color} />
      );
    },
  };
}

export default function App() {
  return (
    <PaperProvider>
      <>
        <NavigationContainer>
          <Tab.Navigator screenOptions={tabScreenOptions}>
            <Tab.Screen
              name="CadastroVeiculoTab"
              component={CadastroVeiculoNavigator}
              options={{ tabBarLabel: "Cadastro" }}
            />
            <Tab.Screen
              name="VeiculosSalvosTab"
              component={VeiculosSalvosNavigator}
              options={{ tabBarLabel: "Veiculos Salvos" }}
              listeners={tabBarListeners}
            />
            <Tab.Screen
              name="SobreTab"
              component={Sobre}
              options={{ tabBarLabel: "Sobre" }}
            />
          </Tab.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </>
    </PaperProvider>
  );
}
