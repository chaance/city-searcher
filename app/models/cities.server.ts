import type { City } from "./cities.types";
import { matchSorter } from "match-sorter";
import { getRandomInt } from "~/utils";
import { db } from "~/db.server";

export async function searchCities(query: string): Promise<City[]> {
  await new Promise((res) => setTimeout(res, getRandomInt(500, 1500)));
  let cities = await getCities();
  return query.trim() === ""
    ? []
    : matchSorter(cities, query, {
        keys: [(item) => `${item.city}, ${item.state}`],
      });
}

export async function getCities(opts?: {
  limit?: number;
  page?: number;
}): Promise<City[]> {
  let limit = opts?.limit;
  let page = opts?.page ?? 1;
  let cities: City[];
  if (limit != null) {
    cities = await db.cities.getSome({ limit, page });
  } else {
    cities = await db.cities.getAll();
  }
  return cities.sort((a, b) => a.id - b.id);
}
