import type { LoaderFunction } from "@remix-run/node";

// core
import { json } from "@remix-run/node";

// component
import BannerImage from "~/components/BannerImage";

// hooks
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";

// db
import { findNewsById } from "~/db/news";

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;

  try {
    const news = await findNewsById(Number(id));
    return json({ code: 0, data: news, message: "ok" });
  } catch (error: any) {
    return json({
      code: 1,
      data: [],
      message: error.message.toString() || "fail",
    });
  }
};

export default function NewsDetail() {
  const { data } = useLoaderData<typeof loader>() as any;
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    navigate(-1);
  }
  return (
    <div>
      <BannerImage
        title={data.title}
        src={data.coverUrl}
        style={{ height: "300px " }}
        time={data.createdAt}
      />
      <div className="flex justify-center">
        <div
          className="w-[80%]"
          dangerouslySetInnerHTML={{ __html: data.content }}
        ></div>
      </div>
    </div>
  );
}
