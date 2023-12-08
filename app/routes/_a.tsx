// import type { ActionArgs } from "@remix-run/node";
import type { LoaderFunctionArgs, LoaderFunction } from "@remix-run/node";

import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useContext, memo, useState, useMemo } from "react";
import { json, redirect } from "@remix-run/node";

// components:vendor
import { ProLayout } from "@ant-design/pro-components";
import { ClientOnly } from "remix-utils/client-only";

// components
import Footer from "~/components/Footer";
import MenuFooterRender from "~/layout/MenuFooterRender";

// context
import SettingContext from "~/context/settingContext";

// layout
import { SettingDrawerWrap } from "~/layout/SettingDrawerWrap";
import { AvatarDropDown } from "~/layout/AvatarDropDown";
import { createActionRenderWrap } from "~/layout/createActionsRender";
import { config } from "~/layout/config";
import { createTokens } from "~/layout/createToken";
import { Spin } from "antd";

// db
import { findAllMenu } from "~/db/menu";
import { storage } from "~/utils/session.server";
import { findUserById } from "~/db/user";
import { toTreeWithIcon } from "~/utils/toTree";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const { menu } = await findAllMenu();
  const session = await storage.getSession(request.headers.get("Cookie"));

  const id = session.get("userId");

  if (!id) {
    return redirect("/login");
  }
  let user: any = await findUserById(Number(id));
  return json({
    user: {
      name: user?.name,
      avatar: user.avatar,
    },
    menu: menu.filter((m) => {
      return m.roles.some((role) => role.id === user.roleId);
    }),
  });
};

function AdminLayout() {
  const navigate = useNavigate();
  const { user, menu } = useLoaderData<typeof loader>();
  const value = useContext(SettingContext);
  const [pathname, setPathname] = useState(location.pathname);
  const routes = useMemo(() => {
    return {
      route: {
        path: `/`,
        routes: toTreeWithIcon(menu),
      },
    };
  }, [menu]);

  return (
    <Spin spinning={!routes}>
      <ProLayout
        {...routes}
        {...value.theme}
        loading={false}
        title={config.title}
        logo={config.logo}
        layout={config.layout as any}
        token={createTokens(value)}
        ErrorBoundary={false}
        pageTitleRender={false}
        breadcrumbRender={false}
        menu={config.menu}
        location={{
          pathname,
        }}
        menuItemRender={(item, dom) => {
          return (
            <Link
              to={item.path!}
              onClick={() => {
                setPathname(item.path || "/");
              }}
            >
              {dom}
            </Link>
          );
        }}
        actionsRender={createActionRenderWrap({ value, navigate })}
        avatarProps={{
          size: config.avatar.size as any,
          title: user.name,
          render: (_, dom) => {
            return (
              <div>
                <AvatarDropDown dom={dom} name={user.name} src={user.avatar} />
              </div>
            );
          },
        }}
        menuFooterRender={MenuFooterRender}
        footerRender={() => <Footer />}
      >
        <Outlet />
        <SettingDrawerWrap theme={value.theme} setTheme={value.setTheme} />
      </ProLayout>
    </Spin>
  );
}

function Admin() {
  return <ClientOnly>{() => <AdminLayout />}</ClientOnly>;
}

export default memo(Admin);
