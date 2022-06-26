import { getHeaderTitle } from "@react-navigation/elements";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from "../components/Header";
import CategoriesScreen from "../screens/CategoriesScreen";

const Stack = createNativeStackNavigator();

const CategoriesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ navigation, route, options, back }) => {
          const title = getHeaderTitle(options, route.name);

          return (
            <Header
              title={title}
              rightButton={back}
              routeName={route.name}
              navigation={navigation}
            />
          );
        },
      }}
    >
      <Stack.Screen
        options={{
          title: "Категории",
        }}
        name="CategoriesScreen"
        component={CategoriesScreen}
      />
    </Stack.Navigator>
  );
};

export default CategoriesStack;
