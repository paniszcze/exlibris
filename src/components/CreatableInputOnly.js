import CreatableSelect from "react-select/creatable";
import { createOption, customStyles, customTheme } from "../utils/select";

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
          let label = prevState.inputValue.trim().replace(/\s+/g, " ");
          if (prevState.value.some((item) => label === item.label)) {
            return {
              inputValue: "",
              value: [...prevState.value],
            };
          } else {
            return {
              inputValue: "",
              value: [...prevState.value, createOption(label)],
            };
          }
        });
        event.preventDefault();
      // no default
    }
  };

  return (
    <CreatableSelect
      components={{
        DropdownIndicator: null,
      }}
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
