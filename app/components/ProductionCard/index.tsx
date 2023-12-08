import { useNavigate } from "@remix-run/react";

export default function ProductionCard({ item, index }: any) {
  const navigate = useNavigate();
  return (
    <div
      key={index}
      className="flex flex-col items-center py-[20px] basis-[33%] cursor-pointeri"
      onClick={() => {
        navigate(`/production/${item.id}`);
      }}
    >
      <div className="flex flex-col w-[450px] items-center bg-white  overflow-hidden shadow-md">
        <div className="relative w-[450px] h-[400px]">
          <img
            className="w-[100%] h-[100%] object-cover"
            src={item.coverUrl}
            alt=""
          />
        </div>
        <div className="flex justify-center items-center h-[100px] text-[26px]">
          {item.desc}
        </div>
      </div>
    </div>
  );
}
