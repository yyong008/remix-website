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
import { Button, Popconfirm, Space, Tag, TreeSelect, message } from "antd";
import {
  ModalForm,
  ProFormText,
  ProTable,
  ProFormSelect,
  ProForm,
} from "@ant-design/pro-components";

import { deleteRoleById } from "~/db/role";
import { findAllMenu, createMenu, updateMenu } from "~/db/menu";
import { storage } from "~/utils/session.server";
import { FormIconsCom } from "~/components/IconList";

const { DeleteOutlined, EditOutlined } = _icons;

export const action = async ({ request }: ActionFunctionArgs) => {
  const method = request.method;
  const dataJson = await request.json();

  switch (method) {
    case "POST":
      try {
        const { name, path, icon, component, parentId, roles } = dataJson;
        const _data: any = {
          name,
          icon,
          path,
          component,
          roles,
        };

        if (parentId && typeof parentId === "string") {
          _data.parentId = Number(parentId);
        }
        const data = await createMenu(_data);
        return json({ code: 0, data, message: "ok" });
      } catch (error) {
        return json({ code: 1, data: [], message: error?.toString() });
      }

    case "PUT":
      try {
        const { id, desc } = dataJson;
        const data = await updateMenu(Number(id), {
          desc,
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

  const { menu, count, roles } = await findAllMenu();

  const toTree = (flatData: any[]) => {
    const map: any = {};
    const tree: any[] = [];

    // 将每个项的id作为key建立map以便快速查找
    flatData.forEach((item) => {
      map[item.id] = {
        key: item.name,
        title: item.name,
        value: item.id,
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

  return json({ roles, dataSource: toTree(menu), total: count });
};

type IItem = {
  name?: string;
  desc: string;
  path: string;
  icon: string;
  parentId: number;
  roles: any[];
  component: string;
};

export default function MenuRoute() {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const { roles, dataSource = [], total = 0 } = useLoaderData<typeof loader>();

  // data
  const [showCreateModel, setShowCreateModel] = useState(false);
  const [record, setRecord] = useState<any>({});
  const [showModModel, setShowModModel] = useState(false);

  const onModMenu = async ({
    record,
    values,
  }: {
    record: any;
    values: IItem;
  }) => {
    await submit(
      { id: record.id, ...values },
      { method: "PUT", encType: "multipart/form-data" },
    );
    return true;
  };

  const onCreateMenu = async (values: IItem) => {
    if (!values.roles) {
      values.roles = [];
    }
    await submit(values, { method: "POST", encType: "multipart/form-data" });
    return true;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render(_: any, record: any) {
        return <Tag color={"gold"}>{record.name}</Tag>;
      },
    },
    {
      title: "路径",
      dataIndex: "path",
      key: "path",
    },
    {
      title: "图标",
      dataIndex: "icon",
      key: "icon",
      render(_: any, record: any) {
        const Icon = _icons[record.icon] as any;
        return Icon ? <Icon /> : null;
      },
    },
    {
      title: "组件",
      dataIndex: "component",
      key: "component",
    },
    {
      title: "角色",
      dataIndex: "roles",
      key: "roles",
      render(_: any, record: any) {
        return (
          <Space>
            {record.roles.map((r: any, index: number) => {
              return (
                <Tag key={index} color={r.name === "super" ? "cyan" : "green"}>
                  {r.desc}
                </Tag>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: "[id]/[父id]",
      dataIndex: "parentId",
      key: "parentId",
      render(_: any, record: any) {
        return (
          <div>
            <Tag>[{record.id}]</Tag>
            <span>/</span>
            <Tag>[{record.parentId}]</Tag>
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
              type="primary"
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
                    },
                  );
                }}
              >
                <Button
                  shape="circle"
                  icon={<DeleteOutlined />}
                  danger
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
        search={false}
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
            创建菜单
          </Button>,
        ]}
        pagination={{
          total,
          defaultPageSize: 9999,
          pageSize: 99999,
        }}
        key="id"
      />
      {showCreateModel && (
        <CreateForm
          open={showCreateModel}
          setOpen={setShowCreateModel}
          onCreateMenu={onCreateMenu}
          dataSource={dataSource}
          roles={roles}
        />
      )}
      {showModModel && (
        <ModForm
          record={record}
          open={showModModel}
          setOpen={setShowModModel}
          onModRole={onModMenu}
          dataSource={dataSource}
          roles={roles}
        />
      )}
    </>
  );
}

function CreateForm(props: {
  open: boolean;
  setOpen: (show: boolean) => void;
  onCreateMenu: (value: IItem) => any;
  dataSource: any[];
  roles?: any[];
}) {
  return (
    <>
      <ModalForm
        title="创建菜单项目"
        open={props.open}
        onFinish={(values: IItem) => {
          props.onCreateMenu(values);
          props.setOpen(false);
          return Promise.resolve(true);
        }}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => props.setOpen(false),
        }}
      >
        <ProFormText name="name" label="菜单名" />
        <ProFormText name="path" label="路径" />
        <ProFormText name="icon" label="图标" />
        <FormIconsCom />
        <ProFormText name="component" label="组件" />
        <ProFormSelect
          name="roles"
          label="角色"
          mode="multiple"
          options={props.roles?.map((item) => {
            return { label: item.name, value: item.id };
          })}
        />
        <ProForm.Item name="parentId" label="父ID">
          <TreeSelect
            showSearch
            style={{ width: "100%" }}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            placeholder="Please select"
            allowClear
            treeDefaultExpandAll
            treeData={props.dataSource}
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
  onModRole: ({ record, values }: { record: any; values: IItem }) => any;
  dataSource: any[];
  roles: any[];
}) {
  return (
    <>
      <ModalForm
        title="修改菜单"
        open={props.open}
        initialValues={{
          name: props.record.name,
          path: props.record.path,
          icon: props.record.icon,
          component: props.record.component,
          roles: props.record.roles.map((r: any) => r.id),
          parentId:
            props.record.parentId === null ? undefined : props.record.parentId,
        }}
        onFinish={(values: IItem) => {
          props.onModRole({ record: props.record, values });
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
          label="菜单名"
          disabled
          rules={[{ required: true, message: "Please input name!" }]}
        />
        <ProFormText
          name="path"
          label="路径"
          rules={[{ required: true, message: "Please input path!" }]}
        />
        <ProFormText
          name="icon"
          label="图标"
          rules={[{ required: true, message: "Please input icon!" }]}
        />
        <ProFormText
          name="component"
          label="组件"
          rules={[{ required: true, message: "Please input component!" }]}
        />
        <ProFormSelect
          name="roles"
          label="角色"
          mode="multiple"
          options={props.roles?.map((item) => {
            return { label: item.name, value: item.id };
          })}
          rules={[{ required: true, message: "Please input role!" }]}
        />
        <ProForm.Item
          name="parentId"
          label="父 ID"
          rules={[
            {
              required: false,
              message: "Please select nodes",
            },
          ]}
        >
          {/* 使用 TreeSelect 在表单中进行选择 */}
          <TreeSelect
            treeData={props.dataSource}
            placeholder="Please select"
            treeDefaultExpandAll
            treeCheckable
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            style={{ width: "100%" }}
            disabled={props.record.parentId === null ? true : false}
          />
        </ProForm.Item>
      </ModalForm>
    </>
  );
}
