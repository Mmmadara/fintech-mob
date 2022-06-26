import { NavigationContainer } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { DefaultTheme, Provider as PaperProvider, Snackbar } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage } from "../redux/slices/message";
import BottomBar from "../stacks/BottomBar";
import tw from "twrnc";

const theme = {
  ...DefaultTheme,
  version: 3,
  colors: {
    ...DefaultTheme.colors,
    primary: "#002C67",
    accent: "#3f5495",
    secondary: "#FB8500",
  },
};

export default function NavContainer() {
  const dispatch = useDispatch();
  const { message } = useSelector((state) => state.message);
  const onDismissSnackBar = () => dispatch(clearMessage());

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <SafeAreaProvider>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <BottomBar />
            <View style={tw`w-full px-5 items-center`}>
              <Snackbar
                duration={3000}
                visible={
                  message !== null &&
                  message !== undefined &&
                  message.length > 0
                }
                onDismiss={onDismissSnackBar}
              >
                {message}
              </Snackbar>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}
