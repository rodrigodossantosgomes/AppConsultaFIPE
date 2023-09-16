import { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  View,
  Text,
  ScrollView,
} from "react-native";
import { RadioButton, Button } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";

import { executeSql } from "../db";

import Radio from "../components/Radio";

export default function CadastroVeiculo({ navigation }) {
  const tipos = [
    { id: 1, name: "Carros", value: "cars" },
    { id: 2, name: "Motos", value: "motorcycles" },
    { id: 3, name: "Caminhões", value: "trucks" },
  ];
  const [openTipos, setOpenTipos] = useState(false);

  const [valueTipo, setTipo] = useState("");

  const [marcas, setMarcas] = useState([]);
  const [openMarcas, setOpenMarcas] = useState(false);
  const [valueMarcas, setValueMarcas] = useState(null);

  const [modelos, setModelos] = useState([]);
  const [openModelos, setOpenModelos] = useState(false);
  const [valueModelos, setValueModelos] = useState(null);

  const [anos, setAnos] = useState([]);
  const [openAnos, setOpenAnos] = useState(false);
  const [valueAnos, setValueAnos] = useState(null);

  const [valueDados, setDados] = useState([]);

  const [liberaSalvar, setLiberaSalvar] = useState(true);

  async function carregaMarcas() {
    try {
      setMarcas([]);
      setValueMarcas("");
      setModelos([]);
      setValueModelos("");
      setAnos([]);
      setValueAnos("");
      setDados("");
      setLiberaSalvar(true);
      const response = await fetch(
        "https://parallelum.com.br/fipe/api/v2/" + valueTipo + "/brands"
      );
      const marcas = await response.json();
      setMarcas(marcas);
    } catch (err) {}
  }

  async function carregaModelos({ code }) {
    setModelos([]);
    setValueModelos("");
    setAnos([]);
    setValueAnos("");
    setDados("");
    setLiberaSalvar(true);
    try {
      const response = await fetch(
        "https://parallelum.com.br/fipe/api/v2/" +
          valueTipo +
          "/brands/" +
          code +
          "/models"
      );
      const modelos = await response.json();
      setModelos(modelos);
    } catch (err) {}
  }

  async function carregaAnos({ code }) {
    setAnos([]);
    setValueAnos("");
    setDados("");
    setLiberaSalvar(true);
    try {
      const response = await fetch(
        "https://parallelum.com.br/fipe/api/v2/" +
          valueTipo +
          "/brands/" +
          valueMarcas +
          "/models/" +
          code +
          "/years"
      );
      const anos = await response.json();
      setAnos(anos);
    } catch (err) {}
  }

  async function carregaDados({ code }) {
    try {
      const response = await fetch(
        "https://parallelum.com.br/fipe/api/v2/" +
          valueTipo +
          "/brands/" +
          valueMarcas +
          "/models/" +
          valueModelos +
          "/years/" +
          code
      );
      const valueDados = await response.json();
      valueDados.yearId = code;
      setDados(valueDados);
      setLiberaSalvar(false);
    } catch (err) {}
  }

  async function salvaNoBanco() {
    try {
      const { insertId = null } = await executeSql(
        "INSERT INTO veiculossalvos (tipo, marca, modelo, ano, anoId, codigoFipe) VALUES(?, ?, ?, ?, ?, ?)",
        [
          valueTipo,
          valueDados.brand,
          valueDados.model,
          valueDados.modelYear,
          valueDados.yearId,
          valueDados.codeFipe,
        ]
      );
      limpaDados();
      navigation.navigate("VeiculosSalvosTab", {
        screen: "VeiculosSalvos",
        params: { novoItem: insertId },
      });
    } catch (err) {
      //console.error(err);

      //Error code 19
      if (err.message.substring(0, 13) == "Error code 19") {
        Alert.alert(
          "Veículo já inserido",
          `Você pode consultá-lo na aba Veiculos Salvos`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Erro inesperado",
          `A API pode estar offline ou algum outro incidente`,
          [{ text: "OK" }]
        );
      }
      limpaDados();
    }
  }

  function limpaDados() {
    setTipo("");
    setMarcas([]);
    setValueMarcas("");
    setModelos([]);
    setValueModelos("");
    setAnos([]);
    setValueAnos("");
    setDados([]);
    setLiberaSalvar(true);
  }

  useEffect(() => {
    carregaMarcas();
  }, [valueTipo]);

  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Selecione o tipo: </Text>
              <DropDownPicker
                style={{
                  borderRadius: 20,
                }}
                schema={{
                  label: "name",
                  value: "value",
                }}
                placeholder="Selecione um tipo"
                textStyle={{
                  fontSize: 18,
                }}
                listMode="SCROLLVIEW"
                open={openTipos}
                value={valueTipo}
                items={tipos}
                setOpen={setOpenTipos}
                setValue={setTipo}
                onSelectItem={(item) => {
                  carregaModelos(item);
                }}
                zIndex={4000}
                zIndexInverse={1000}
              />

              <Text style={styles.title}>Selecione a marca: </Text>
              <DropDownPicker
                style={{
                  borderRadius: 20,
                }}
                schema={{
                  label: "name",
                  value: "code",
                }}
                placeholder="Selecione uma marca"
                textStyle={{
                  fontSize: 18,
                }}
                listMode="MODAL"
                searchable={true}
                searchTextInputStyle={{
                  borderRadius: 15,
                }}
                open={openMarcas}
                value={valueMarcas}
                items={marcas}
                setOpen={setOpenMarcas}
                setValue={setValueMarcas}
                setItems={setMarcas}
                onSelectItem={(item) => {
                  carregaModelos(item);
                }}
                zIndex={3000}
                zIndexInverse={1000}
              />

              <Text style={styles.title}>Selecione o modelo: </Text>
              <DropDownPicker
                style={{
                  borderRadius: 20,
                }}
                schema={{
                  label: "name",
                  value: "code",
                }}
                placeholder="Selecione um modelo"
                textStyle={{
                  fontSize: 18,
                }}
                listMode="MODAL"
                searchable={true}
                searchTextInputStyle={{
                  borderRadius: 15,
                }}
                open={openModelos}
                value={valueModelos}
                items={modelos}
                setOpen={setOpenModelos}
                setValue={setValueModelos}
                setItems={setModelos}
                onSelectItem={(item) => {
                  carregaAnos(item);
                }}
                zIndex={2000}
                zIndexInverse={2000}
              />

              <Text style={styles.title}>Selecione o ano: </Text>
              <DropDownPicker
                style={{
                  borderRadius: 20,
                }}
                schema={{
                  label: "name",
                  value: "code",
                }}
                placeholder="Selecione um ano"
                textStyle={{
                  fontSize: 18,
                }}
                listMode="MODAL"
                searchable={true}
                searchTextInputStyle={{
                  borderRadius: 15,
                }}
                open={openAnos}
                value={valueAnos}
                items={anos}
                setOpen={setOpenAnos}
                setValue={setValueAnos}
                setItems={setAnos}
                onSelectItem={(item) => {
                  carregaDados(item);
                }}
                zIndex={1000}
                zIndexInverse={3000}
              />
              <Text style={styles.title}>Valor: {valueDados.price}</Text>

              <Button
                disabled={liberaSalvar}
                style={{ marginTop: 16 }}
                buttonColor="#aaa"
                contentStyle={{ height: 48 }}
                labelStyle={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
                mode="contained"
                onPress={salvaNoBanco}
              >
                Salvar Veículo
              </Button>

              <Button
                style={{ marginTop: 12 }}
                buttonColor="#aaa"
                contentStyle={{ height: 48 }}
                labelStyle={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
                mode="contained" //'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal'
                onPress={() => limpaDados()}
              >
                Limpar
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    paddingTop: 0,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
  },
});
