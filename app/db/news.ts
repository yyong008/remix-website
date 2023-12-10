import prisma from "./server";

type INews = {
  title: string;
  content: string;
  coverUrl: string;
};

export const createNews = ({ title, content, coverUrl }: INews) => {
  return prisma.news.create({
    data: {
      title,
      content,
      coverUrl,
    },
  });
};

export const findNewsAll = async () => {
  const news = await prisma.news.findMany();
  const count = await prisma.news.count(); // 记录总数

  return {
    news,
    count,
  };
};

export const findNewsById = (id: number) => {
  return prisma.news.findUnique({
    where: { id },
  });
};

export const findNewsByPage = async ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  const news = await prisma.news.findMany({
    skip: (page - 1) * pageSize, // 跳过前面的记录
    take: pageSize, // 每页显示的记录数
    orderBy: {
      id: "desc", // 这里的 'asc' 表示升序，'desc' 表示降序
    },
  });
  const count = await prisma.news.count(); // 记录总数
  return {
    news,
    count,
  };
};

export const updateNewsById = async ({
  id,
  title,
  content,
  coverUrl,
}: { id: number } & INews) => {
  const news = await prisma.news.update({
    where: { id },
    data: {
      title,
      content,
      coverUrl,
    },
  });

  return news;
};

export const deleteNewsById = (id: number) => {
  return prisma.news.delete({
    where: { id },
  });
};

export const deleteNewsByIds = (ids: number[]) => {
  return prisma.news.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const getNewsCount = () => {
  return prisma.news.count();
};
