import type { LoaderFunction } from "@remix-run/node";

// core
import { json } from "@remix-run/node";

// component
import BannerImage from "~/components/BannerImage";

// hooks
import { useLoaderData, useNavigate } from "@remix-run/react";

import { findNewsAll } from "~/db/news";

import home from "~/assets/home.jpg";
import { formattedTime } from "~/utils/dayjs";

export const loader: LoaderFunction = async ({ request }) => {
  const { news, count } = await findNewsAll();

  return json({ news, total: count });
};

export default function News() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <div>
      <BannerImage title="News" src={home} style={{ height: "200px " }} />
      <div className="mt-[40px]">
        {loaderData?.news?.map((item: any, index: number) => {
          return <NewItems key={index} {...item} />;
        })}
      </div>
    </div>
  );
}

function NewItems({ coverUrl, content, title, createdAt, id }: any) {
  const navigate = useNavigate();
  return (
    <div
      className="flex w-[70%] h-[200px] mx-auto my-[20px] cursor-pointer hover:bg-slate-100"
      onClick={() => {
        navigate(`/news/${id}`);
      }}
    >
      <div className="w-[320px] h-[200px] overflow-hidden">
        <img className="w-full h-full object-cover" src={coverUrl} alt="" />
      </div>
      <div className="ml-[10px] flex-1">
        <div className="leading-[28px] text-[24px] font-bold text-gray-600">
          {title}
        </div>
        <div className="leading-[18px] text-gray-500 my-[10px]">
          {formattedTime(createdAt)}
        </div>
        <div className="leading-[28px] text-gray-400">
          {content.slice(0, 200)}
          {content.length > 200 ? "..." : ""}
        </div>
      </div>
    </div>
  );
}
