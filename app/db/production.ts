import prisma from "./server";

type IProduction = {
  name: string;
  desc: string;
  coverUrl: string;
};

export const createProduction = ({ name, desc, coverUrl }: IProduction) => {
  return prisma.production.create({
    data: {
      name,
      desc,
      coverUrl,
    },
  });
};

export const findProductionAll = async () => {
  const productions = await prisma.production.findMany();
  const count = await prisma.production.count(); // 记录总数

  return {
    productions,
    count,
  };
};

export const findProductionById = (id: number) => {
  return prisma.production.findUnique({
    where: { id },
  });
};

export const findProductionByPage = async ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  const productions = await prisma.production.findMany({
    skip: (page - 1) * pageSize, // 跳过前面的记录
    take: pageSize, // 每页显示的记录数
    orderBy: {
      id: "desc", // 这里的 'asc' 表示升序，'desc' 表示降序
    },
  });
  const count = await prisma.production.count(); // 记录总数

  return {
    productions,
    count,
  };
};

export const updateProductionById = async ({
  id,
  desc,
  coverUrl,
  name,
}: { id: number } & IProduction) => {
  const productions = await prisma.production.update({
    where: { id },
    data: {
      name,
      desc,
      coverUrl,
    },
  });

  return productions;
};

export const deleteProductionById = (id: number) => {
  return prisma.production.delete({
    where: { id },
  });
};

export const deleteProductionsByIds = (ids: number[]) => {
  return prisma.production.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const getProductionCount = () => {
  return prisma.production.count();
};
