import type { ActionFunctionArgs } from "@remix-run/node";

import {
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  json,
} from "@remix-run/node";
import { storage } from "~/utils/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await storage.getSession(request.headers.get("Cookie"));

  if (!session.has("userId")) {
    return json({ code: 1, data: [], message: "请登录" });
  }

  try {
    const uploadHandler = unstable_composeUploadHandlers(
      unstable_createFileUploadHandler({
        maxPartSize: 5_000_000,
        file: ({ filename }) => filename,
        directory: process.cwd() + "/public/upload",
      }),
      unstable_createMemoryUploadHandler()
    );
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler
    );

    const file = formData.get("file") as any;
    const filepath =
      request.url.split("upload").join("") + "upload/" + file.name;

    const data = {
      filepath,
      type: file.type,
      name: file.name,
    };
    return json({ code: 0, data, message: "ok" });
  } catch (error) {
    return json({ code: 1, data: [], message: error?.toString() });
  }
};
