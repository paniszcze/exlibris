import "./LoadingSpinner.css";

export default function LoadingSpinner() {
  return (
    <div className="spinner">
      <div className="rotate">
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}
