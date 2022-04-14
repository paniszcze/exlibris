import CreatableSelect from "react-select/creatable";
import { customStyles, customTheme } from "../utils/selectStyles";

const components = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: label,
});

export default function CreatableInputOnly({ state, setState }) {
  const handleChange = (value) => {
    setState((prevState) => {
      return { ...prevState, value };
    });
  };

  const handleInputChange = (inputValue) => {
    setState((prevState) => {
      return { ...prevState, inputValue };
    });
  };

  const handleKeyDown = (event) => {
    if (!state.inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setState((prevState) => {
          return {
            inputValue: "",
            value: [...prevState.value, createOption(state.inputValue)],
          };
        });
        event.preventDefault();
      // no default
    }
  };

  return (
    <CreatableSelect
      components={components}
      inputValue={state.inputValue}
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={handleChange}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder="Wpisz i zatwierdź, wciskając enter"
      value={state.value}
      styles={customStyles}
      theme={customTheme}
    />
  );
}
