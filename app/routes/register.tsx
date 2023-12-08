import type { ActionFunction } from "@remix-run/node";

import { useEffect } from "react";
import { json, redirect } from "@remix-run/node";
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
import { createUser, findUserByEmail } from "~/db/user";
import { ClientOnly } from "remix-utils/client-only";
import { createMenu } from "~/db/menu";

const { UserOutlined, LockOutlined } = _icons;

export const action: ActionFunction = async ({ request }) => {
  const method = request.method;
  const dataJson = await request.json();

  switch (method) {
    case "POST":
      try {
        const { name, password, email } = dataJson;

        if (!name || !password || !email) {
          return json({ code: 1, data: [], message: "参数错误" });
        }

        const user = await findUserByEmail(name);

        if (user) {
          return json({ code: 1, data: [], message: "用户名已被使用" });
        }

        const data = await createUser({ name, password, email });
        await createMenu({
          name: "工作台",
          path: "/admin/dashboard",
          icon: "HomeOutlined",
          component: "",
          roles: [],
        });

        if (data) {
          return redirect("/login");
        } else {
          return json({ code: 1, data: [], message: "创建失败" });
        }
      } catch (error) {
        return json({ code: 1, data: [], message: error?.toString() });
      }

    default:
      break;
  }
};

function AdminRegister() {
  const { token } = theme.useToken();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    if (values.password !== values.password2) {
      message.error("两次密码不一致");
      return;
    }
    values.password = hashedPassword(values.password);
    values.password2 = hashedPassword(values.password2);
    submit(values, { method: "POST", encType: "application/json" });
  };

  useEffect(() => {
    if (actionData) {
      if (actionData.code === 1) {
        message.error(actionData?.message);
      } else {
        message.info(actionData?.message);
      }
    }
  }, [actionData, navigate]);
  return (
    <div>
      <LoginForm
        logo="/favicon.ico"
        title="注册"
        subTitle="用户注册"
        onFinish={onFinish}
        submitter={{ searchConfig: { submitText: "注册" } }}
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
        <ProFormText
          name="email"
          fieldProps={{
            size: "large",
            prefix: <UserOutlined className={"prefixIcon"} />,
          }}
          placeholder={"邮箱"}
          rules={[
            {
              required: true,
              message: "请输入邮箱!",
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
          placeholder={"请输入密码"}
          rules={[
            {
              required: true,
              message: "请输入密码！",
            },
          ]}
        />
        <ProFormText.Password
          name="password2"
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
          placeholder={"请在次输入密码"}
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
  return <ClientOnly>{() => <AdminRegister />}</ClientOnly>;
}
