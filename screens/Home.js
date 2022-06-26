import { TouchableOpacity, View, ScrollView, FlatList } from "react-native";
import { ProgressBar, Text, FAB } from "react-native-paper";
import tw from "twrnc";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  useGetAllCategoriesQuery,
  useGetAllMainIncomesQuery,
} from "../redux/services/unauthorized.service";
import { useEffect, useState } from "react";

export default function Home({ navigation }) {
  const { data: categoriesList, isLoading } = useGetAllCategoriesQuery();
  const { data: incomeList, isLoading: isLoadingIncomeList } =
    useGetAllMainIncomesQuery();
  const [sum, setSum] = useState(0);
  const [incomes, setIncomes] = useState([]);

  useEffect(() => {
    if (categoriesList?.data) {
      let sum = categoriesList?.data?.reduce((accumulator, object) => {
        return accumulator + object.total;
      }, 0);

      setSum(sum);
    }
  }, [categoriesList]);

  useEffect(() => {
    if (incomeList?.data) {
      let arr = [];

      for (let index = 0; index < incomeList?.data.length; index++) {
        const element = incomeList?.data[index].income_date;
        if (
          arr.some((x) => x.income_date === incomeList?.data[index].income_date)
        ) {
          arr.find(
            (x) => x.income_date === incomeList?.data[index].income_date
          ).total += parseInt(incomeList?.data[index].total_sum);
          let temp = arr.find(
            (x) => x.income_date === incomeList?.data[index].income_date
          ).income_cat;
          temp = [...temp, ...incomeList?.data[index].income_cat];

          arr.find(
            (x) => x.income_date === incomeList?.data[index].income_date
          ).income_cat = temp;
        } else {
          arr.push({
            income_date: incomeList?.data[index].income_date,
            id: incomeList?.data[index].id,
            total: parseInt(incomeList?.data[index].total_sum),
            income_cat: incomeList?.data[index].income_cat,
          });
        }
      }

      setIncomes(arr);
    }
  }, [incomeList]);

  return (
    <View style={tw`h-full flex-1 px-5 pb-8 justify-start bg-gray-100`}>
      <Text style={tw`font-bold`}>Добро пожаловать, Айгерим!</Text>
      <Text style={tw`text-gray-600 text-2xl mt-6`}>
        Заработано: <Text style={tw`text-4xl font-bold`}>{sum} тг.</Text>
      </Text>
      <View style={tw`mt-2 relative flex justify-center`}>
        <ProgressBar progress={sum / 3600000} style={tw`h-12 rounded-xl`} />
        <Text style={tw`text-gray-500 absolute right-2 text-xl`}>
          3 600 000 тг.
        </Text>
      </View>

      <Text style={tw`text-lg text-gray-600 font-bold mt-6`}>Категории:</Text>
      <View style={tw`mt-2`}>
        <FlatList
          data={categoriesList ? categoriesList.data : []}
          horizontal
          renderItem={({ item, index }) => (
            <View
              style={tw`flex flex-col justify-center items-center  ${
                index !== 0 ? "ml-4" : ""
              }`}
            >
              <TouchableOpacity
                style={tw`bg-[${item?.color}] rounded-xl text-white flex justify-center items-center w-14 h-14 p-4`}
                color={"white"}
                onPress={() => console.log("Pressed")}
              >
                <MaterialIcons name={item?.icon} size={24} color="white" />
              </TouchableOpacity>
              <Text style={tw`text-xs text-gray-600 mt-1`}>{item?.name}</Text>
            </View>
          )}
        />
      </View>

      <Text style={tw`text-lg text-gray-600 font-bold mt-6`}>Доход:</Text>
      <FlatList
        data={incomes}
        renderItem={({ item, index }) => (
          <View>
            <View
              style={tw`flex flex-row flex-1 w-full justify-between items-center mt-4`}
            >
              <Text style={tw`text-gray-600 font-bold text-base`}>
                {item.income_date}
              </Text>
              <Text style={tw`text-green-600 font-bold text-base`}>+ {item.total} тг.</Text>
            </View>
            <ScrollView>
              {item.income_cat.map((incomeItem, index) => (
                <View
                  key={incomeItem.id}
                  style={tw`flex flex-row justify-between items-center`}
                >
                  <MaterialIcons
                    name={incomeItem?.category?.icon}
                    size={32}
                    color="#FFB703"
                  />

                  <View
                    style={tw`ml-2 flex-1 flex flex-row justify-between items-center bg-[#002C67] py-5 px-4 rounded-xl mt-2 flex-wrap shadow-lg`}
                  >
                    <Text style={tw`text-white text-lg font-bold`}>
                      
                    </Text>
                    <Text style={tw`text-white text-xl font-bold`}>
                      + {incomeItem.sub_total} тг.
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      />

      <FAB
        icon="plus"
        style={tw`absolute right-0 bottom-0 m-5 bg-[#FB8500]`}
        onPress={() => navigation.navigate("AddNewIncomeScreen")}
      />
    </View>
  );
}
