import { View } from "react-native";
import { Headline, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

const Header = ({ title, rightButton, navigation, routeName }) => {
  return (
    <SafeAreaView style={tw`bg-gray-100`}>
      <View
        style={tw`flex-row justify-between items-center h-[80px] p-5 bg-gray-100`}
      >
        <Headline style={tw`text-xl font-bold`}>{title}</Headline>
        {rightButton && (
          <IconButton
            icon="chevron-left"
            style={tw`bg-white`}
            onPress={navigation.goBack}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Header;
