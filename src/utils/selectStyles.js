const replacementColors = {
  primary: "#6a8d73",
  primary75: "#8ba792",
  primary50: "#aec2b3",
  primary25: "#d0dcd3",
  danger: "#ff5666",
  dangerLight: "#ffc2c8",
};

export const customStyles = {
  placeholder: (provided) => {
    const fontStyle = "italic";
    const opacity = 0.5;
    return { ...provided, fontStyle, opacity };
  },
  multiValue: (provided) => {
    const borderRadius = "3px";
    return { ...provided, borderRadius };
  },
};

export const customTheme = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    ...replacementColors,
  },
});
