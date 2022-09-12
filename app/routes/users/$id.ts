import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getUser } from "~/models/users.server";

export async function loader({ params }: LoaderArgs) {
  let userId = params.id;
  if (!userId || typeof userId !== "string") {
    throw json("Invalid user ID", 400);
  }

  let user = await getUser(userId);
  if (!user) {
    throw json("User not found", 404);
  }

  return json(user, {
    headers: {
      "Cache-Control": "max-age=60",
    },
  });
}

export type UserSearchLoaderData = SerializeFrom<typeof loader>;
