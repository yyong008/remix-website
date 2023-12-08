import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useEffect, useState } from "react";

import * as _icons from "@ant-design/icons";
import { Button, Popconfirm, Space, Tree, message } from "antd";
import {
  ModalForm,
  ProForm,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";

import {
  createRole,
  deleteRoleById,
  findRoleAll,
  updateRoleById,
} from "~/db/role";
import { findAllMenu } from "~/db/menu";
import { storage } from "~/utils/session.server";

const { DeleteOutlined, EditOutlined } = _icons;

export const action = async ({ request }: ActionFunctionArgs) => {
  const method = request.method;
  const dataJson = await request.json();

  switch (method) {
    case "POST":
      try {
        const { name, desc, menus } = dataJson;
        const data = await createRole({ name, desc, menus: menus ?? [] });
        return json({ code: 0, data, message: "ok" });
      } catch (error) {
        return json({ code: 1, data: [], message: error?.toString() });
      }

    case "PUT":
      try {
        const { id, desc, menus } = dataJson;
        const data = await updateRoleById({
          id: Number(id),
          desc,
          menus: menus ?? [],
        });
        return json({ code: 0, data, message: "ok" });
      } catch (error) {
        return json({ code: 1, data: [], message: error?.toString() });
      }

    case "DELETE":
      const { id } = dataJson;
      try {
        const data = await deleteRoleById(Number(id));
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

  const { roles, count } = await findRoleAll();

  const { menu } = await findAllMenu();

  const toTree = (flatData: any[]) => {
    const map: any = {};
    const tree: any[] = [];

    // 将每个项的id作为key建立map以便快速查找
    flatData.forEach((item) => {
      map[item.id] = {
        title: item.name,
        key: item.name,
        ...item,
        children: [],
      };
    });

    // 遍历数据，将每个节点放到其父节点下面
    flatData.forEach((item) => {
      if (item.parentId) {
        map[item.parentId].children.push(map[item.id]);
      } else {
        tree.push(map[item.id]);
      }
    });
    return tree;
  };

  const _menu = toTree(menu);

  return json({ dataSource: roles, total: count, menu: _menu, rawMenu: menu });
};

export default function RoleRoute() {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const {
    rawMenu = [],
    menu = [],
    dataSource = [],
    total = 0,
  } = useLoaderData<typeof loader>();

  // data
  const [showCreateModel, setShowCreateModel] = useState(false);
  const [record, setRecord] = useState<any>({});
  const [showModModel, setShowModModel] = useState(false);

  const onModRole = async ({
    record,
    values,
  }: {
    record: any;
    values: { name?: string; desc: string; menus: any[] };
  }) => {
    await submit(
      { id: record.id, ...values },
      { method: "PUT", encType: "application/json" }
    );
    return true;
  };

  const onCreateRole = async (values: {
    name: string;
    desc?: string;
    menus: any[];
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
              icon={<EditOutlined />}
              onClick={() => {
                setRecord(record);
                setShowModModel(true);
              }}
            ></Button>
            <Form>
              <Popconfirm
                title="删除角色"
                description="确定要删除此角色?"
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
            创建角色
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
          onCreateRole={onCreateRole}
          menu={menu}
          rawMenu={rawMenu}
        />
      )}
      {showModModel && (
        <ModForm
          record={record}
          open={showModModel}
          setOpen={setShowModModel}
          onModRole={onModRole}
          menu={menu}
          rawMenu={rawMenu}
        />
      )}
    </>
  );
}

function CreateForm(props: {
  open: boolean;
  setOpen: (show: boolean) => void;
  onCreateRole: (value: { name: string; menus: any[] }) => any;
  menu: any;
  rawMenu: any;
}) {
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [checkedNodes, setCheckedNodes] = useState([]);

  const onCheck = (checkedKeys: any, info: any) => {
    setCheckedKeys(checkedKeys);
    setCheckedNodes(info.checkedNodes);
  };

  return (
    <>
      <ModalForm
        title="创建角色"
        open={props.open}
        onFinish={(values: { name: string }) => {
          props.onCreateRole({ ...values, menus: checkedNodes });
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
          label="角色名"
          rules={[{ required: true, message: "Please input your name!" }]}
        />
        <ProFormText
          name="desc"
          label="描述"
          rules={[{ required: true, message: "Please input your desc!" }]}
        />
        <ProForm.Item
          name="menus"
          label="菜单"
          rules={[{ required: true, message: "Please input your menus!" }]}
        >
          <Tree
            checkable
            treeData={props.menu}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
          />
        </ProForm.Item>
      </ModalForm>
    </>
  );
}

function ModForm(props: {
  record: any;
  open: boolean;
  setOpen: (show: boolean) => void;
  onModRole: ({
    record,
    values,
  }: {
    record: any;
    values: { name?: string; desc: string; menus: any[] };
  }) => any;
  menu: any;
  rawMenu: any;
}) {
  const initKeys = props.record.menus?.map((m: any) => m.name);
  const [checkedKeys, setCheckedKeys] = useState(initKeys || []);
  const [checkedNodes, setCheckedNodes] = useState([]);

  const onCheck = (checkedKeys: any, info: any) => {
    setCheckedKeys(checkedKeys);
    setCheckedNodes(info.checkedNodes);
  };

  return (
    <>
      <ModalForm
        title="修改角色"
        open={props.open}
        initialValues={{
          name: props.record.name,
          desc: props.record.desc,
        }}
        onFinish={(values: { name?: string; desc: string; menus: any[] }) => {
          values.menus = checkedNodes;
          props.onModRole({
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
          label="角色名"
          disabled
          rules={[{ required: true, message: "Please input name!" }]}
        />
        <ProFormText
          name="desc"
          label="描述"
          rules={[{ required: true, message: "Please input your desc!" }]}
        />
        <ProForm.Item
          label="菜单"
          name="menus"
          rules={[{ required: true, message: "Please select your menu!" }]}
        >
          <Tree
            checkable
            treeData={props.menu}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
          />
        </ProForm.Item>
      </ModalForm>
    </>
  );
}
