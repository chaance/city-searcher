import * as path from "node:path";
import * as fs from "node:fs/promises";
import type { User } from "~/models/users.types";
import type { City } from "~/models/cities.types";

// In a real app we'd be working w/ a database, just keeping things simple for
// the demo here!
const DATA_PATH = path.resolve(".", "data");
const dataCache = new Map<keyof TableMap, Array<TableMap[keyof TableMap]>>();

type TableMap = {
  users: User;
  cities: City;
};

class DB {
  static async getAll<T extends keyof TableMap>(
    tableName: T
  ): Promise<TableMap[T][]> {
    let cacheValue = getCacheValue(tableName);
    if (cacheValue) {
      return cacheValue;
    }
    try {
      console.log(DATA_PATH);
      let contents = await fs.readFile(
        path.join(DATA_PATH, `${tableName}.json`),
        "utf8"
      );
      let data = JSON.parse(contents);
      dataCache.set(tableName, data);
      return data;
    } catch (err) {
      throw Error(`Table ${tableName} not found`);
    }
  }
  static async getOne<T extends keyof TableMap>(
    tableName: T,
    id: TableMap[T]["id"]
  ): Promise<TableMap[T] | null> {
    let all = await DB.getAll(tableName);
    return all.find((item) => item.id === id) ?? null;
  }
  static async create<T extends keyof TableMap>(
    tableName: T,
    item: Omit<TableMap[T], "id">
  ): Promise<TableMap[T]> {
    let all = await DB.getAll(tableName);
    let id = Math.max(...all.map((item) => item.id)) + 1;
    let newItem = {
      id,
      ...item,
    } as TableMap[T];
    all.push(newItem);
    await DB.save(tableName, all);
    return newItem;
  }
  static async delete<T extends keyof TableMap>(
    tableName: T,
    id: TableMap[T]["id"]
  ): Promise<TableMap[T] | null> {
    let all = await DB.getAll(tableName);
    let index = all.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }
    let deleted = all.splice(index, 1)[0];
    await DB.save(tableName, all);
    return deleted;
  }
  static async update<T extends keyof TableMap>(
    tableName: T,
    id: TableMap[T]["id"],
    item: Partial<TableMap[T]>
  ): Promise<TableMap[T]> {
    let all = await DB.getAll(tableName);
    let index = all.findIndex((item) => item.id === id);
    if (index === -1) {
      throw Error(`Item with id ${id} not found`);
    }
    let updated = {
      ...all[index],
      ...item,
    };
    all[index] = updated;
    await DB.save(tableName, all);
    return updated;
  }
  static async save<T extends keyof TableMap>(
    tableName: T,
    data: TableMap[T][]
  ): Promise<void> {
    let contents = JSON.stringify(data, null, 2);
    dataCache.set(tableName, data);
    await fs.writeFile(path.join(DATA_PATH, `${tableName}.json`), contents);
  }
}

class DBTable<T extends keyof TableMap> {
  constructor(private tableName: T) {}

  async getAll(): Promise<TableMap[T][]> {
    return await DB.getAll(this.tableName);
  }
  async getSome(opts?: {
    limit?: number;
    page?: number;
  }): Promise<TableMap[T][]> {
    let limit = opts?.limit ?? 10;
    let page = opts?.page ?? 1;
    let start = (page - 1) * limit;
    let end = start + limit;
    return (await this.getAll()).slice(start, end);
  }
  async get(id: number): Promise<TableMap[T] | null> {
    return await DB.getOne(this.tableName, id);
  }
  async create(data: Omit<TableMap[T], "id">): Promise<TableMap[T]> {
    return await DB.create(this.tableName, data);
  }
  async delete(id: number): Promise<TableMap[T] | null> {
    return await DB.delete(this.tableName, id);
  }
  async update(
    id: number,
    data: Omit<Partial<TableMap[T]>, "id">
  ): Promise<TableMap[T]> {
    return await DB.update(this.tableName, id, data as any);
  }
}

export const db = {
  users: new DBTable("users"),
  cities: new DBTable("cities"),
};

function getCacheValue<T extends keyof TableMap>(key: T) {
  return dataCache.get(key) as Array<TableMap[T]> | undefined;
}
