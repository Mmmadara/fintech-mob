import { getHeaderTitle } from "@react-navigation/elements";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from "../components/Header";
import AddNewIncomeScreen from "../screens/AddNewIncomeScreen";
import Home from "../screens/Home";

const Stack = createNativeStackNavigator();

const MainStack = () => {
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
          title: "Главная",
        }}
        name="HomeScreen"
        component={Home}
      />
      <Stack.Screen
        options={{
          title: "Добавление дохода",
        }}
        name="AddNewIncomeScreen"
        component={AddNewIncomeScreen}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
