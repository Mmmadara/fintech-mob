import { Formik } from "formik";
import { useEffect, useState } from "react";
import { View } from "react-native";
import {
  Button,
  Dialog,
  HelperText,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DropDown from "react-native-paper-dropdown";
import tw from "twrnc";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import {
  useGetAllMeasurementsQuery,
  usePostCategoryMutation,
} from "../redux/services/unauthorized.service";
import { addMessage } from "../redux/slices/message";

const AddCatSchema = Yup.object().shape({
  name: Yup.string().required("Обязательное поле"),
  measurement: Yup.string().required("Обязательное поле"),
  price: Yup.number("Значение должно быть цифрой")
    .min(0, "Минимальное значение 0")
    .required("Обязательное поле"),
  icon: Yup.string().required("Обязательное поле"),
  color: Yup.string().required("Обязательное поле"),
});

export default function AddCategoryDialog({ visible, hideDialog }) {
  const dispatch = useDispatch();
  const [showDropDown, setShowDropDown] = useState(false);
  const [showDropDownIcon, setShowDropDownIcon] = useState(false);
  const [listMeas, setListMeas] = useState([]);
  const { data: measurementsList, isLoading } = useGetAllMeasurementsQuery();
  const [postNewCat, { data: dataNewCat, isLoading: isLoadingNewCat }] =
    usePostCategoryMutation();

  const iconList = [
    {
      label: "Доставка город",
      value: "delivery-dining",
      custom: (
        <View style={tw`flex flex-1 flex-row items-center h-full`}>
          <MaterialIcons name="delivery-dining" size={26} color="#000000" />
          <Text style={tw`ml-2`}>Доставка город</Text>
        </View>
      ),
    },
    {
      label: "Еда",
      value: "fastfood",
      custom: (
        <View style={tw`flex flex-1 flex-row items-center h-full`}>
          <MaterialIcons name="fastfood" size={26} color="#000000" />
          <Text style={tw`ml-2`}>Еда</Text>
        </View>
      ),
    },
    {
      label: "Городской такси",
      value: "local-taxi",
      custom: (
        <View style={tw`flex flex-1 flex-row items-center h-full`}>
          <MaterialIcons name="local-taxi" size={26} color="#000000" />
          <Text style={tw`ml-2`}>Городской такси</Text>
        </View>
      ),
    },
    {
      label: "Доставка межгород",
      value: "local-shipping",
      custom: (
        <View style={tw`flex flex-1 flex-row items-center h-full`}>
          <MaterialIcons name="local-shipping" size={26} color="#000000" />
          <Text style={tw`ml-2`}>Доставка межгород</Text>
        </View>
      ),
    },
    {
      label: "Такси межгород",
      value: "hail",
      custom: (
        <View style={tw`flex flex-1 flex-row items-center h-full`}>
          <MaterialIcons name="hail" size={26} color="#000000" />
          <Text style={tw`ml-2`}>Такси межгород</Text>
        </View>
      ),
    },
    {
      label: "Аренда машины",
      value: "car-rental",
      custom: (
        <View style={tw`flex flex-1 flex-row items-center h-full`}>
          <MaterialIcons name="car-rental" size={26} color="#000000" />
          <Text style={tw`ml-2`}>Аренда машины</Text>
        </View>
      ),
    },
  ];

  useEffect(() => {
    if (measurementsList?.data) {
      setListMeas(measurementsList?.data);
    }
  }, [measurementsList]);

  const handleSubmit = async (formValues, { resetForm }) => {
    const data = {
      ...formValues,
    };
    console.log("submit :>> ", data);
    await postNewCat(data)
      .unwrap()
      .then((res) => {
        console.log("res :>> ", res);
        dispatch(addMessage("Успешно добавлено!"));
      });
    hideDialog();
    resetForm();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Formik
          validationSchema={AddCatSchema}
          initialValues={{
            name: "",
            measurement: measurementsList?.data[0]?.id.toString(),
            price: "",
            icon: "delivery-dining",
            color: "",
            quantity: 0,
            total: 0,
          }}
          onSubmit={handleSubmit}
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
              <Dialog.Title>Добавление</Dialog.Title>
              <Dialog.Content>
                <View>
                  <TextInput
                    label="Название"
                    mode="flat"
                    onBlur={handleBlur("name")}
                    onChangeText={handleChange("name")}
                    value={values.name}
                    error={!!errors.name && !!touched.name}
                  />
                  {!!errors.name && !!touched.name && (
                    <HelperText
                      type="error"
                      visible={!!errors.name && !!touched.name}
                    >
                      {errors.name}
                    </HelperText>
                  )}

                  <View style={tw`mt-2`}>
                    <DropDown
                      label={"Единица измерения"}
                      mode={"flat"}
                      visible={showDropDown}
                      showDropDown={() => setShowDropDown(true)}
                      onDismiss={() => setShowDropDown(false)}
                      value={values.measurement}
                      setValue={handleChange("measurement")}
                      list={listMeas?.map((measure) => ({
                        label: measure.name,
                        value: measure.id.toString(),
                      }))}
                    />
                  </View>

                  <View style={tw`mt-2`}>
                    <DropDown
                      label={"Иконка"}
                      mode={"flat"}
                      visible={showDropDownIcon}
                      showDropDown={() => setShowDropDownIcon(true)}
                      onDismiss={() => setShowDropDownIcon(false)}
                      value={values.icon}
                      setValue={handleChange("icon")}
                      list={iconList}
                      dropDownItemStyle={tw`flex flex-row justify-between items-center`}
                    />
                  </View>

                  <TextInput
                    style={tw`mt-2`}
                    label={"Стоимость"}
                    mode="flat"
                    keyboardType="decimal-pad"
                    onBlur={handleBlur("price")}
                    onChangeText={handleChange("price")}
                    value={values.price}
                    error={!!errors.price && !!touched.price}
                  />
                  {!!errors.price && !!touched.price && (
                    <HelperText
                      type="error"
                      visible={!!errors.price && !!touched.price}
                    >
                      {errors.price}
                    </HelperText>
                  )}

                  <TextInput
                    style={tw`mt-2`}
                    label={"Цвет"}
                    mode="flat"
                    onBlur={handleBlur("color")}
                    onChangeText={handleChange("color")}
                    value={values.color}
                    error={!!errors.color && !!touched.color}
                  />
                  {!!errors.color && !!touched.color && (
                    <HelperText
                      type="error"
                      visible={!!errors.color && !!touched.color}
                    >
                      {errors.color}
                    </HelperText>
                  )}
                </View>
              </Dialog.Content>
              <Dialog.Actions>
                <Button mode="contained" onPress={hideDialog}>
                  Назад
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  disabled={!isValid || isLoadingNewCat}
                  loading={isLoadingNewCat}
                  color="#FFB703"
                  style={tw`ml-2`}
                  labelStyle={tw`text-white`}
                >
                  Добавить
                </Button>
              </Dialog.Actions>
            </>
          )}
        </Formik>
      </Dialog>
    </Portal>
  );
}
