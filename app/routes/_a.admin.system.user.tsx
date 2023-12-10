import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useEffect, useState } from "react";

import * as _icons from "@ant-design/icons";
import { Button, Popconfirm, Space, message, Image, Tag } from "antd";
import { ModalForm, ProFormText, ProTable } from "@ant-design/pro-components";

import {
  createUser,
  deleteUserById,
  findUserByPage,
  updateUserById,
} from "~/db/user";
import { storage } from "~/utils/session.server";
import { formattedTime } from "~/utils/dayjs";

const { DeleteOutlined, EditOutlined } = _icons;

export const action = async ({ request }: ActionFunctionArgs) => {
  const method = request.method;
  const dataJson = await request.json();

  switch (method) {
    case "POST":
      try {
        const { name, desc } = dataJson;
        const data = await createUser({ name, desc });
        return json({ code: 0, data, message: "ok" });
      } catch (error) {
        return json({ code: 1, data: [], message: error?.toString() });
      }

    case "PUT":
      try {
        const { id, name } = dataJson;
        const data = await updateUserById({
          id: Number(id),
          name,
        });
        return json({ code: 0, data, message: "ok" });
      } catch (error) {
        return json({ code: 1, data: [], message: error?.toString() });
      }

    case "DELETE":
      const { id } = dataJson;
      try {
        const data = await deleteUserById(Number(id));
        return json({ code: 0, data, message: "ok" });
      } catch (error) {
        return json({ code: 1, data: [], message: error?.toString() });
      }
    case "default":
      return json({ code: 0, data: [], message: "ok" });
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await storage.getSession(request.headers.get("Cookie"));

  if (!session.has("userId")) {
    return redirect("/login");
  }

  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;
  const pageSize = url.searchParams.get("pageSize") || 20;

  const { users, count } = await findUserByPage({
    page: Number(page),
    pageSize: Number(pageSize) === 0 ? Number(pageSize) : 20,
  });

  return json({ dataSource: users, total: count });
};

export default function UserRoute() {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  const navigate = useNavigate();
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const { dataSource = [], total = 0 } = useLoaderData<typeof loader>();

  // data
  const [showCreateModel, setShowCreateModel] = useState(false);
  const [record, setRecord] = useState<any>({});
  const [showModModel, setShowModModel] = useState(false);

  const onModUser = async ({
    record,
    values,
  }: {
    record: any;
    values: { name?: string; desc: string };
  }) => {
    await submit(
      { id: record.id, ...values },
      { method: "PUT", encType: "application/json" },
    );
    return true;
  };

  const onCreateUser = async (values: { name: string; desc?: string }) => {
    await submit(values, { method: "POST", encType: "application/json" });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "avatar",
      dataIndex: "avatar",
      key: "avatar",
      render(_: any, record: any) {
        return record.url ? <Image src={record.avatar} /> : null;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "角色",
      dataIndex: "roles",
      key: "roles",
      render(_, record: any) {
        return (
          <div>
            <Tag>{record.role.desc}</Tag>
          </div>
        );
      },
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
      key: "createdAt",
      render(_: any, record: any) {
        return formattedTime(record.createdAt);
      },
    },
    {
      title: "updatedAt",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render(_: any, record: any) {
        return formattedTime(record.createdAt);
      },
    },

    {
      title: "操作",
      render(_: any, record: any) {
        return (
          <Space size="large">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setRecord(record);
                setShowModModel(true);
              }}
            ></Button>
            <Form>
              <Popconfirm
                title="删除用户"
                description="确定要删除此用户?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => {
                  submit(
                    { id: record.id },
                    {
                      method: "DELETE",
                      encType: "application/json",
                    },
                  );
                }}
              >
                <Button shape="circle" icon={<DeleteOutlined />}></Button>
              </Popconfirm>
            </Form>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    if (actionData && actionData.code === 1) {
      message.error(actionData.message);
    }
  }, [actionData]);

  return (
    <>
      <ProTable
        // search={false}
        columns={columns}
        dataSource={dataSource as any}
        toolBarRender={() => [
          <Button
            type="primary"
            key={"create"}
            onClick={() => {
              setShowCreateModel(!showCreateModel);
            }}
          >
            创建用户
          </Button>,
        ]}
        pagination={{
          total,
          defaultCurrent: page ? Number(page) : 1,
          current: page ? Number(page) : 1,
          pageSize: pageSize ? Number(pageSize) : 20,
          onChange(page, pageSize) {
            navigate(`/admin/system/user?page=${page}&pageSize=${pageSize}`);
          },
        }}
        key="id"
      />
      {showCreateModel && (
        <CreateForm
          open={showCreateModel}
          setOpen={setShowCreateModel}
          onCreateUser={onCreateUser}
        />
      )}
      {showModModel && (
        <ModForm
          record={record}
          open={showModModel}
          setOpen={setShowModModel}
          onModUser={onModUser}
        />
      )}
    </>
  );
}

function CreateForm(props: {
  open: boolean;
  setOpen: (show: boolean) => void;
  onCreateUser: (value: { name: string }) => any;
}) {
  return (
    <>
      <ModalForm
        title="创建用户"
        open={props.open}
        onFinish={(values: { name: string }) => {
          props.onCreateUser({ ...values });
          props.setOpen(false);
          return Promise.resolve(true);
        }}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => props.setOpen(false),
        }}
      >
        <ProFormText
          name="name"
          label="用户"
          rules={[{ required: true, message: "Please input your name!" }]}
        />
        <ProFormText
          name="desc"
          label="描述"
          rules={[{ required: true, message: "Please input your desc!" }]}
        />
      </ModalForm>
    </>
  );
}

function ModForm(props: {
  record: any;
  open: boolean;
  setOpen: (show: boolean) => void;
  onModUser: ({
    record,
    values,
  }: {
    record: any;
    values: { name?: string; desc: string };
  }) => any;
}) {
  return (
    <>
      <ModalForm
        title="修改用户"
        open={props.open}
        initialValues={{
          name: props.record.name,
          desc: props.record.desc,
        }}
        onFinish={(values: { name?: string; desc: string }) => {
          props.onModUser({
            record: props.record,
            values,
          });
          props.setOpen(false);
          return Promise.resolve(true);
        }}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => props.setOpen(false),
        }}
      >
        <ProFormText
          name="name"
          label="用户"
          disabled
          rules={[{ required: true, message: "Please input name!" }]}
        />
        <ProFormText
          name="desc"
          label="描述"
          rules={[{ required: true, message: "Please input desc!" }]}
        />
      </ModalForm>
    </>
  );
}
