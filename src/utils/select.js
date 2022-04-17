// REACT SELECT UTILS

// structures
export const emptyMultiInput = {
  inputValue: "",
  value: [],
};

// helper functions
export const createOption = (label, value = label) => {
  return {
    label,
    value,
  };
};

export const createMultiInput = (labelList) => {
  return {
    inputValue: "",
    value: labelList.map((label) => createOption(label)),
  };
};

export const listSelectedValues = (selectState) =>
  [...selectState.value].map((item) => item.value);

// custom theme adjustments
const replacementColors = {
  primary: "#18206f",
  primary75: "#2837b8",
  primary50: "#5865da",
  primary25: "#9ba2e9",
  danger: "#d88373",
  dangerLight: "#f2D5cf",
};

export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: state.isDisabled ? "#fefefe" : "#fff",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontStyle: "italic",
    opacity: 0.5,
  }),
  multiValue: (provided) => ({ ...provided, borderRadius: "3px" }),
};

export const customTheme = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    ...replacementColors,
  },
});
