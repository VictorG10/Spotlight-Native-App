import { styles } from "@/styles/auth.styles";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit app/index.tsx to edit this screen.</Text>
      <TouchableOpacity onPress={() => alert("you touched")}>
        <Text>Press Me</Text>
      </TouchableOpacity>
    </View>
  );
}
