import MaterialCommunity from "@expo/vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getHeaderTitle } from "@react-navigation/elements";
import Header from "../components/Header";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import CategoriesStack from "./CategoriesStack";
import MainStack from "./MainStack";

const Tab = createBottomTabNavigator();

export default function BottomBar() {
  return (
    <Tab.Navigator
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
      <Tab.Screen
        name="HomeTab"
        options={{
          title: "Главная",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = focused ? "home" : "home-outline";

            return (
              <MaterialCommunity name={iconName} size={size} color={color} />
            );
          },
          tabBarActiveTintColor: "#002C67",
          tabBarInactiveTintColor: "gray",
        }}
        component={MainStack}
      />

      <Tab.Screen
        name="CategoriesTab"
        options={{
          title: "Категории",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = focused ? "view-list" : "view-list";

            return (
              <MaterialCommunity name={iconName} size={size} color={color} />
            );
          },
          tabBarActiveTintColor: "#002C67",
          tabBarInactiveTintColor: "gray",
        }}
        component={CategoriesStack}
      />

      <Tab.Screen
        name="AnalyticsScreen"
        options={{
          title: "Аналитика",
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = focused ? "graph" : "graph";

            return (
              <MaterialCommunity name={iconName} size={size} color={color} />
            );
          },
          tabBarActiveTintColor: "#002C67",
          tabBarInactiveTintColor: "gray",
        }}
        component={AnalyticsScreen}
      />
    </Tab.Navigator>
  );
}
