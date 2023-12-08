import BannerImage from "~/components/BannerImage";
import home from "../assets/home.jpg";

export default function Pattern() {
  return (
    <div>
      <BannerImage title="About Us" src={home} style={{ height: "200px " }} />
      <div>暂无</div>
    </div>
  );
}
