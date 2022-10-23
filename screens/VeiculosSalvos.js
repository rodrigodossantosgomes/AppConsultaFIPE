import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  StyleSheet,
  Alert,
  FlatList,
  PixelRatio,
  View,
  Text,
} from "react-native";
import { List } from "react-native-paper";

import { executeSql } from "../db";

function removeUltimoCaracter(value, qtd) {
  return value.slice(0, -qtd);
}

function excluirItem(item, recuperaListaVeiculos) {
  const _runDeleteQuery = async () => {
    await executeSql("DELETE FROM veiculos WHERE id = ?", [item.id]);
    recuperaListaVeiculos();
  };

  Alert.alert(
    "Remover veiculo",
    `Você confirma a exclusão deste veiculo?`,
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      { text: "OK", onPress: _runDeleteQuery },
    ],
    { cancelable: false }
  );
}

function VeiculoItem({ item, onPress, recuperaListaVeiculos }) {
  return (
    <>
      <List.Item
        titleStyle={{
          fontSize: 22,
          fontWeight: "600",
          color: "#333",
        }}
        style={{ padding: 16 }}
        title={item.marca}
        description={item.modelo + " - " + removeUltimoCaracter(item.ano, 2)}
        descriptionStyle={{ fontSize: 18 }}
        left={(props) => (
          <List.Icon
            {...props}
            icon={
              removeUltimoCaracter(item.tipo, 1) == "motorcycle"
                ? "bike" // motorbike ou moped ou bike
                : removeUltimoCaracter(item.tipo, 1)
            }
          />
        )}
        right={(props) => (
          <TouchableOpacity
            onPress={() => excluirItem(item, recuperaListaVeiculos)}
          >
            <List.Icon {...props} icon="trash-can-outline" />
          </TouchableOpacity>
        )}
        onPress={onPress}
      />
    </>
  );
}

function ListEmptyVeiculos({ onEmptyPress }) {
  return (
    <View style={{ paddingVertical: 26, paddingHorizontal: 16 }}>
      <Text
        style={{
          fontSize: 18,
          textAlign: "center",
          marginTop: 9,
          marginBottom: 28,
        }}
      >
        Nenhum veículo adicionado em sua lista
      </Text>
    </View>
  );
}

export default function VeiculosSalvos({ route, navigation }) {
  const [lista, setLista] = useState([]);

  async function recuperaListaVeiculos() {
    const rs = await executeSql("SELECT * FROM veiculos ORDER BY tipo ASC");
    setLista(rs.rows._array);
  }

  useEffect(() => {
    if (!!route.params?.novoItem) {
      recuperaListaVeiculos();
    }
  }, [route.params?.novoItem]);

  useEffect(() => {
    recuperaListaVeiculos();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={({ highlighted }) => (
          <View
            style={[
              styles.rowSeparator,
              highlighted && styles.rowSeparatorHide,
            ]}
          />
        )}
        ListEmptyComponent={() => <ListEmptyVeiculos />}
        renderItem={({ item }) => (
          <VeiculoItem
            item={item}
            recuperaListaVeiculos={recuperaListaVeiculos}
            onPress={() => {
              navigation.navigate("VeiculoView", {
                veiculoClicadoTipo: item.tipo,
                veiculoClicadoCodFipe: item.codigoFipe,
                veiculoClicadoAno: item.ano,
              });
            }}
          />
        )}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 6,
    marginBottom: 12,
  },
  textInfo: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  itemCircularText: { fontSize: 16, fontWeight: "500", color: "#333" },
  rowSeparator: {
    backgroundColor: "#aaa",
    height: 1 / PixelRatio.get(), // altura automática do separador
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});
