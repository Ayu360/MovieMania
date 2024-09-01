import { router } from "expo-router";
import {
  Button,
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "@/store/authStore";

import { images } from "@/constants";
import CustomBotton from "@/components/customButton";
import colors from "@/constants/colors";

export function AppName({ children }) {
  return <Text style={{ color: colors.secondary[200] }}>{children}</Text>;
}

const RootIndex = () => {
  // const user = useAuthStore(state=>state.user)
  // console.log(user)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewStyles}>
        <View style={styles.heroSection}>
          <Image
            source={images.logo}
            style={{ width: "60%", height: 84 }}
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            style={{ maxWidth: 380, width: "100%", height: 300 }}
            resizeMode="contain"
          />
          <View style={{ position: "relative", marginTop: 5 }}>
            <Text
              style={{
                color: "white",
                fontSize: 17,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Discover Endless Possibilities with <AppName>MovieMania</AppName>
            </Text>
            <Image
              source={images.path}
              style={{
                width: 136,
                height: 15,
                position: "absolute",
                bottom: -15,
                right: -25,
              }}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              color: "#CDCDE0",
              marginTop: 20,
              textAlign: "center",
              fontSize: 15,
            }}
          >
            Where ceriosity meets innovation: embark on a journey of limitless
            exploration
          </Text>
          <CustomBotton
            title="Continue with Email"
            handlePress={() => router.push("/(auth)")}
            textStyles=""
            containerStyles={styles.buttonSyles}
            isLoading={false}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" barStyle="light-content" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors["primary"],
    height: "100%",
  },
  scrollViewStyles: {
    height: "100%",
  },
  heroSection: {
    width: "100%",
    minHeight: "85%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  buttonSyles: {
    width: "100%",
    marginTop: 30,
  },
});

export default RootIndex;
