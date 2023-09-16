import { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { ActivityIndicator, Avatar, Card, Title } from "react-native-paper";

function removeUltimoCaracter(value, qtd) {
  return value.slice(0, -qtd);
}

export default function VeiculoViewScreen({ route, navigation }) {
  const [loading, setLoading] = useState(true);
  const [veiculo, setVeiculo] = useState(null);
  const [historico, setHistorico] = useState([]);

  const { veiculoClicadoTipo, veiculoClicadoCodFipe, veiculoClicadoAno } =
    route.params;

  const LeftContent = (props) => (
    <Avatar.Icon
      {...props}
      size={64}
      color="white"
      backgroundColor="black"
      icon={
        removeUltimoCaracter(veiculoClicadoTipo, 1) == "motorcycle"
          ? "bike" // motorbike ou moped ou bike
          : removeUltimoCaracter(veiculoClicadoTipo, 1)
      }
    />
  );

  async function carregaDadosVeiculo() {
    setLoading(true);
    try {
      const response = await fetch(
        "https://parallelum.com.br/fipe/api/v2/" +
          veiculoClicadoTipo +
          "/" +
          veiculoClicadoCodFipe +
          "/years/" +
          //removeUltimoCaracter(veiculoClicadoAno, 2) +
          veiculoClicadoAno +
          "/history"
      );
      const veiculo = await response.json();
      setVeiculo(veiculo);
      setHistorico(veiculo.priceHistory);

      navigation.setOptions({ title: veiculo?.brand + " - " + veiculo?.model });

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }
  useEffect(() => {
    carregaDadosVeiculo();
  }, []);

  return (
    <View style={styles.container}>
      {!!loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator animating={true} size="large" />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 16 }}
        >
          <Card>
            <Card.Title
              style={{ padding: 24 }}
              title={veiculo.brand + " " + veiculo.model}
              titleNumberOfLines={3}
              titleStyle={{
                paddingHorizontal: 24,
                fontSize: 22,
                fontWeight: "bold",
                marginTop: 6,
              }}
              subtitle={"Ano: " + veiculo.modelYear}
              subtitleStyle={{
                paddingHorizontal: 24,
                fontSize: 16,
                marginTop: 6,
              }}
              subtitleNumberOfLines={2}
              left={LeftContent}
            />
            <Card.Content>
              <Title style={{ fontWeight: "bold" }}>
                Código Fipe: {veiculo.codeFipe}
              </Title>
              {historico.map((item) => {
                return (
                  <Card key={item.reference} style={{ marginTop: 10 }}>
                    <Title
                      style={{
                        fontSize: 18,
                        paddingHorizontal: 6,
                        marginTop: 12,
                      }}
                    >
                      Valor Fipe: {item.price}
                    </Title>
                    <Title
                      style={{
                        fontSize: 18,
                        paddingHorizontal: 6,
                        marginBottom: 12,
                      }}
                    >
                      Mês de Referência: {item.month}
                    </Title>
                  </Card>
                );
              })}
            </Card.Content>
          </Card>
        </ScrollView>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
