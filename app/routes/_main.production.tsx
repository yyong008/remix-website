import type { LoaderFunction } from "@remix-run/node";

// core
import { json } from "@remix-run/node";

// component
import BannerImage from "~/components/BannerImage";

// hooks
import { useLoaderData } from "@remix-run/react";

// db
import { findProductionAll } from "~/db/production";

import home from "~/assets/home.jpg";
import ProductionCard from "~/components/ProductionCard";

export const loader: LoaderFunction = async () => {
  const { productions } = await findProductionAll();

  return json({ productions });
};

export default function ProductionRoute() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <div>
      <BannerImage title="Production" src={home} style={{ height: "200px " }} />
      <div className="flex flex-wrap">
        {loaderData?.productions?.map((item: any, index: number) => {
          return <ProductionCard key={index} item={item} index={index} />;
        })}
      </div>
    </div>
  );
}
