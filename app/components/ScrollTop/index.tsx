import { useEffect, useRef, useState } from "react";

export default function ScrollTop() {
  const ref = useRef<any>();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 监听滚动事件
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // 清除滚动事件监听器
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return isVisible ? (
    <div
      ref={ref}
      onClick={(e) => {
        window.scrollTo({
          top: 0,
          behavior: "smooth", // 平滑滚动
        });
      }}
      className="flex justify-center items-center fixed bottom-[120px] right-[10px] w-[60px] h-[60px] bg-gray-800 text-white rounded-[10px] cursor-pointer"
    >
      Top
    </div>
  ) : null;
}
