import { formattedTime } from "~/utils/dayjs";

export default function BannerImage({
  src,
  style,
  title,
  time,
}: {
  src: string;
  style?: React.CSSProperties;
  title: string;
  time?: string;
}) {
  return (
    <div className="relative w-[100%] overflow-hidden" style={style}>
      <img
        className="absolute top-0 w-[100%] h-[100%] object-cover"
        src={src}
        alt=""
      />
      <div
        className="relative flex flex-col justify-center items-center z-10 text-white  "
        style={style}
      >
        <span className="px-[40px] bg-slate-900 text-[40px]">{title}</span>
        {time ? (
          <span className="px-[10px] py-[10px] bg-slate-500 rounded-[30px] my-[20px] leading-[1]">
            {formattedTime(time)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
