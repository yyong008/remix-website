import { useSubmit } from "@remix-run/react";

import * as _icons from "@ant-design/icons";
import { Avatar, Dropdown, Form, Space } from "antd";
import React from "react";

const { LogoutOutlined } = _icons;

type AvatarDropDownProps = {
  dom: any;
  name: string;
  src?: string;
};

export const AvatarDropDown: React.FC<AvatarDropDownProps> = ({
  name,
  dom,
  src,
}) => {
  const submit = useSubmit();
  return (
    <Form>
      <Dropdown
        menu={{
          items: [
            {
              key: "logout",
              icon: <LogoutOutlined />,
              label: "logout",
              onClick: () => {
                submit(
                  {
                    t: "logout",
                  },
                  {
                    action: "/logout",
                    method: "POST",
                    encType: "application/json",
                  }
                );
              },
            },
          ],
        }}
      >
        <Space>
          <Avatar src={src}>{name.slice(0, 3)}</Avatar>
          <div>{name}</div>
        </Space>
      </Dropdown>
    </Form>
  );
};
