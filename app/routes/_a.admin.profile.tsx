import { ProCard, ProForm, ProFormText } from "@ant-design/pro-components";
import {
  type LoaderFunctionArgs,
  redirect,
  json,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { Button, Col, Row, Upload, message } from "antd";
import { findNewsAll } from "~/db/news";
import { getProductionCount } from "~/db/production";
import { findUserById, updateUserById } from "~/db/user";
import { storage } from "~/utils/session.server";
import * as _icons from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

const { PlusOutlined } = _icons;

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await storage.getSession(request.headers.get("Cookie"));

  if (!session.has("userId")) {
    return redirect("/login");
  }
  const method = request.method;
  const dataJson = await request.json();

  switch (method) {
    case "POST":
      try {
        const newUser = await updateUserById({
          id: Number(dataJson.id),
          name: dataJson.name,
          email: dataJson.email,
          avatar: dataJson.avatar,
        });

        const newUser_ = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
        };

        return json({ code: 0, data: newUser_, message: "ok" });
      } catch (error) {
        return json({ code: 1, data: [], message: error?.message.toString() });
      }

    default:
      break;
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await storage.getSession(request.headers.get("Cookie"));

  if (!session.has("userId")) {
    return redirect("/login");
  }

  const user = await findUserById(Number(session.get("userId")));
  const prodcutionCount = await getProductionCount();
  const { news, count: newsCount } = await findNewsAll();

  return json({
    news,
    newsCount,
    prodcutionCount,
    user: {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar || "/favicon.ico",
    },
  });
};

export default function Profile() {
  const data = useLoaderData<typeof loader>();
  const [uploadedUrl, setUploadedUrl] = useState(data.user.avatar);
  const formRef = useRef<any>();
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  useEffect(() => {
    if (actionData?.code === 0) {
      message.info("设置成功");
      debugger;
    } else if (actionData?.code === 1) {
      message.error(actionData?.message);
    }
  }, [actionData]);

  return (
    <ProCard className="h-[50vh]">
      <ProForm
        formRef={formRef}
        initialValues={{
          name: data?.user?.name,
          email: data?.user?.email,
          avatar: [
            { uid: "-1", name: "name", status: "done", url: data.user.avatar },
          ],
        }}
        onFinish={async (values) => {
          submit(
            {
              id: data?.user?.id,
              name: values.name,
              email: values.email,
              avatar: values.avatar[0].url,
            } as any,
            { method: "POST", encType: "application/json" },
          );
          return Promise.resolve();
        }}
        submitter={false}
        // submitter={{submitButtonProps: { type: 'primary'},resetButtonProps: { style: { display: 'none', }}}}
      >
        <Row>
          <Col span={8} offset={2}>
            <ProForm.Item
              name="avatar"
              label="头像"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
            >
              <Upload
                name="file"
                maxCount={1}
                action="/upload"
                listType="picture-circle"
                onChange={(info) => {
                  if (info.file.status === "removed") {
                    setUploadedUrl("");
                    formRef.current.setFieldsValue({
                      avatar: null,
                    });
                    return;
                  } else if (info.file.status === "done") {
                    debugger;
                    if (info.file.response && info.file.response.code === 0) {
                      setUploadedUrl(info.file.response.data.filepath);
                      formRef.current.setFieldsValue({
                        avatar: [
                          {
                            uid: "-1",
                            name: info.file.response.data.name,
                            status: "done",
                            url: info.file.response.data.filepath,
                          },
                        ],
                      });
                    }
                  }
                }}
                multiple={false}
              >
                {uploadedUrl ? null : uploadButton}
              </Upload>
            </ProForm.Item>
          </Col>
          <div>
            <ProFormText name="name" label="姓名"></ProFormText>
            <ProFormText name="email" label="邮箱"></ProFormText>
          </div>
        </Row>
        <ProForm.Item wrapperCol={{ offset: 2 }}>
          <Button type="primary">提交</Button>
        </ProForm.Item>
      </ProForm>
    </ProCard>
  );
}
