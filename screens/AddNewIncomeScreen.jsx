import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { FieldArray, Formik } from "formik";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, FAB, HelperText, Text, TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";
import tw from "twrnc";
import * as Yup from "yup";
import DropDownWrapper from "../components/DropDownWrapper";
import { API_URL } from "../redux/http";
import {
  useGetAllCategoriesQuery,
  usePostIncomeCatMutation,
} from "../redux/services/unauthorized.service";
import { toDateString } from "../utils/dateUtils";

const AddIncomeSchema = Yup.object().shape({
  income_date: Yup.string().required("Обязательное поле"),
  comment: Yup.string(),
  income_cat: Yup.array().of(
    Yup.object().shape({
      quantity: Yup.number("Значение должно быть цифрой")
        .min(0, "Минимальное значение 0")
        .required("Обязательное поле"),

      price_per_unit: Yup.number("Значение должно быть цифрой")
        .min(0, "Минимальное значение 0")
        .required("Обязательное поле"),
      sub_total: Yup.number("Значение должно быть цифрой"),
    })
  ),
});

export default function AddNewIncomeScreen() {
  const dispatch = useDispatch();

  const { data: categoriesList, isLoading } = useGetAllCategoriesQuery();
  const [catList, setCatList] = useState([]);
  const [displayDatePicker, setDisplayDatePicker] = useState(false);

  const [postInCat, { data: dataInCat, isLoading: isLoadingInCat }] =
    usePostIncomeCatMutation();

  useEffect(() => {
    if (categoriesList?.data) {
      setCatList(categoriesList?.data);
    }
  }, [categoriesList]);

  const handleSubmitForm = async (values, { resetForm }) => {
    console.log(values);
    let total_sum = 0;
    let allIds = await Promise.all(
      values.income_cat.map(async (income_cat_item) => {
        let payload = {
          ...income_cat_item,
          sub_total: income_cat_item.price_per_unit * income_cat_item.quantity,
        };
        total_sum += payload.sub_total;
        const response = await postInCat(payload);
        const addedData = await response.data;
        console.log({ addedData });
        return addedData.data.id;
      })
    );

    let arr = [];
    for (let index = 0; index < values.income_cat.length; index++) {
      if (arr.some((x) => x.category === values.income_cat[index].category)) {
        arr.find(
          (x) => x.category === values.income_cat[index].category
        ).quantity += parseInt(values.income_cat[index].quantity);
        arr.find(
          (x) => x.category === values.income_cat[index].category
        ).total += parseInt(
          values.income_cat[index].quantity *
            values.income_cat[index].price_per_unit
        );
      } else {
        arr.push({
          category: values.income_cat[index].category,
          quantity: parseInt(values.income_cat[index].quantity),
          total: parseInt(
            values.income_cat[index].quantity *
              values.income_cat[index].price_per_unit
          ),
        });
      }
    }

    arr.map(async (item) => {
      let { data: curCategory } = await axios.get(
        `${API_URL}/categies/${item.category}`
      );
      let finalPayload = {
        total: curCategory.data.total + item.total,
        quantity: parseInt(curCategory.data.quantity) + parseInt(item.quantity),
      };
      let { data: finalResponse } = await axios.patch(
        `${API_URL}/categies/${item.category}`,
        finalPayload
      );
    });

    const finalPayload = {
      total_sum,
      income_date: values.income_date,
      comment: values.comment.toString(),
      income_cat: allIds,
    };
    console.log({ finalPayload });
    const finalRes = await axios.post(`${API_URL}/income`, finalPayload);
    console.log(finalRes.data);
  };

  return (
    <View style={tw`h-full flex-1 px-5 justify-start bg-gray-100`}>
      <Formik
        initialValues={{
          income_date: "",
          comment: "",
          income_cat: [
            {
              quantity: 0,
              price_per_unit: 0,
              sub_total: 0,
              category: categoriesList?.data[0]?.id.toString(),
            },
          ],
        }}
        validationSchema={AddIncomeSchema}
        onSubmit={handleSubmitForm}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <TextInput
              label="Комментарий"
              mode="flat"
              multiline
              onBlur={handleBlur("comment")}
              onChangeText={handleChange("comment")}
              value={values.comment}
              error={!!errors.comment && !!touched.comment}
            />
            {!!errors.comment && !!touched.comment && (
              <HelperText
                type="error"
                visible={!!errors.comment && !!touched.comment}
              >
                {errors.comment}
              </HelperText>
            )}
            <Button
              style={tw`mt-2`}
              mode="contained"
              onPress={() => setDisplayDatePicker(true)}
            >
              {values.income_date.toString().length > 0
                ? toDateString(new Date(values.income_date))
                : "Выбрать дату"}
            </Button>

            <FieldArray
              name="income_cat"
              render={(arrayHelpers) => (
                <>
                  <View style={tw`mt-6 flex flex-row justify-between`}>
                    <Text style={tw`font-bold`}>Доп. информация</Text>
                  </View>
                  <FAB
                    icon={"plus"}
                    style={tw`absolute right-0 bottom-6 m-5 bg-[#FB8500] z-10`}
                    onPress={() =>
                      arrayHelpers.push({
                        quantity: 0,
                        price_per_unit: 0,
                        sub_total: 0,
                        category: categoriesList?.data[0]?.id.toString(),
                      })
                    }
                  />
                  <ScrollView style={tw`flex-1`}>
                    {values.income_cat &&
                      values.income_cat.length > 0 &&
                      values.income_cat.map((item, index) => (
                        <View
                          key={index}
                          style={tw`${index !== 0 ? "mt-6" : "mt-2"}`}
                        >
                          <View style={tw`mt-2`}>
                            <DropDownWrapper
                              label={"Категория"}
                              mode={"flat"}
                              value={
                                values?.income_cat &&
                                values?.income_cat[index].category
                              }
                              setValue={handleChange(
                                `income_cat[${index}].category`
                              )}
                              list={catList?.map((measure) => ({
                                label: measure.name,
                                value: measure.id.toString(),
                              }))}
                              dropDownItemStyle={tw`flex flex-row justify-between items-center`}
                            />
                          </View>
                          <TextInput
                            label="Кол-во"
                            mode="flat"
                            multiline
                            onBlur={handleBlur(`income_cat[${index}].quantity`)}
                            onChangeText={handleChange(
                              `income_cat[${index}].quantity`
                            )}
                            value={
                              values?.income_cat &&
                              values.income_cat[index].quantity.toString()
                            }
                            error={
                              !!errors?.income_cat &&
                              !!touched?.income_cat &&
                              !!errors?.income_cat[index]?.quantity &&
                              !!touched?.income_cat[index]?.quantity
                            }
                          />
                          {!!errors?.income_cat &&
                            !!touched?.income_cat &&
                            !!errors?.income_cat[index]?.quantity &&
                            !!touched?.income_cat[index]?.quantity && (
                              <HelperText
                                type="error"
                                visible={
                                  errors?.income_cat?.length > 0 &&
                                  !!touched?.income_cat &&
                                  !!errors?.income_cat[index]?.quantity &&
                                  !!touched?.income_cat[index]?.quantity
                                }
                              >
                                {!!errors?.income_cat &&
                                  errors?.income_cat[index]?.quantity}
                              </HelperText>
                            )}
                          <TextInput
                            label="Цена"
                            mode="flat"
                            style={tw`mt-2`}
                            multiline
                            onBlur={handleBlur(
                              `income_cat[${index}].price_per_unit`
                            )}
                            onChangeText={handleChange(
                              `income_cat[${index}].price_per_unit`
                            )}
                            value={
                              values?.income_cat &&
                              values.income_cat[index].price_per_unit.toString()
                            }
                            error={
                              !!errors?.income_cat &&
                              !!errors?.income_cat[index]?.price_per_unit &&
                              !!touched?.income_cat[index]?.price_per_unit
                            }
                          />
                          {!!errors?.income_cat &&
                            !!errors?.income_cat[index]?.price_per_unit &&
                            !!touched?.income_cat[index]?.price_per_unit && (
                              <HelperText
                                type="error"
                                visible={
                                  errors?.income_cat?.length > 0 &&
                                  !!errors?.income_cat[index]?.price_per_unit &&
                                  !!touched?.income_cat[index]?.price_per_unit
                                }
                              >
                                {!!errors?.income_cat &&
                                  errors?.income_cat[index]?.price_per_unit}
                              </HelperText>
                            )}
                          <View
                            style={tw`flex flex-row justify-between items-center`}
                          >
                            <Text style={tw`mt-2 font-bold`}>
                              Общий:{" "}
                              {values?.income_cat[index]?.price_per_unit *
                                values?.income_cat[index]?.quantity}{" "}
                              тг.
                            </Text>
                            {index !== 0 && (
                              <Button
                                color="red"
                                onPress={() => arrayHelpers.remove(index)}
                              >
                                Удалить
                              </Button>
                            )}
                          </View>
                        </View>
                      ))}
                  </ScrollView>
                </>
              )}
            />

            <Button
              style={tw`mt-6`}
              disabled={!isValid}
              mode="contained"
              onPress={handleSubmit}
            >
              Создать
            </Button>
            {displayDatePicker && (
              <DateTimePicker
                value={new Date()}
                onChange={(e, selectedVal) => {
                  setDisplayDatePicker(false);
                  setFieldValue("income_date", selectedVal);
                }}
              />
            )}
          </>
        )}
      </Formik>
    </View>
  );
}
