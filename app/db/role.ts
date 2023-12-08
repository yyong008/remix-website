import prisma from "./server";

type IRole = {
  name: string;
  desc?: string;
  menus: any[];
};

export const createRole = ({ name, desc, menus }: IRole) => {
  return prisma.role.create({
    data: {
      name,
      desc,
      menus: {
        connect: menus.map((m) => ({ id: m.id })),
      },
    },
  });
};

export const findRoleAll = async () => {
  const roles = await prisma.role.findMany();
  const count = await prisma.role.count(); // 记录总数

  return {
    roles,
    count,
  };
};

export const findRoleById = (id: number) => {
  return prisma.role.findUnique({
    where: { id },
  });
};

export const findRoleByPage = async ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  const roles = await prisma.role.findMany({
    skip: (page - 1) * pageSize, // 跳过前面的记录
    take: pageSize, // 每页显示的记录数
    orderBy: {
      id: "desc", // 这里的 'asc' 表示升序，'desc' 表示降序
    },
    include: {
      menus: true,
    },
  });
  const count = await prisma.role.count(); // 记录总数

  return {
    roles,
    count,
  };
};

export const updateRoleById = async ({
  id,
  desc,
  menus,
}: {
  id: number;
  desc: string;
  menus: any[];
}) => {
  const menusArr = await prisma.menu.findMany();
  const roles = await prisma.role.update({
    where: { id },
    data: {
      desc,
      menus: {
        connect: menus.map((m) => ({ id: m.id })),
        disconnect: menusArr
          .map((i) => {
            return menus.some((item) => item.id === i.id) ? "" : i;
          })
          .filter((i) => i !== "") as any,
      },
    },
  });

  return roles;
};

export const deleteRoleById = (id: number) => {
  return prisma.role.delete({
    where: { id },
  });
};

export const deleteRolesByIds = (ids: number[]) => {
  return prisma.role.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const count = () => {
  return prisma.role.count();
};
