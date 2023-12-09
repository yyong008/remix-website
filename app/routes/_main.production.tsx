import type { LoaderFunction } from "@remix-run/node";

// core
import { json } from "@remix-run/node";

// component
import BannerImage from "~/components/BannerImage";

// hooks
import { useLoaderData, useSearchParams } from "@remix-run/react";

// db
import { findProductionByPage } from "~/db/production";

import home from "~/assets/home.jpg";
import ProductionCard from "~/components/ProductionCard";
import Pagination from "~/components/Pagination";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;
  const pageSize = url.searchParams.get("pageSize") || 10;

  const { productions, count } = await findProductionByPage({
    page: Number(page || 1),
    pageSize: Number(pageSize || 10),
  });

  return json({
    productions,
    count,
    pageTotal: Math.floor(count / Number(pageSize)),
  });
};

export default function ProductionRoute() {
  const loaderData = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  return (
    <div>
      <BannerImage title="Production" src={home} style={{ height: "200px " }} />
      <div className="flex flex-wrap w-[90%]  mx-auto mt-16">
        {loaderData?.productions?.map((item: any, index: number) => {
          return (
            <ProductionCard
              key={index}
              item={item}
              index={index}
              size={20}
              to="production"
            />
          );
        })}
      </div>
      <Pagination
        current={Number(searchParams.get("page")) || 1}
        total={loaderData?.pageTotal}
      />
    </div>
  );
}
