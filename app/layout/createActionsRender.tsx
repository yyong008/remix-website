import * as _icons from "@ant-design/icons";

// icons
const { GithubFilled, InfoCircleFilled, QuestionCircleFilled, HomeOutlined } =
  _icons;

export const createActionRenderWrap =
  ({ value, navigate }: any) =>
  (props: any) => {
    const goGithub = () => {
      let aTag: any = document.createElement("a");
      aTag.setAttribute("href", "https://github.com/yyong008/remix-antd-admin");
      aTag.setAttribute("target", "_blank");
      aTag.click();
      aTag = null;
    };
    if (props.isMobile) return [];
    return [
      <InfoCircleFilled key="InfoCircleFilled" />,
      <QuestionCircleFilled key="QuestionCircleFilled" />,
      <GithubFilled key="GithubFilled" onClick={goGithub} />,
      <HomeOutlined
        key="HomeOutlined"
        onClick={() => {
          navigate("/");
        }}
      />,
    ];
  };
