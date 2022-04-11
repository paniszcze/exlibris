import { useAuthContext } from "../../hooks/useAuthContext";

export default function Home() {
  const { user } = useAuthContext();

  return (
    <div>
      <h2 className="page-title">Witaj, {user.displayName}</h2>
      <p>
        Masz <strong>{user.bookCount}</strong> książki w{" "}
        <strong>{user.catalogueCount}</strong>{" "}
        {user.catalogueCount === "1" ? "katalogu" : "katalogach"}
      </p>
    </div>
  );
}
