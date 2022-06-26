import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function authHeader() {
  const jsonValue = await AsyncStorage.getItem("user");
  const user = jsonValue != null ? JSON.parse(jsonValue) : null;
  if (user && user.access) {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + user.access,
    };
  } else {
    return {};
  }
}

export async function refreshHeader() {
  const jsonValue = await AsyncStorage.getItem("user");
  const user = jsonValue != null ? JSON.parse(jsonValue) : null;

  if (user && user.refresh) {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + user.refresh,
    };
  } else {
    return {};
  }
}
