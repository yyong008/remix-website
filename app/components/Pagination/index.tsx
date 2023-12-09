import { useNavigate } from "@remix-run/react";

export default function Pagination({
  current = 1,
  total = 1,
  pageSize = 10,
  onBefore,
  onAfter,
  to,
}: any) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center  items-center">
      <div
        className={`border-1 ${
          current > 1 ? "cursor-pointer" : "text-gray-400"
        } mr-[20px]`}
        onClick={() => {
          if (current > 1) {
            navigate(`/${to}?page=${current - 1}&pageSize=${pageSize}`);
          }
        }}
      >
        上一页
      </div>
      <div>
        {current}/{total}
      </div>
      <div
        className={`border-1 ${
          current < total ? "cursor-pointer" : "text-gray-400"
        } ml-[20px]`}
        onClick={() => {
          if (current < total) {
            navigate(`/${to}?page=${current + 1}&pageSize=${pageSize}`);
          }
        }}
      >
        下一页
      </div>
    </div>
  );
}
