import prisma from "./server";

export const createUser = async ({
  name,
  email,
  password,
  roleId,
  avatar = "",
  childMenus = [],
}: any) => {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      roleId,
      avatar,
    },
  });

  return user;
};

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const findUserByName = async (name: string) => {
  return prisma.user.findUnique({
    where: { name },
  });
};

export const findUserByNamePassword = async (
  name: string,
  password: string
) => {
  return prisma.user.findUnique({
    where: { name, password },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserByPage = async ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  const users = await prisma.user.findMany({
    skip: (page - 1) * pageSize, // 跳过前面的记录
    take: pageSize, // 每页显示的记录数
    orderBy: {
      id: "desc", // 这里的 'asc' 表示升序，'desc' 表示降序
    },
    include: {
      role: true,
    },
  });
  const count = await prisma.user.count(); // 记录总数

  return {
    users,
    count,
  };
};

export const updateUserById = async ({
  id,
  name,
  email,
  avatar,
}: {
  id: number;
  name: string;
  email: string;
  avatar: string;
}) => {
  const roles = await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      avatar,
    },
  });

  return roles;
};

export const deleteUserById = (id: number) => {
  return prisma.user.delete({
    where: { id },
  });
};
