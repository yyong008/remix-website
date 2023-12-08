export const data = [
  {
    title: "关于我们",
    children: [
      {
        title: "关于我们",
        to: "/about",
      },
      {
        title: "企业文化",
        to: "/culture",
      },
      {
        title: "合作伙伴",
        to: "",
      },
      {
        title: "加入我们",
        to: "/join",
      },
    ],
  },
  {
    title: "产品服务",
    children: [
      {
        title: "产品服务1",
        to: "/production",
      },
      {
        title: "产品服务2",
        to: "/production",
      },
      {
        title: "产品服务3",
        to: "/production",
      },
      {
        title: "产品服务4",
        to: "/production",
      },
    ],
  },
  {
    title: "联系我们",
    children: [
      {
        title: "商务合作",
        to: "",
      },
      {
        title: "微信公众号",
        to: "",
      },
    ],
  },
  {
    title: "新闻资讯",
    children: [
      {
        title: "行业新闻",
        to: "/news",
      },
      {
        title: "公司新闻",
        to: "/news",
      },
    ],
  },
];

export const getIndexData = () => {
  return data;
};
