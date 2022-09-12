import { Link } from "@remix-run/react";

export default function UsersIndex() {
  return (
    <div className="users-index-route">
      <h1>Users</h1>
      <Link to="create">Create a new user</Link>
    </div>
  );
}
