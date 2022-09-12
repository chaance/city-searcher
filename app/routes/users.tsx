import * as React from "react";
import { Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getUsers } from "~/models/users.server";
import type { UserDeleteActionData } from "~/routes/users/delete.$id";

export async function loader() {
  let users = await getUsers();
  return json({ users });
}

export default function UsersLayout() {
  let { users } = useLoaderData<typeof loader>();
  let deleteFetcher = useFetcher<UserDeleteActionData>();
  let isDeleting = deleteFetcher.state !== "idle";
  return (
    <div className="users-layout">
      <Outlet />
      {users.length > 0 ? (
        <ul className="users-list">
          {users.map((user) => {
            return (
              <li
                className="users-list-item"
                data-deleting={isDeleting || undefined}
                key={user.id}
              >
                <UserCard
                  name={user.name}
                  homeTown={user.homeTown}
                  avatarUrl={user.avatar.url}
                  avatarAlt={user.avatar.alt}
                />
                <deleteFetcher.Form
                  action={`/users/delete/${user.id}`}
                  method="post"
                >
                  <DeleteButton
                    label={`Delete ${user.name}`}
                    disabled={isDeleting}
                  />
                </deleteFetcher.Form>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function UserCard({
  name,
  avatarUrl,
  avatarAlt,
  homeTown,
}: {
  name: string;
  avatarUrl: string;
  avatarAlt: string;
  homeTown: string;
}) {
  return (
    <div className="user-card">
      <img className="user-card-avatar" src={avatarUrl} alt={avatarAlt} />
      <div className="user-card-details">
        <h2 className="user-card-name">{name}</h2>
        <p className="user-card-hometown">{homeTown}</p>
      </div>
    </div>
  );
}

function DeleteButton({
  label,
  disabled,
}: {
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      className="user-delete-button button-reset"
      title={label}
      disabled={disabled}
    >
      <span className="visually-hidden">{label}</span>
      <svg
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
