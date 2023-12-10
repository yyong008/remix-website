import {
  ProCard,
  ProForm,
  ProFormText,
  ProFormUploadButton,
} from "@ant-design/pro-components";
import { json, type ActionFunction } from "@remix-run/node";
import { useActionData, useSubmit } from "@remix-run/react";
import { message } from "antd";
import { useEffect } from "react";
import TinyMCE from "~/components/TinyMCEEditor";
import { createNews } from "~/db/news";

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

export default function NewsEdit() {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const onFinish = async (values: any) => {
    submit(
      {
        title: values.title,
        content: values.content,
        coverUrl: values.coverUrl[0].response.data.filepath,
      },
      { method: "POST", encType: "application/json" },
    );
  };

  useEffect(() => {
    if (actionData && actionData.code === 1) {
      message.error(actionData.message);
    } else if (actionData && actionData.code === 0) {
      message.info(actionData.message);
    }
  }, [actionData]);

  return (
    <ProCard title="创建新闻">
      <ProForm onFinish={onFinish}>
        <ProFormText
          name="title"
          label="标题"
          rules={[{ required: true, message: "Please input title!" }]}
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
          rules={[{ required: true, message: "Please upload image!" }]}
        />
        <ProForm.Item
          name="content"
          label="内容"
          rules={[{ required: true, message: "Please input content!" }]}
        >
          <TinyMCE />
        </ProForm.Item>
      </ProForm>
    </ProCard>
  );
}
