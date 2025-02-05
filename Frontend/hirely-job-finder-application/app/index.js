import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>onBoarding</Text>
      <TouchableOpacity onPress={() => { router.push("/onBoarding") }}>
        <Text style={{ fontFamily: 'Poppins-BlackItalic' }}>
          Go
        </Text>
      </TouchableOpacity>
    </View>
  );
}
