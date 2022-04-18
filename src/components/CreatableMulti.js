import CreatableSelect from "react-select/creatable";
import { customStyles, customTheme } from "../utils/select";

export default function CreatableMulti({ options, state, setState }) {
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

  return (
    <CreatableSelect
      isMulti
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={options}
      inputValue={state.inputValue}
      value={state.value}
      placeholder="Wybierz z listy lub wpisz i zatwierdź, wciskając enter"
      noOptionsMessage={() => "Brak nazwisk do wyświetlenia"}
      formatCreateLabel={(item) => `Dodaj "${item}"`}
      styles={customStyles}
      theme={customTheme}
    />
  );
}
