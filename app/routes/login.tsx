import type { ActionFunction } from "@remix-run/node";

import { useEffect } from "react";
import { json } from "@remix-run/node";
import { useActionData, useNavigate, useSubmit } from "@remix-run/react";

import { message, theme } from "antd";
import * as _icons from "@ant-design/icons";
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";

// utils
import { hashedPassword } from "~/utils/hash";

// session
import { createUserSession } from "~/utils/session.server";
import { findUserByName } from "~/db/user";
import { ClientOnly } from "remix-utils/client-only";

const { UserOutlined, LockOutlined } = _icons;

export const action: ActionFunction = async ({ request }) => {
  const method = request.method;

  switch (method) {
    case "POST":
      const dataJson = await request.json();
      const user: any = await findUserByName(dataJson.name);

      if (user && user.password === dataJson.password) {
        return createUserSession(String(user.id), "/admin/dashboard");
      } else {
        return json({ code: 0, data: [], message: "没有此用户" });
      }

    default:
      break;
  }
};

function AdminLogin() {
  const { token } = theme.useToken();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    values.password = hashedPassword(values.password);

    submit(values, { method: "POST", encType: "application/json" });
  };

  useEffect(() => {
    if (actionData) {
      message.info(actionData.message);
    }
  }, [actionData, navigate]);
  return (
    <div>
      <LoginForm
        logo="/favicon.ico"
        title="管理端"
        subTitle="用户登录"
        onFinish={onFinish}
      >
        <ProFormText
          name="name"
          fieldProps={{
            size: "large",
            prefix: <UserOutlined className={"prefixIcon"} />,
          }}
          placeholder={"用户名: admin or user"}
          rules={[
            {
              required: true,
              message: "请输入用户名!",
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: "large",
            prefix: <LockOutlined className={"prefixIcon"} />,
            strengthText:
              "Password should contain numbers, letters and special characters, at least 8 characters long.",

            statusRender: (value) => {
              const getStatus = () => {
                if (value && value.length > 12) {
                  return "ok";
                }
                if (value && value.length > 6) {
                  return "pass";
                }
                return "poor";
              };
              const status = getStatus();
              if (status === "pass") {
                return (
                  <div style={{ color: token.colorWarning }}>强度：中</div>
                );
              }
              if (status === "ok") {
                return (
                  <div style={{ color: token.colorSuccess }}>强度：强</div>
                );
              }
              return <div style={{ color: token.colorError }}>强度：弱</div>;
            },
          }}
          placeholder={"密码: ant.design"}
          rules={[
            {
              required: true,
              message: "请输入密码！",
            },
          ]}
        />
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: "right",
            }}
            href=""
          >
            忘记密码
          </a>
        </div>
      </LoginForm>
    </div>
  );
}

export default function Login() {
  return <ClientOnly>{() => <AdminLogin />}</ClientOnly>;
}
