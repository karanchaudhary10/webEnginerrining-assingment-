import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { useCreateUser } from "../hooks/useCreateUser";
import { Button } from "../components/ui/Button";
import UserCard from "../components/UserCard";

export default function Users() {
  const {
    data: users,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useUsers();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const createUserMutation = useCreateUser();

  const handleSubmit = (e) => {
    e.preventDefault();

    createUserMutation.mutate({
      name,
      email,
    });

    setName("");
    setEmail("");
  };

  if (isPending) {
    return <p role="status">Loading users...</p>;
  }

  if (isError) {
    return (
      <p role="alert">
        Failed: {error.message}
        <Button onClick={refetch}>Retry</Button>
      </p>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-6">
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <br />

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={createUserMutation.isPending}
        >
          {createUserMutation.isPending
            ? "Adding..."
            : "Add User"}
        </button>

        {createUserMutation.isError && (
          <p style={{ color: "red" }}>
            {createUserMutation.error.message}
          </p>
        )}
      </form>

      {isFetching && (
        <small>Refreshing...</small>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => (
          <li key={u.id}>
            <UserCard user={u} />
          </li>
        ))}
      </ul>
    </>
  );
}