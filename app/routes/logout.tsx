import { redirect, type ActionFunction } from "@remix-run/node";
import { storage } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const method = request.method;
  const dataJson = await request.json();
  const session = await storage.getSession(request.headers.get("Cookie"));

  switch (method) {
    case "POST":
      if (dataJson.t === "logout") {
        return redirect("/login", {
          headers: {
            "Set-Cookie": await storage.destroySession(session),
          },
        });
      }
      break;
    default:
      break;
  }
};
