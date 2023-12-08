import {
  ProCard,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from "@ant-design/pro-components";
import {
  json,
  type ActionFunction,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useSubmit,
} from "@remix-run/react";
import { useMemo } from "react";
import { createProduction, findProductionById } from "~/db/production";
import { storage } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const dataJson = await request.json();
  const method = request.method;

  switch (method) {
    case "POST":
      try {
        const news = await createProduction({
          desc: dataJson.desc,
          name: dataJson.title,
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

  const initialValues = useMemo(() => {
    if (loaderData && loaderData.data) {
      const data = loaderData.data as any;
      return {
        desc: data.desc,
        name: data.title,
        coverUrl: [
          {
            uid: "XX",
            name: "xxx.png",
            status: "done",
            url: data.coverUrl,
          },
        ],
      };
    } else {
      return {};
    }
  }, [loaderData]);

  if (!id) {
    navigate(-1);
    return;
  }

  const onFinish = async (values: any) => {
    submit(
      {
        name: values.name,
        desc: values.desc,
        coverUrl: values.coverUrl[0].response.data.filepath,
      },
      { method: "POST", encType: "application/json" }
    );
  };

  return (
    <ProCard title="编辑产品">
      <ProForm onFinish={onFinish} initialValues={initialValues}>
        <ProFormText
          name="name"
          label="产品名"
          rules={[{ required: true, message: "Please input name!" }]}
        />
        <ProFormTextArea
          name="desc"
          label="描述"
          rules={[{ required: true, message: "Please input desc!" }]}
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
      </ProForm>
    </ProCard>
  );
}
