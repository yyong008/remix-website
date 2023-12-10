import type { LoaderFunction } from "@remix-run/node";

// core
import { json } from "@remix-run/node";

// hooks
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import Button from "~/components/MoreButton";
import ProductionCard from "~/components/ProductionCard";

import { findNewsAll } from "~/db/news";
import { findProductionAll } from "~/db/production";

export const loader: LoaderFunction = async () => {
  const { news } = await findNewsAll();
  const { productions } = await findProductionAll();

  return json({ news: news.slice(0, 5), productions: productions.slice(0, 6) });
};

function HeaderLine({ title, subTitle }: any) {
  return (
    <div className="flex justify-center items-center h-[120px] text-center font-extrabold text-[34px]">
      {title}
      <span className="flex  text-gray-600 text-[18px] font-normal mx-[10px] ali">
        {subTitle}
      </span>
    </div>
  );
}

export default function Home() {
  const { news = [], productions = [] } = useLoaderData<typeof loader>();
  return (
    <div className="">
      <Main />
      <Productions productions={productions} />
      <News news={news} />
      <Culture />
      <More />
    </div>
  );
}

function Main() {
  return (
    <div className="relative w-[100%] h-[800px] overflow-hidden">
      <img src="/images/logo.png" alt="" />
      <div className="absolute top-[200px] left-[100px]">
        <div className="text-blue-500 font-bold text-[60px]">Remix Website</div>
        <div className="text-gray-300 text-[20px]">
          一个使用了 Remix 作为技术栈的模板
        </div>
        <button className="text-gray-300 text-[20px]  leading-[40px] bg-blue-500 px-[30px] font-[20px]">
          <Link to="/production">更多</Link>
        </button>
      </div>
    </div>
  );
}

function Productions({ productions = [] }) {
  return (
    <>
      <div className=" bg-white w-[90%] mx-auto my-0 pb-[30px]">
        <HeaderLine title="产品服务" subTitle="works" />
        <div className="flex flex-wrap">
          {productions.map((item: any, index: number) => {
            return <ProductionCard item={item} index={index} key={index} />;
          })}
        </div>
        <div className="flex justify-center">
          <Link to="/production">
            <Button>更多产品</Button>
          </Link>
        </div>
      </div>
    </>
  );
}

function News({ news = [] }: any) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col bg-slate-100 pb-[20px]">
      <HeaderLine title="新闻动态" subTitle="news" />
      <div className="flex">
        <div
          className="flex flex-1 justify-center content-center cursor-pointer"
          onClick={() => {
            navigate(`/news/${news[0]?.coverUrl}`);
          }}
        >
          <div className="w-[680px] h-[440px] overflow-hidden">
            <img className="w-[100%] h-[100%]" src={news[0]?.coverUrl} alt="" />
          </div>
        </div>
        <div className="flex-1">
          {news?.slice(1, 5).map((item: any, index: number) => {
            return (
              <div
                className="flex mb-[14px] cursor-pointer"
                key={index}
                onClick={() => {
                  navigate(`/news/${item.id}`);
                }}
              >
                <div className="w-[150px] h-[100px]">
                  <img
                    className="w-[100%] h-[100%] object-cover"
                    src={item.coverUrl}
                    alt=""
                  />
                </div>
                <div className="ml-[10px] h-[100px] w-[500px] leading-[30px] text-lg">
                  <div className="font-medium">{item.title}</div>
                  <div className="mt-[8px] text-slate-400 text-[16px]">
                    {item.content.slice(0, 33)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center mt-[20px]">
        <Link to="/news">
          <Button>更多新闻</Button>
        </Link>
      </div>
    </div>
  );
}

function More() {
  const navigate = useNavigate();
  return (
    <div className="bg-slate-100 pb-[80px]">
      <HeaderLine title="更多" subTitle="more" />
      <div className="flex w-[90%] mx-auto my-0 mt-[10px] justify-between">
        <div className="h-[400px] basis-[33%] overflow-hidden relative">
          <div className="absolute top-0 w-[100%] h-[400px]">
            <img
              className="w-[100%] h-[100%] object-cover"
              src={"/images/logo.png"}
              alt=""
            />
          </div>
          <div
            className="relative flex justify-center items-center w-[100%] h-[400px] text-gray-100 z-10 cursor-pointer"
            onClick={() => {
              navigate("/culture");
            }}
          >
            企业文化
          </div>
        </div>
        <div className="basis-[33%] overflow-hidden relative">
          <div className="absolute top-0 w-[100%] h-[400px]">
            <img
              className="w-[100%] h-[100%] object-cover"
              src={"/images/logo.png"}
              alt=""
            />
          </div>
          <div
            className="relative flex justify-center items-center w-[100%] h-[400px] text-gray-100 z-10 cursor-pointer"
            onClick={() => {
              navigate("/join");
            }}
          >
            加入我们
          </div>
        </div>
        <div className="basis-[33%] overflow-hidden relative">
          <div className="absolute top-0 w-[100%] h-[400px]">
            <img
              className="w-[100%] h-[100%] object-cover"
              src={"/images/logo.png"}
              alt=""
            />
          </div>
          <div
            className="relative flex justify-center items-center w-[100%] h-[400px] text-gray-100 z-10 cursor-pointer"
            onClick={() => {
              navigate("/pattern");
            }}
          >
            合作伙伴
          </div>
        </div>
      </div>
    </div>
  );
}

function Culture() {
  const navigate = useNavigate();
  return (
    <div className="h-[700px] pb-[80px]">
      <HeaderLine title="企业文化" subTitle="cultures" />
      <div
        className="flex flex-col"
        onClick={() => {
          navigate("/culture");
        }}
      >
        <div className="relative flex justify-center items-center">
          <div className="absolute top-0 w-[90%] h-[500px] overflow-hidden">
            <img src={"/images/logo.png"} alt="" />
          </div>
          <div className="flex flex-col justify-center items-center w-[1200px] h-[300px] z-10">
            <div className="mb-[10px] text-[20px] leading-[20px] text-gray-100">
              关于我们
            </div>
            <div className="m-[40px] text-[20px] leading-[20px] text-gray-100">
              我们是一个XXXX, 我们关注XXX, 我们XXX。
            </div>
            <Button
              onClick={() => {
                navigate("/culture");
              }}
            >
              更多
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
