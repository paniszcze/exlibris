import ReactDOM from "react-dom";

import "./Modal.css";
import CloseIcon from "../assets/close_icon.svg";

export default function Modal({ setIsOpen, children }) {
  const handleClickOutside = (e) => {
    if (e.target.className === "modal-backdrop") {
      setIsOpen(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={handleClickOutside}>
      <div className="modal">
        <button className="close" onClick={() => setIsOpen(false)}>
          <img src={CloseIcon} alt="close icon" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
