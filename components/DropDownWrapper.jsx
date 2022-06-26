import { useState } from "react";
import DropDown from "react-native-paper-dropdown";

export default function DropDownWrapper({
  label,
  mode,
  value,
  list,
  setValue,
  dropDownItemStyle,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  return (
    <DropDown
      label={label}
      mode={mode}
      visible={visible}
      showDropDown={() => setVisible(true)}
      onDismiss={() => setVisible(false)}
      value={value}
      setValue={setValue}
      list={list}
      dropDownItemStyle={dropDownItemStyle}
      {...props}
    />
  );
}
