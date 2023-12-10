import { json, type MetaFunction } from "@remix-run/node";

import { Link, NavLink, useLoaderData, Outlet } from "@remix-run/react";

import Button from "~/components/MoreButton";
import { getIndexData } from "~/data";

import "~/styles/tailwind.css";
import ScrollTop from "~/components/ScrollTop";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Website template" },
    { name: "template", content: "Remix Website" },
  ];
};

export const loader = function () {
  return json(getIndexData());
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col h-screen leading-[60px]">
      <Header />
      <div className="flex flex-col flex-1">
        <div className="flex-1">
          <Outlet />
        </div>
        <div className="w-[100%] bg-slate-600">
          <div className="w-[90%] h-[210px] mx-auto my-0">
            <Footer data={data as any} />
            <CopyRight />
          </div>
        </div>
      </div>
      <ScrollTop />
    </div>
  );
}

function Header() {
  return (
    <div className="w-full h-[80px] flex align-center justify-between px-[80px]">
      <NavLink to="/">
        <div className="flex justify-center items-center font-bold scale-50">
          <img
            className="w-[30px] h-[30px] mr-[10px]"
            src="/favicon.ico"
            alt=""
          />
          <span>Remix Website</span>
        </div>
      </NavLink>
      <span className="font-bold">
        <span className="mx-[10px]">
          <NavLink
            to="/"
            end
            className={({ isActive }) => {
              return isActive ? "text-blue-500 " : "hover:text-blue-500";
            }}
          >
            首页
          </NavLink>
        </span>
        <span className="mx-[10px] hover:text-blue-500">
          <NavLink
            className={({ isActive }) => {
              return isActive ? "text-blue-500 " : "hover:text-blue-500";
            }}
            to="/production"
            end
          >
            产品
          </NavLink>
        </span>
        <span className="mx-[10px] hover:text-blue-500">
          <NavLink
            className={({ isActive }) => {
              return isActive ? "text-blue-500 " : "hover:text-blue-500";
            }}
            to="/news"
            end
          >
            新闻
          </NavLink>
        </span>
        <span className="mx-[10px] hover:text-blue-500">
          <NavLink
            className={({ isActive }) => {
              return isActive ? "text-blue-500 " : "hover:text-blue-500";
            }}
            to="/about"
          >
            关于
          </NavLink>
        </span>
        <span className="mx-[10px] hover:text-blue-500">
          <NavLink
            className={({ isActive }) => {
              return isActive ? "text-blue-500 " : "hover:text-blue-500";
            }}
            to="/join"
          >
            加入我们
          </NavLink>
        </span>
        <span className="mx-[10px] hover:text-blue-500">
          <NavLink to="/login">
            <Button>登录</Button>
          </NavLink>
        </span>
      </span>
    </div>
  );
}

function CopyRight() {
  return (
    <div className="text-center text-slate-300 text-xs">
      Copyright @ {new Date().getFullYear()} Remix Website All rights reserved.
    </div>
  );
}

function Footer({ data }: { data: never[] }) {
  return (
    <div className="flex text-slate-200">
      {data?.map((dt: any, index) => {
        return (
          <div key={index} className="mx-[30px]">
            <h1 className="text-white font-bold">{dt.title}</h1>
            <div className="text-slate-100 text-xs">
              {dt?.children?.map((item: any, index: number) => {
                return (
                  <div key={index} className="my-[10px]">
                    <Link
                      style={{
                        pointerEvents: (item.to ? "" : "none") as any,
                      }}
                      to={item.to}
                    >
                      {item.title}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
