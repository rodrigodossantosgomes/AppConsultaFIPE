import * as React from "react";
import { StyleSheet, View } from "react-native";
import {
  Avatar,
  Text,
  Button,
  Card,
  Title,
  Paragraph,
} from "react-native-paper";

//https://deividfortuna.github.io/fipe/v2/
export default function Sobre() {
  return (
    <>
      <View style={styles.container}>
        <Text variant="headlineLarge">Consulta FIPE</Text>
        <View style={styles.block}>
          <Avatar.Icon
            size={96}
            color="white"
            backgroundColor="black"
            icon="car-info"
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    paddingTop: 16,
    height: "100%",
    justifyContent: "center",
    backgroundColor: "#f1f1f1",
  },
  block: {
    padding: 16,
    borderColor: "black",
  },
});
