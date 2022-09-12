export interface City {
  id: number;
  city: string;
  state: string;
}

export function isValidCityId(val: any): val is number {
  return typeof val === "number" && Number.isInteger(val);
}

export function isValidCity(val: any): val is City {
  return !!(
    val &&
    typeof val === "object" &&
    typeof val.id === "number" &&
    typeof val.city === "string" &&
    typeof val.state === "string"
  );
}

export function isValidNewCity(val: any): val is City {
  return !!(
    val &&
    typeof val === "object" &&
    typeof val.city === "string" &&
    typeof val.state === "string"
  );
}
