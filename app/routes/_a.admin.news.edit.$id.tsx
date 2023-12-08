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
import { createNews, findNewsById } from "~/db/news";
import { storage } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const dataJson = await request.json();
  const method = request.method;

  switch (method) {
    case "POST":
      try {
        const news = await createNews({
          title: dataJson.title,
          content: dataJson.content,
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
    const news = await findNewsById(Number(id));
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
        title: data.title,
        content: data.content,
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
        title: values.title,
        content: values.content,
        coverUrl: values.coverUrl[0].response.data.filepath,
      },
      { method: "POST", encType: "application/json" }
    );
  };

  return (
    <ProCard title="修改新闻">
      <ProForm onFinish={onFinish} initialValues={initialValues}>
        <ProFormText
          name="title"
          label="标题"
          rules={[{ required: true, message: "Please input title!" }]}
        />
        <ProFormTextArea
          name="content"
          label="内容"
          rules={[{ required: true, message: "Please input content!" }]}
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
          rules={[{ required: true, message: "Please upload!" }]}
        ></ProFormUploadButton>
      </ProForm>
    </ProCard>
  );
}
