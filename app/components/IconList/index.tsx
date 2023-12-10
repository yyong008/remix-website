import { ClientOnly } from "remix-utils/client-only";
import { Form } from "antd";
import { useMemo } from "react";

const IconGrid = () => {
  return <ClientOnly>{() => <IconsCom />}</ClientOnly>;
};

export function IconsCom({ props }: any) {
  const AntdIcons = useMemo(async () => {
    const _icons = await import("@ant-design/icons");
    return _icons;
  }, []);
  return (
    <div className="flex flex-wrap">
      {Object.keys(AntdIcons)
        .filter((icon) => /^[A-Z]/.test(icon[0]))
        .map((iconKey, index) => {
          const IconComponent = AntdIcons[iconKey];
          return (
            <span key={index} className="flex">
              <span
                onClick={() => {
                  props.onClick(iconKey);
                }}
              >
                <IconComponent
                  style={{ fontSize: "24px", cursor: "pointer" }}
                />
              </span>
            </span>
          );
        })}
    </div>
  );
}

export function FormIconsCom() {
  return (
    <Form.Item label="选择图标" name="icon">
      <IconsCom />
    </Form.Item>
  );
}

export default IconGrid;
