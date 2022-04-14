const replacementColors = {
  primary: "#6a8d73",
  primary75: "#8ba792",
  primary50: "#aec2b3",
  primary25: "#d0dcd3",
  danger: "#ff5666",
  dangerLight: "#ffc2c8",
};

export const customStyles = {
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
