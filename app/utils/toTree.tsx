import * as _icons from "@ant-design/icons";

const Icon = ({ name }: any) => {
  const Comp = _icons[name];
  return Comp ? <Comp /> : null;
};

export const toTree = (flatData: any[]) => {
  const map: any = {};
  const tree: any[] = [];

  // 将每个项的id作为key建立map以便快速查找
  flatData.forEach((item) => {
    map[item.id] = {
      key: item.name,
      title: item.name,
      value: item.id,
      icon: item.icon,
      label: item.name,
      ...item,
      children: [],
    };
  });

  // 遍历数据，将每个节点放到其父节点下面
  flatData.forEach((item) => {
    if (item.parentId) {
      map[item.parentId].children.push(map[item.id]);
    } else {
      tree.push(map[item.id]);
    }
  });
  return tree;
};

export const toTreeWithIcon = (flatData: any[]) => {
  const map: any = {};
  const tree: any[] = [];

  // 将每个项的id作为key建立map以便快速查找
  flatData.forEach((item) => {
    map[item.id] = {
      key: item.name,
      title: item.name,
      value: item.id,
      // icon: item.icon,
      label: item.name,
      ...item,
      icon: <Icon name={item.icon} />,
      children: [],
    };
  });

  // 遍历数据，将每个节点放到其父节点下面
  flatData.forEach((item) => {
    if (item.parentId) {
      map[item.parentId].children.push(map[item.id]);
    } else {
      tree.push(map[item.id]);
    }
  });
  return tree;
};
