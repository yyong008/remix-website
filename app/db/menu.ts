import type { Prisma } from "@prisma/client";
import prisma from "./server";

type CreateMenu = {
  name: string;
  parentId?: number;
  path: string;
  icon: string;
  roles: any[] | string;
  component: string;
  parentMenu?: Prisma.MenuUncheckedCreateInput;
};

export const createMenu = ({
  name,
  parentId,
  path,
  icon,
  roles,
  component,
  parentMenu,
}: CreateMenu) => {
  let _roles: any[] = [];
  if (typeof roles === "string") {
    _roles = roles?.split(",").map((i: any) => parseInt(i, 10));
  } else {
    _roles = roles as any[];
  }
  return prisma.menu.create({
    data: {
      name,
      parentId,
      path,
      icon,
      component,
      roles: {
        connect: _roles.map((roleId: any) => ({ id: roleId })),
      },
    },
    include: {
      roles: true, // 包含关联的角色信息
    },
  });
};

export const updateMenu = (id: number, data: any) => {
  return prisma.menu.update({
    where: { id },
    data,
  });
};

export const findAllMenu = async () => {
  const menu = await prisma.menu.findMany({
    include: {
      roles: true,
    },
  });
  const count = await prisma.menu.count();
  const roles = await prisma.role.findMany();
  return { roles, menu, count };
};
