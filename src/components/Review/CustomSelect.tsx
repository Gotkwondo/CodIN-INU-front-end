import { selectType } from '@/app/(auth-required)/main/info/course-reviews/write-review/type';
import { SetStateAction } from 'react';
import Select, { GroupBase, OptionsOrGroups } from 'react-select'

type CustomSelectType = {
  options?: OptionsOrGroups<any, GroupBase<any>>;
  onChange?: (value: SetStateAction<selectType>) => void;
  value?: any;
  isSearchable?: boolean;
  minWidth?: number;
};

const CustomSelect = ({options, onChange, value, isSearchable, minWidth}:CustomSelectType) => {
  const SelectBarCustomStyle = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "#0D99FF", // 파란색 배경
      color: "white",
      borderRadius: "9999px", // Tailwind의 rounded-full
      border: "none", // 테두리 제거
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "3px 5px",
      minHeight: "40px",
      boxShadow: state.isFocused ? "rgba(13, 153, 255)" : "none",
      minWidth: `${minWidth}rem`,
      marginRight: "5px",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "white", // 선택된 값의 색상 변경
      textAlign: "center",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "white", // 화살표 색상 변경
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "8px",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#0D99FF" : "white",
      color: state.isSelected ? "white" : "#111827",
      padding: "10px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#E5E7EB",
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
}

export { CustomSelect };