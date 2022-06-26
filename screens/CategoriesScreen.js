import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { FAB, Text } from "react-native-paper";
import tw from "twrnc";
import AddCategoryDialog from "../components/AddCategoryDialog";
import { useGetAllCategoriesQuery } from "../redux/services/unauthorized.service";

export default function CategoriesScreen({ navigation }) {
  const { data: categoriesList, isLoading } = useGetAllCategoriesQuery();

  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  return (
    <View style={tw`h-full flex-1 px-5 pb-8 justify-start bg-gray-100`}>
      <FlatList
        data={categoriesList?.data}
        renderItem={({ item, index }) => (
          <View
            key={item.id}
            style={tw`flex flex-row justify-between items-center bg-white py-4 px-4 rounded-xl mt-2 flex-wrap`}
          >
            <View
              style={tw`bg-[${item.color}] rounded-xl text-white flex justify-center items-center w-14 h-14 p-4`}
            >
              <MaterialIcons name={item.icon} size={26} color="white" />
            </View>

            <View
              style={tw`ml-4 flex-1 flex flex-row justify-between items-center flex-wrap`}
            >
              <Text style={tw`text-black text-xl font-bold`}>{item.name}</Text>
            </View>
          </View>
        )}
      />

      <AddCategoryDialog hideDialog={hideDialog} visible={visible} />

      <FAB
        icon="plus"
        style={tw`absolute right-0 bottom-0 m-5 bg-[#FB8500]`}
        onPress={showDialog}
      />
    </View>
  );
}
