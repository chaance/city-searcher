import type { User } from "./users.types";
import { matchSorter } from "match-sorter";
import { getRandomInt } from "~/utils";
import { db } from "~/db.server";

export async function searchUsers(query: string): Promise<User[]> {
  await new Promise((res) => setTimeout(res, getRandomInt(500, 1500)));
  let users = await getUsers();
  return query.trim() === ""
    ? []
    : matchSorter(users, query, {
        keys: [(item) => item.name],
      });
}

export async function getUser(id: string | number): Promise<User | null> {
  id = parseUserId(id);
  return (await db.users.get(id)) || null;
}

export async function getUsers(opts?: {
  limit?: number;
  page?: number;
}): Promise<User[]> {
  let limit = opts?.limit;
  let page = opts?.page ?? 1;
  let users: User[];
  if (limit != null) {
    users = await db.users.getSome({ limit, page });
  } else {
    users = await db.users.getAll();
  }
  return users.sort((a, b) => a.id - b.id);
}

export async function createUser(user: Omit<User, "id">): Promise<User> {
  let newUser = await db.users.create(user);
  return newUser;
}

export async function deleteUser(id: string | number): Promise<User | null> {
  id = parseUserId(id);
  let deleted = await db.users.delete(id);
  return deleted;
}

export async function updateUser(
  id: string | number,
  data: Partial<Omit<User, "id">>
): Promise<User> {
  id = parseUserId(id);
  let updated = await db.users.update(id, data);
  return updated;
}

export type { User };

function parseUserId(id: string | number): number {
  if (typeof id === "string") {
    return parseInt(id);
  } else {
    return id;
  }
}
