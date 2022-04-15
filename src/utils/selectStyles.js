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
