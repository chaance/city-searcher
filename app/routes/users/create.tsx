import * as React from "react";
import {
  Combobox,
  ComboboxItem,
  ComboboxPopover,
  useComboboxState,
} from "ariakit/combobox";
import type { ActionArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useFetcher, useTransition } from "@remix-run/react";
import { createUser } from "~/models/users.server";
import { isValidNewUser } from "~/models/users.types";
import { isUrl, wait } from "~/utils";
import type { CitySearchLoaderData } from "~/routes/cities.search";

export async function action({ request }: ActionArgs) {
  // form fields: { name, avatarUrl, avatarAlt, homeTown }
  await wait(800);
  return json({});
}

export default function CreateUser() {
  let combobox = useComboboxState({ gutter: 8, sameWidth: true });
  let formRef = React.useRef<HTMLFormElement>(null);

  // ...what is this boi? 👀
  let cityFetcher = useFetcher<CitySearchLoaderData>();

  let transition = { state: "idle", type: "idle" };
  let isBusy = transition.state !== "idle";

  useFormReset(formRef, transition, combobox.setValue);

  return (
    <div className="users-create-route">
      <h1>New User</h1>
      <Form className="form" method="post" ref={formRef}>
        <div className="field-wrapper">
          <label htmlFor="field-name">Name</label>
          <input
            type="text"
            id="field-name"
            name="name"
            placeholder="Joe Camel"
            className="field"
            required
            disabled={isBusy || undefined}
          />
        </div>

        <div className="field-wrapper">
          <label htmlFor="field-avatar">Avatar</label>
          <input
            type="url"
            id="field-avatar"
            name="avatarUrl"
            placeholder="https://link.to/avatar.png"
            className="field"
            required
            disabled={isBusy || undefined}
            onBlur={(e) => {
              let input = e.target.value;
              if (!isUrl(input)) {
                // try to transform the value into a valid URL, but if it fails
                // do nothing and rely on browser validation upon submission
                try {
                  let url = new URL(`https://${input}`);
                  e.target.value = url.toString();
                } catch (error) {}
              }
            }}
          />
        </div>

        <div className="field-wrapper">
          <label htmlFor="field-hometown">Home Town</label>
          <div className="combobox-wrapper">
            <Combobox
              state={combobox}
              id="field-hometown"
              placeholder="Boston, Massachusetts"
              name="homeTown"
              className="field combobox"
              onChange={(e) => {
                // When the input changes, load the cities
                cityFetcher.load(`/cities/search?q=${e.target.value}`);
              }}
              required
              disabled={isBusy || undefined}
            />
            <LoadingIndicator isLoading={cityFetcher.state === "loading"} />
          </div>
          {cityFetcher.data && cityFetcher.data.length > 0 ? (
            <ComboboxPopover state={combobox} className="combobox-popover">
              {cityFetcher.data.map((result, index) => {
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
      </Form>
    </div>
  );
}

function LoadingIndicator({ isLoading }: { isLoading: boolean }) {
  return (
    <div aria-live="polite" aria-busy={isLoading || undefined}>
      <span className="visually-hidden">
        {isLoading ? "Loading..." : "Ready"}
      </span>
      {isLoading ? <Spinner className="spinner" aria-hidden /> : null}
    </div>
  );
}

function Spinner(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 4v5h-.582m0 0a8.001 8.001 0 00-15.356 2m15.356-2H15M4 20v-5h.581m0 0a8.003 8.003 0 0015.357-2M4.581 15H9"
      />
    </svg>
  );
}

export type UserCreateActionData = SerializeFrom<typeof action>;

function useFormReset(
  formRef: React.RefObject<HTMLFormElement>,
  transition: { type: string },
  setValue: (val: string) => any
) {
  React.useEffect(() => {
    if (transition.type === "actionReload") {
      formRef.current?.reset();
      // bug in ariakit: this should be handled by the form reset
      // https://github.com/ariakit/ariakit/issues/1861
      setValue("");

      window.setTimeout(() => {
        let elems = formRef.current?.elements;
        let firstElement = elems?.item(0);
        if (firstElement) {
          (firstElement as HTMLElement).focus();
        }
      }, 10);
    }
  }, [formRef, transition.type, setValue]);
}
