# Remix WebSite

本项目是一个全栈项目，基于一下的技术：

- Remix(with vite)
- Sqlite (db)
- Prisma (orm)
- TailwindCSS (client)
- Antd (manage)


## 使用

```sh
git clone https://github.com/yyong008/remix-website.git


pnpm i

npx prisma migrate dev

pnpm run seed # 生成的数据较多

pnpm run dev # dev
```

## .env

```
DATABASE_URL="file:./dev.db"

SESSION_SECRET="your session secret"
PORT=3000
```

## routes

```sh
├── $.tsx
├── login.tsx
├── logout.tsx
├── register.tsx
├── test.icons.tsx
├── test.tsx
├── upload.tsx
├── _a.admin.dashboard.tsx
├── _a.admin.news.create.tsx
├── _a.admin.news.edit.$id.tsx
├── _a.admin.news.list.tsx
├── _a.admin.production.create.tsx
├── _a.admin.production.edit.$id.tsx
├── _a.admin.production.list.tsx
├── _a.admin.profile.tsx
├── _a.admin.system.menu.tsx
├── _a.admin.system.role.tsx
├── _a.admin.system.user.tsx
├── _a.tsx
├── _main.about.tsx
├── _main.culture.tsx
├── _main.join.tsx
├── _main.news.tsx
├── _main.news_.$id.tsx
├── _main.pattern.tsx
├── _main.production.tsx
├── _main.production_.$id.tsx
├── _main.tsx
└── _main._index.tsx
```

# License

MIT License © 2023-PRESENT Mg
