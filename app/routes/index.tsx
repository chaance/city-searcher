import * as React from "react";
import {
  Combobox,
  ComboboxItem,
  ComboboxPopover,
  useComboboxState,
} from "ariakit/combobox";
import { Form, useSearchParams } from "@remix-run/react";
import type { City } from "~/models/city-data";
import { cities } from "~/models/city-data";
import { matchSorter } from "match-sorter";

export default function Index() {
  let [term, setTerm] = React.useState("");
  let cities = useCityMatch(term);
  let [searchParams] = useSearchParams();
  let combobox = useComboboxState({ gutter: 8, sameWidth: true });

  return (
    <div className="search-route">
      <Form className="search-form">
        <div className="field-wrapper">
          <label htmlFor="showSearch">City</label>
          <div className="combobox-wrapper">
            <Combobox
              state={combobox}
              id="showSearch"
              placeholder="San Diego, California"
              name="city"
              className="combobox"
              onChange={(e) => {
                setTerm(e.target.value);
              }}
            />
          </div>
          {cities.length > 0 ? (
            <ComboboxPopover state={combobox} className="popover">
              {cities.slice(0, 20).map((result, index) => {
                return (
                  <ComboboxItem
                    key={index}
                    className="combobox-item"
                    value={`${result.city}, ${result.state}`}
                  >
                    {result.city}, {result.state}
                  </ComboboxItem>
                );
              })}
            </ComboboxPopover>
          ) : null}
        </div>
        <div>
          <button className="button">Submit</button>
        </div>
        <div aria-live="polite">
          {searchParams.has("city") ? (
            <span>
              Selected: <span>{searchParams.get("city")}</span>
            </span>
          ) : null}
        </div>
      </Form>
    </div>
  );
}

function useCityMatch(term: string): City[] {
  return React.useMemo(
    () =>
      term.trim() === ""
        ? []
        : matchSorter(cities, term, {
            keys: [(item) => `${item.city}, ${item.state}`],
          }),
    [term]
  );
}
