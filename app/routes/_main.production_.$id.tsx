import type { LoaderFunction } from "@remix-run/node";

// core
import { json } from "@remix-run/node";

// component
import BannerImage from "~/components/BannerImage";

// hooks
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";

// db
import { findProductionById } from "~/db/production";

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;

  try {
    const productions = await findProductionById(Number(id));
    return json({ code: 0, data: productions, message: "ok" });
  } catch (error: any) {
    return json({
      code: 1,
      data: [],
      message: error.message.toString() || "fail",
    });
  }
};

export default function ProductionDetail() {
  const { data } = useLoaderData<typeof loader>() as any;
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    navigate(-1);
  }
  return (
    <div>
      <BannerImage
        title={data.name}
        src={data.coverUrl}
        style={{ height: "300px " }}
      />
      <div>
        <h1>{data.name}</h1>
        <div>{data.desc}</div>
      </div>
    </div>
  );
}

// 分页
