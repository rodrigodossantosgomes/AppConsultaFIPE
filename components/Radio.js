import { TouchableOpacity, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";

function Radio({ label, value }) {
  return (
    <TouchableOpacity>
      <RadioButton.Item
        label={label}
        labelStyle={{
          fontSize: 18,
        }}
        value={value}
        color="#000"
        style={styles.radio}
      />
    </TouchableOpacity>
  );
}

export default Radio;

const styles = StyleSheet.create({
  radio: {
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: 20,
  },
});
