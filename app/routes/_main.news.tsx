import type { LoaderFunction } from "@remix-run/node";

// core
import { json } from "@remix-run/node";

// component
import BannerImage from "~/components/BannerImage";

// hooks
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";

import { findNewsByPage } from "~/db/news";

import home from "~/assets/home.jpg";
import { formattedTime } from "~/utils/dayjs";
import Pagination from "~/components/Pagination";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;
  const pageSize = url.searchParams.get("pageSize") || 10;

  const { news, count } = await findNewsByPage({
    page: Number(page || 1),
    pageSize: Number(pageSize || 10),
  });

  return json({ news, pageTotal: Math.floor(count / Number(pageSize)) });
};

export default function News() {
  const loaderData = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  return (
    <div>
      <BannerImage title="News" src={home} style={{ height: "200px " }} />
      <div className="mt-[40px]">
        {loaderData?.news?.map((item: any, index: number) => {
          return <NewItems key={index} {...item} />;
        })}
      </div>
      <Pagination
        current={Number(searchParams.get("page")) || 1}
        total={loaderData?.pageTotal}
        to="news"
      />
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
