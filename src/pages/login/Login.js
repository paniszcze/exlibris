import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isPending } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h2>Zaloguj</h2>
      <label>
        <span>E-mail:</span>
        <input
          required
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>
      <label>
        <span>Hasło:</span>
        <input
          required
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </label>
      {!isPending && <button className="btn">Zaloguj</button>}
      {isPending && (
        <button className="btn" disabled>
          Loguję...
        </button>
      )}
      {error && <div className="error">{error}</div>}
    </form>
  );
}
