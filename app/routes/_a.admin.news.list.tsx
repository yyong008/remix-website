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
import { Button, Popconfirm, Space, message, Image } from "antd";
import { ModalForm, ProFormText, ProTable } from "@ant-design/pro-components";

import {
  createNews,
  deleteNewsById,
  findNewsByPage,
  updateNewsById,
} from "~/db/news";
import { storage } from "~/utils/session.server";

const { DeleteOutlined, EditOutlined } = _icons;

export const action = async ({ request }: ActionFunctionArgs) => {
  const method = request.method;
  const dataJson = await request.json();

  switch (method) {
    case "POST":
      try {
        const { title, coverUrl, content } = dataJson;
        const data = await createNews({ title, coverUrl, content });
        return json({ code: 0, data, message: "ok" });
      } catch (error) {
        return json({ code: 1, data: [], message: error?.toString() });
      }

    case "PUT":
      try {
        const { id, coverUrl, title, content } = dataJson;
        const data = await updateNewsById({
          id: Number(id),
          coverUrl,
          title,
          content,
        });
        return json({ code: 0, data, message: "ok" });
      } catch (error) {
        return json({ code: 1, data: [], message: error?.toString() });
      }

    case "DELETE":
      const { id } = dataJson;
      try {
        const data = await deleteNewsById(Number(id));
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

  const { news, count } = await findNewsByPage({
    page: Number(page),
    pageSize: Number(pageSize) === 0 ? Number(pageSize) : 20,
  });

  return json({ dataSource: news, total: count });
};

export default function NewsRoute() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  const actionData = useActionData<typeof action>();
  const { dataSource = [], total = 0 } = useLoaderData<typeof loader>();

  // data
  const [showCreateModel, setShowCreateModel] = useState(false);
  const [record, setRecord] = useState<any>({});
  const [showModModel, setShowModModel] = useState(false);

  const onModNews = async ({
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

  const onCreateNews = async (values: { name: string; desc?: string }) => {
    await submit(values, { method: "POST", encType: "application/json" });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "coverUrl",
      dataIndex: "coverUrl",
      key: "coverUrl",
      render(_: any, record: any) {
        return <Image src={record.coverUrl} width={100} />;
      },
    },
    {
      title: "title",
      dataIndex: "title",
      key: "title",
      render(_: any, record: any) {
        return <div>{record.title.slice(0, 10)}</div>;
      },
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      render(_: any, record: any) {
        return (
          <div>
            {record.content.slice(0, 40)}
            {record.content.length > 40 ? "..." : ""}
          </div>
        );
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
                // setShowModModel(true);
                navigate("/admin/news/edit/" + record.id);
              }}
            ></Button>
            <Form>
              <Popconfirm
                title="删除新闻"
                description="确定要删除此新闻?"
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
              navigate("/admin/news/create");
            }}
          >
            创建新闻
          </Button>,
        ]}
        pagination={{
          total,
          defaultCurrent: page ? Number(page) : 1,
          current: page ? Number(page) : 1,
          pageSize: pageSize ? Number(pageSize) : 20,
          onChange(page, pageSize) {
            navigate(`/admin/news/list?page=${page}&pageSize=${pageSize}`);
          },
        }}
        key="id"
      />
      {showCreateModel && (
        <CreateForm
          open={showCreateModel}
          setOpen={setShowCreateModel}
          onCreateNews={onCreateNews}
        />
      )}
      {showModModel && (
        <ModForm
          record={record}
          open={showModModel}
          setOpen={setShowModModel}
          onModNews={onModNews}
        />
      )}
    </>
  );
}

function CreateForm(props: {
  open: boolean;
  setOpen: (show: boolean) => void;
  onCreateNews: (value: { name: string }) => any;
}) {
  return (
    <>
      <ModalForm
        title="创建新闻"
        open={props.open}
        onFinish={(values: { name: string }) => {
          props.onCreateNews({ ...values });
          props.setOpen(false);
          return Promise.resolve(true);
        }}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => props.setOpen(false),
        }}
      >
        <ProFormText name="name" label="角色名" />
        <ProFormText name="desc" label="描述" />
      </ModalForm>
    </>
  );
}

function ModForm(props: {
  record: any;
  open: boolean;
  setOpen: (show: boolean) => void;
  onModNews: ({
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
        title="修改新闻"
        open={props.open}
        initialValues={{
          name: props.record.name,
          desc: props.record.desc,
        }}
        onFinish={(values: { name?: string; desc: string }) => {
          props.onModNews({
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
        <ProFormText name="title" label="标题" disabled />
        <ProFormText name="desc" label="描述" />
      </ModalForm>
    </>
  );
}
