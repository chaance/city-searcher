import type { ActionArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { deleteUser } from "~/models/users.server";
import { wait } from "~/utils";

export async function action({ params }: ActionArgs) {
  await wait(500);
  throw json("Not implemented", 501);
}

export type UserDeleteActionData = SerializeFrom<typeof action>;
