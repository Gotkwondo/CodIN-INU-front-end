import { selectType} from '@/app/(auth-required)/main/info/course-reviews/write-review/type';
import React, { MemoExoticComponent } from 'react';
import { SetStateAction } from 'react';
import { BiFontSize } from 'react-icons/bi';
import Select, { GroupBase, OptionsOrGroups } from 'react-select'
import { ValueContainer } from 'react-select/animated';

type CustomSelectType = {
  options?: OptionsOrGroups<any, GroupBase<any>>;
  onChange?: (
    value: any
  ) => void;
  value?: any;
  isSearchable?: boolean;
  minWidth?: number;
  inverted?: boolean;
  rounded?: boolean;
};

type SelectBarType = {
  children: React.ReactNode;
};

const CustomSelect = React.memo(({
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
          ? "#EBF0F7"
          : "#0D99FF"
        : "white", // 파란색 배경
      color: inverted ? "white" : "black",
      borderRadius: rounded ? "9999px" : "5px", // Tailwind의 rounded-full
      border: inverted ? "none" : "1px solid #E5E7EB", // 테두리 제거
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: rounded? "0px" : "6px 3px",
      minHeight: "40px",
      boxShadow: state.isFocused ? "rgba(13, 153, 255)" : "none",
      minWidth: minWidth ? `${minWidth}px` : "100%",
      // maxWidth: minWidth ? `${minWidth}rem` : "100%",
      marginRight: "5px",
      fontSize: "14px",
      fontWeight: "medium",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: inverted
        ? value.value === ""
          ? "black"
          : "white"
        : value.value === ""
        ? "#A9ADAE"
        : "#0D99FF", // 선택된 값의 색상 변경
      textAlign: inverted ? "center" : "start",
      paddingLeft : rounded ? "8px" : "",
      
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      paddingLeft: "0px",
      paddingRight: "8px",
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
      fontSize: "14px",
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: "none",
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
});


const SelectOptionBar = ({ children }: SelectBarType) => {
  return <div className="w-full flex pt-[18px]">{children}</div>;
};

const SelectDepartmentBar = ({ children }: SelectBarType) => { 
  return (
    <div className="mt-5">{children}</div>
  );
}

export { CustomSelect, SelectOptionBar, SelectDepartmentBar };