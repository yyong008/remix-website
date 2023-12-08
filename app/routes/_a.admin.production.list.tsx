import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useEffect, useState } from "react";

import * as _icons from "@ant-design/icons";
import { Button, Popconfirm, Space, message, Image } from "antd";
import { ModalForm, ProFormText, ProTable } from "@ant-design/pro-components";

import {
  createProduction,
  deleteProductionById,
  findProductionAll,
  updateProductionById,
} from "~/db/production";
import { storage } from "~/utils/session.server";

const { DeleteOutlined, EditOutlined } = _icons;

export const action = async ({ request }: ActionFunctionArgs) => {
  const method = request.method;
  const dataJson = await request.json();

  switch (method) {
    case "POST":
      try {
        const { name, desc, coverUrl } = dataJson;
        const data = await createProduction({ name, coverUrl, desc });
        return json({ code: 0, data, message: "ok" });
      } catch (error) {
        return json({ code: 1, data: [], message: error?.toString() });
      }

    case "PUT":
      try {
        const { id, desc, coverUrl, name } = dataJson;
        const data = await updateProductionById({
          id: Number(id),
          desc,
          name,
          coverUrl,
        });
        return json({ code: 0, data, message: "ok" });
      } catch (error) {
        return json({ code: 1, data: [], message: error?.toString() });
      }

    case "DELETE":
      const { id } = dataJson;
      try {
        const data = await deleteProductionById(Number(id));
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

  const { productions, count } = await findProductionAll();

  return json({ dataSource: productions, total: count });
};

export default function ProductionRoute() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();
  const { dataSource = [], total = 0 } = useLoaderData<typeof loader>();

  // data
  const [showCreateModel, setShowCreateModel] = useState(false);
  const [record, setRecord] = useState<any>({});
  const [showModModel, setShowModModel] = useState(false);

  const onModProduction = async ({
    record,
    values,
  }: {
    record: any;
    values: { name?: string; desc: string };
  }) => {
    await submit(
      { id: record.id, ...values },
      { method: "PUT", encType: "application/json" }
    );
    return true;
  };

  const onCreateProduction = async (values: {
    name: string;
    desc?: string;
  }) => {
    await submit(values, { method: "POST", encType: "application/json" });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "image",
      dataIndex: "image",
      key: "image",
      width: 200,
      render(_: any, record: any) {
        return (
          <Image
            src={record.coverUrl}
            style={{ width: 100, height: 100 }}
          ></Image>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Desc",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "操作",
      render(_: any, record: any) {
        return (
          <Space size="large">
            <Button
              shape="circle"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setRecord(record);
                // setShowModModel(true);
                navigate("/admin/production/edit/" + record.id);
              }}
            ></Button>
            <Form>
              <Popconfirm
                title="删除产品"
                description="确定要删除此产品?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => {
                  submit(
                    { id: record.id },
                    {
                      method: "DELETE",
                      encType: "application/json",
                    }
                  );
                }}
              >
                <Button
                  danger
                  shape="circle"
                  icon={<DeleteOutlined />}
                ></Button>
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
              // setShowCreateModel(!showCreateModel);
              navigate("/admin/production/create");
            }}
          >
            创建产品
          </Button>,
        ]}
        pagination={{
          total,
          defaultPageSize: 9999,
          pageSize: 99999,
          // current: Number(searchParams.get("page") || 1),
          // onChange(page, pageSize) {
          //   navigate(`/role?page=${page}&pageSize=${pageSize}`);
          // },
        }}
        key="id"
      />
      {showCreateModel && (
        <CreateForm
          open={showCreateModel}
          setOpen={setShowCreateModel}
          onCreateProduction={onCreateProduction}
        />
      )}
      {showModModel && (
        <ModForm
          record={record}
          open={showModModel}
          setOpen={setShowModModel}
          onModProduction={onModProduction}
        />
      )}
    </>
  );
}

function CreateForm(props: {
  open: boolean;
  setOpen: (show: boolean) => void;
  onCreateProduction: (value: { name: string }) => any;
}) {
  return (
    <>
      <ModalForm
        title="创建产品"
        open={props.open}
        onFinish={(values: {
          name: string;
          desc: string;
          coverUrl: string;
        }) => {
          props.onCreateProduction({ ...values });
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
          label="产品名"
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
  onModProduction: ({
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
        title="修改产品"
        open={props.open}
        initialValues={{
          name: props.record.name,
          desc: props.record.desc,
        }}
        onFinish={(values: { name?: string; desc: string }) => {
          props.onModProduction({
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
          label="产品名"
          disabled
          rules={[{ required: true, message: "Please input name!" }]}
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
