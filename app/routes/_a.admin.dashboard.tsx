import type { LoaderFunctionArgs } from "@remix-run/node";

import { redirect, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { findNewsAll } from "~/db/news";
import { getProductionCount } from "~/db/production";
import { findUserById } from "~/db/user";
import { Carousel, Col, Row, Space } from "antd";

import { storage } from "~/utils/session.server";
import { ProCard } from "@ant-design/pro-components";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await storage.getSession(request.headers.get("Cookie"));

  if (!session.has("userId")) {
    return redirect("/login");
  }

  const user = await findUserById(Number(session.get("userId")));

  const prodcutionCount = await getProductionCount();
  const { news, count: newsCount } = await findNewsAll();
  return json({
    news,
    newsCount,
    prodcutionCount,
    user: {
      name: user?.name,
    },
  });
};

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();

  return (
    <Space direction="vertical">
      <ProCard>
        <div>
          <div>欢迎 {data.user.name} 回来</div>
        </div>
      </ProCard>
      <ProCard title="公司产品">
        <Row>
          <Col span={12}>
            <ProCard>
              <div>新闻数量：{data.newsCount}</div>
            </ProCard>
          </Col>
          <Col span={12}>
            <ProCard>
              <div>产品数量：{data.prodcutionCount}</div>
            </ProCard>
          </Col>
        </Row>
      </ProCard>

      <ProCard>
        <Prodcution news={data.news as any} />
      </ProCard>
    </Space>
  );
}

function Prodcution({ news = [] }) {
  return (
    <Carousel>
      {news.map((n: any, index: number) => {
        return (
          <div className="w-[100%] h-[500px] overflow-hidden" key={index}>
            <img
              className="w-[100%] h-[500px] object-cover"
              src={n.coverUrl}
              alt=""
            />
          </div>
        );
      })}
    </Carousel>
  );
}
