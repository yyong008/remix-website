import {
  ProCard,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from "@ant-design/pro-components";
import { json, type ActionFunction } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import { createProduction } from "~/db/production";

export const action: ActionFunction = async ({ request }) => {
  const dataJson = await request.json();
  const method = request.method;

  switch (method) {
    case "POST":
      try {
        const news = await createProduction({
          name: dataJson.name,
          desc: dataJson.desc,
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
    <ProCard title="创建产品">
      <ProForm onFinish={onFinish}>
        <ProFormText
          name="name"
          label="产品名"
          rules={[{ required: true, message: "Please input desc!" }]}
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
          rules={[{ required: true, message: "Please upload image!" }]}
        />
      </ProForm>
    </ProCard>
  );
}
