export interface User {
  id: number;
  name: string;
  avatar: {
    url: string;
    alt: string;
  };
  homeTown: string;
}

export function isValidUserId(val: any): val is number {
  return typeof val === "number" && Number.isInteger(val);
}

export function isValidUser(user: any): user is User {
  return !!(
    user &&
    typeof user === "object" &&
    typeof user.id === "number" &&
    typeof user.name === "string" &&
    typeof user.avatar === "object" &&
    typeof user.avatar.url === "string" &&
    typeof user.avatar.alt === "string" &&
    typeof user.homeTown === "string"
  );
}

export function isValidNewUser(user: any): user is Omit<User, "id"> {
  return !!(
    user &&
    typeof user === "object" &&
    typeof user.name === "string" &&
    typeof user.avatar === "object" &&
    typeof user.avatar.url === "string" &&
    typeof user.avatar.alt === "string" &&
    typeof user.homeTown === "string"
  );
}
