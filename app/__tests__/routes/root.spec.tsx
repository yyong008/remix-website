import { json } from "@remix-run/node";
import { createRemixStub } from "@remix-run/testing";
import { render } from "@testing-library/react";
import { test, expect } from "vitest";
import Root from "../../root";

test("renders loader data", async () => {
  const RemixStub = createRemixStub([
    {
      path: "/",
      Component: Root,
      loader() {
        return json({ message: "hello" });
      },
    },
  ]);

  const r = render(<RemixStub />);

  expect(r.container).toMatchInlineSnapshot(`<div />`);
  expect(r.baseElement).toMatchInlineSnapshot(`
    <body>
      <div />
    </body>
  `);
});
