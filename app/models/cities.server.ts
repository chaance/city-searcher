import { matchSorter } from "match-sorter";
import { getRandomInt } from "~/utils";
import { cities } from "./city-data";
import type { City } from "./city-data";

export async function searchCities(query: string): Promise<City[]> {
  await new Promise((res) => setTimeout(res, getRandomInt(500, 1500)));
  return query.trim() === ""
    ? []
    : matchSorter(cities, query, {
        keys: [(item) => `${item.city}, ${item.state}`],
      });
}
