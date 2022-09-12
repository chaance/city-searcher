import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { searchCities } from "~/models/cities.server";
import type { City } from "~/models/cities.types";
import { wait } from "~/utils";

const MAX_RESULTS = 16;

export async function loader({ request }: LoaderArgs) {
  await wait(800);
  return json([] as City[]);

  //   let url = new URL(request.url);
  //   let query = url.searchParams.get("q") || "";
  //   let cities = (await searchCities(query)).slice(0, MAX_RESULTS);

  //   return json(cities, {
  //     // Add a little bit of caching so when the user backspaces a value in the
  //     // Combobox, the browser has a local copy of the data and doesn't make a
  //     // request to the server for it. No need to send a client side data fetching
  //     // library that caches results in memory, the browser has this ability
  //     // built-in.
  //     // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
  //     headers: {
  //       // Note that max-age is not the elapsed time since the response was
  //       // received; it is the elapsed time since the response was generated on
  //       // the origin server. So if the other cache(s) — on the network route
  //       // taken by the response — store the response for 100 seconds (indicated
  //       // using the Age response header field), the browser cache would deduct
  //       // 100 seconds from its freshness lifetime.
  //       "Cache-Control": "max-age=60",
  //     },
  //   });
}

export type CitySearchLoaderData = SerializeFrom<typeof loader>;
