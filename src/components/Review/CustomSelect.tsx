import { selectType} from '@/app/(auth-required)/main/info/course-reviews/write-review/type';
import { SetStateAction } from 'react';
import Select, { GroupBase, OptionsOrGroups } from 'react-select'

type CustomSelectType = {
  options?: OptionsOrGroups<any, GroupBase<any>>;
  onChange?: (
    value: SetStateAction<selectType>
  ) => void;
  value?: any;
  isSearchable?: boolean;
  minWidth?: number;
  inverted?: boolean;
  rounded?: boolean;
};

const CustomSelect = ({
  options,
  onChange,
  value,
  isSearchable,
  minWidth,
  inverted = false,
  rounded = false,
}: CustomSelectType) => {
  const SelectBarCustomStyle = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: inverted
        ? value.value === ""
          ? "white"
          : "#0D99FF"
        : "white", // 파란색 배경
      color: inverted ? "white" : "black",
      borderRadius: rounded ? "9999px" : "5px", // Tailwind의 rounded-full
      border: inverted ? (value.value === '' ? "" : "none") : "1px solid #E5E7EB", // 테두리 제거
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "3px 5px",
      minHeight: "40px",
      boxShadow: state.isFocused ? "rgba(13, 153, 255)" : "none",
      minWidth: minWidth ? `${minWidth}rem` : "100%",
      // maxWidth: minWidth ? `${minWidth}rem` : "100%",
      marginRight: "5px",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: inverted ? (value.value === "" ? "black" : "white") : "#0D99FF", // 선택된 값의 색상 변경
      textAlign: inverted ? "center" : "start",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: inverted ? (value.value === "" ? "black" : "white") : "black", // 화살표 색상 변경
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "8px",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: inverted
        ? state.isSelected
          ? "#0D99FF"
          : "white"
        : state.isSelected
        ? "#0D99FF"
        : "white",
      color: inverted
        ? state.isSelected
          ? "white"
          : "#111827"
        : state.isSelected
        ? "white"
        : "#111827",
      padding: "10px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: inverted ? "#E5E7EB" : "#0D99FF",
      },
    }),
  };
  
  return (
    <Select
      styles={SelectBarCustomStyle}
      options={options}
      onChange={(selected) => onChange(selected)}
      value={value}
      isSearchable={isSearchable}
    />
  );
};

export { CustomSelect };