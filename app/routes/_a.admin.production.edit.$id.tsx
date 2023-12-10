import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";

import {
  ProCard,
  ProForm,
  ProFormText,
  ProFormUploadButton,
} from "@ant-design/pro-components";
import { json, redirect } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useParams,
  useSubmit,
} from "@remix-run/react";
import { message } from "antd";
import { useEffect, useMemo } from "react";
import TinyMCE from "~/components/TinyMCEEditor";
import { findProductionById, updateProductionById } from "~/db/production";
import { storage } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const dataJson = await request.json();
  const method = request.method;
  console.log("dataJson", dataJson);

  switch (method) {
    case "PUT":
      try {
        const news = await updateProductionById({
          id: dataJson.id,
          desc: dataJson.desc,
          name: dataJson.name,
          coverUrl: dataJson.coverUrl,
        });

        return json({ code: 0, message: "ok", data: news });
      } catch (error: any) {
        return json({ code: 1, message: error?.message?.toString(), data: [] });
      }
    default:
      break;
  }
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await storage.getSession(request.headers.get("Cookie"));

  if (!session.has("userId")) {
    return redirect("/login");
  }

  const { id } = params;

  try {
    const news = await findProductionById(Number(id));
    return json({ code: 0, message: "ok", data: news });
  } catch (error: any) {
    return json({ code: 1, message: error?.message?.toString(), data: [] });
  }
};

export default function NewsEdit() {
  const submit = useSubmit();
  const { id } = useParams();
  const navigate = useNavigate();
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const initialValues = useMemo(() => {
    if (loaderData && loaderData.data) {
      const data = loaderData.data as any;
      return {
        desc: data.desc,
        name: data.name,
        coverUrl: [
          {
            uid: "XX",
            name: data.coverUrl,
            status: "done",
            response: {
              data: {
                filepath: data.coverUrl,
              },
            },
            url: data.coverUrl,
          },
        ],
      };
    } else {
      return {};
    }
  }, [loaderData]);

  const onFinish = async (values: any) => {
    const dataJson = {
      id: Number(id),
      name: values.name,
      desc: values.desc,
      coverUrl: values.coverUrl[0]?.response?.data?.filepath,
    };
    submit(dataJson, { method: "PUT", encType: "application/json" });
  };

  useEffect(() => {
    if (actionData && actionData.code === 1) {
      message.error(actionData.message);
    } else if (actionData && actionData.code === 0) {
      message.info(actionData.message);
    }
  }, [actionData]);

  if (!id) {
    navigate(-1);
    return;
  }

  return (
    <ProCard title="编辑产品">
      <ProForm onFinish={onFinish} initialValues={initialValues}>
        <ProFormText
          name="name"
          label="产品名"
          rules={[{ required: true, message: "Please input name!" }]}
        />
        <ProFormUploadButton
          name="coverUrl"
          label="封面"
          max={1}
          action="/upload"
          fieldProps={{
            multiple: false,
            name: "file",
            listType: "picture-card",
            accept: "image/png, image/jpeg",
            headers: {
              timestamp: new Date().valueOf() + "",
            },
            onChange: (e) => {
              // handleChange(e)
            },
          }}
          extra="只能上传jpg/png文件,且不大于3MB"
        />
        <ProForm.Item
          name="desc"
          label="描述"
          rules={[{ required: true, message: "Please input desc!" }]}
        >
          <TinyMCE />
        </ProForm.Item>
      </ProForm>
    </ProCard>
  );
}
