import { createMenu } from "~/db/menu";
import { createNews } from "~/db/news";
import { createProduction } from "~/db/production";
import { createRole } from "~/db/role";
import prisma from "~/db/server";
import { createUser } from "~/db/user";
import { Role } from "~/type";
import { hashedPassword } from "~/utils/hash";

// 创建角色
async function createRolesList() {
  const superRole = await createRole({
    name: "super",
    desc: "超级管理员",
    menus: [],
  });
  const userRole = await createRole({
    name: "user",
    desc: "用户",
    menus: [],
  });
  console.log("角色创建完毕")

  return { superRole, userRole }
}

// 创建用户
async function createUserList() {
  await createUser({
    name: "admin",
    password: hashedPassword("123456"),
    avatar: "/favicon.ico",
    email: "admin@remix.com",
    roleId: Role.Admin
  });
  await createUser({
    name: "user",
    password: hashedPassword("123456"),
    avatar: "/images/logo.png",
    email: "user@remix.com",
    roleId: Role.User
  });

  for(let i = 0; i < 100; i++) {
    await createUser({
      name: `user${i}`,
      password: hashedPassword("123456"),
      avatar: "/images/logo.png",
      email: `user${i}@remix.com`,
      roleId: Role.User
    });
  }

  console.log("用户创建完毕")
}

// 创建菜案
async function createMenus({role}) {
  await createMenu({
    name: "工作台",
    path: "/admin/dashboard",
    icon: "HomeOutlined",
    component: "",
    roles: [role.superRole.id, role.userRole.id],
  });
  await createMenu({
    name: "个人中心",
    path: "/admin/profile",
    icon: "UserOutlined",
    component: "",
    roles: [role.superRole.id, role.userRole.id],
  });
  const pSystem = await createMenu({
    name: "系统设置",
    path: "/admin/system",
    icon: "SettingOutlined",
    component: "",
    roles: [role.superRole.id],
  });
  await createMenu({
    name: "菜单管理",
    path: "/admin/system/menu",
    icon: "",
    component: "",
    roles: [role.superRole.id],
    parentId: pSystem.id
  });
  await createMenu({
    name: "角色管理",
    path: "/admin/system/role",
    icon: "",
    component: "",
    roles: [role.superRole.id],
    parentId: pSystem.id
  });
  await createMenu({
    name: "用户管理",
    path: "/admin/system/user",
    icon: "",
    component: "",
    roles: [role.superRole.id],
    parentId: pSystem.id
  });
  const pNew = await createMenu({
    name: "新闻管理",
    path: "/admin/news",
    icon: "AlignLeftOutlined",
    component: "",
    roles: [role.superRole.id, role.userRole.id],
    
  });
  await createMenu({
    name: "新闻列表",
    path: "/admin/news/list",
    icon: "",
    component: "",
    roles: [role.superRole.id, role.userRole.id],
    parentId: pNew.id
  });
  await createMenu({
    name: "新闻创建",
    path: "/admin/news/create",
    icon: "",
    component: "",
    roles: [role.superRole.id, role.userRole.id],
    parentId: pNew.id
  });
  const pMenu = await createMenu({
    name: "产品管理",
    path: "/admin/production",
    icon: "UserOutlined",
    component: "",
    roles: [role.superRole.id, role.userRole.id],
  });
  await createMenu({
    name: "产品列表",
    path: "/admin/production/list",
    icon: "",
    component: "",
    roles: [role.superRole.id, role.userRole.id],
    parentId: pMenu.id
  });
  await createMenu({
    name: "产品创建",
    path: "/admin/production/create",
    icon: "",
    component: "",
    roles: [role.superRole.id, role.userRole.id],
    parentId: pMenu.id,
  });

  console.log("菜单创建完毕！")
}

async function createNewsList() {
  for(let i = 0; i < 20; i++) {
    await createNews({
      title: `正面对决GPT-4！谷歌推出“最全能”AI模型Gemini，从手机到数据中心多环境适配${i}`,
      content: `谷歌迈出了在人工智能（AI）科技应用上追赶OpenAI的重要一步，推出手机、云、数据中心都可应用的超级全能AI模型，正面对决GPT-4。

美东时间12月6日周三，谷歌正式向公众发布新一代大语言模型（LLM）Gemini，号称谷歌迄今为止“最大、也最全能的AI模型”，有高级推理能力，回答难题时“考虑得更仔细”。有别于其他公司LLM竞品的是，谷歌强调Gemeni是最灵活的模型，因为它用不同大小的版本，可以适用于各种生成式AI应用。

其中，最轻盈的版本Gemni Nano可以直接在智能手机上离线运行；相对而言更强大的版本Gemini Pro可以执行多种任务，将通过谷歌的类ChatGPT聊天机器人Bard，为众多谷歌AI 服务提供支持，加持谷歌的Gmail、Maps Docs和YouTube等服务；功能最强大的版本Gemini Ultra也是谷歌迄今打造的最强大LLM，主要为数据中心和企业应用而设计。

谷歌旗下AI研究机构DeepMind的产品副总裁Eli Collins称，Gemini的多样性意味着，它“能够在从移动设备到大型数据中心的所有设备上运行。”他表示，谷歌早就希望打造的新一代AI模型更像是乐于助人的合作者，而不是一种智能的软件，Gemini让谷歌距离这种远景又近了一步。

现在Gemini只有英语版，谷歌将很快推出其他语言的版本。谷歌CEO Sundar Pichai说，Gemini代表了AI的新时代。最终，Gemini将与谷歌的搜索引擎、广告产品、Chrome浏览器等更多产品结合。

Gemini Nano手机电脑版周三可用 Gemini Pro支持Bard、下周面向云客户 Gemini Ultra明年推行
具体应用时间表方面，从本周三起，安卓系统开发人员可以注册使用Gemini Nano版，打造智能手机和电脑的Gemini支持App。谷歌称，Gemini可以立即在其旗舰手机Pixel 8 Pro上启用，实现诸如归纳电话录音对话要点等新的生成式AI功能。

Gemini Pro版从本周三开始支持Bard，实现高级的推理、规划、理解等功能，在170个国家地区以英语一种语言操作运行，可能不包括英国或者其他欧洲地区，因为谷歌称在和当地的监管机构合作。

从12月13日下周三开始，谷歌将通过谷歌云，在旗下Vertex AI 和 AI Studio平台向云客户提供 Gemini Pro版。

Gemini Ultra将首先面向开发者和企业客户开放，该版本的应用详情将在下周公布。谷歌计划，明年初，向公众大范围开放Gemini Ultra应用。

谷歌还计划，明年初发布Gemini Ultra支持的进阶版Bard Advanced，在面向大众推出以前，先将推出一个测试项目，以便改进Bard Advanced。

谷歌的下图展示了Gemini家族三个版本。



32种行业指标测试中 Gemini有30种遥遥领先GPT-4
谷歌此次毫不讳言和GPT-4一较高低的雄心。发布Gemini前，谷歌对它进行了一系列以标准行业指标评估的测试。谷歌称，在八项测试中，Gemini Pro有六项的表现优于OpenAI 的 GPT-3.5。在通用语言理解、推理、数学和编码方面测试中，八项基准指标里，Gemini 有七项超过了OpenAI 的最新版模型 GPT-4。

同时，谷歌评估了旗下可以解释和生成代码的最新生成式AI产品AlphaCode 2，发现在竞争性编程领域，它领先85%的竞争对手。

DeepMind的CEO Demis Hassabis称，谷歌运行了32种完善的基准指标相关测试，对比Gemini和GPT-4这两个模型，既有诸如多任务语言理解这类广泛的整体测试，到生成Python代码这种单一能力的测试。32种基准指标种，Gemini有30项都“遥遥领先”。

以下谷歌报告的截图可见，在多选问题、数学问题、Python代码任务、阅读等方面，Gemini Pro和Ultra与GPT-4、GPT-3.5等其他LLM的评分对比。



Gemini为原生多模态模型 在谷歌更高性能云芯片TPU v5p训练
谷歌称，Gemini是一种“原生多模态”AI模型。这意味着它从一开始就经过预先训练，可以处理用户基于文本和图像的提示词任务，支持文本和图像的服务。比如家长可以通过上传数学问题的图像，以及在工作表里尝试解决问题的照片，帮助孩子做家庭作业。Gemini还能阅读答案，理解为何是对的、为何是错的，并解释需要进一步说明的概念。



谷歌称，谷歌搜索运用生成式AI技术的“搜索生成式体验”在明年融入和Gemini的新功能。

谷歌承认，Gemini仍然可能存在AI产生的虚假信息或者捏造信息。Collins 称这是尚未解决的研究问题，不过他说，Gemini有迄今为止谷歌AI模型的最全面安全评估。为评估 Gemini 的安全性，谷歌对该模型进行了对抗性测试，模仿有不良企图的用户利用该模型输入提示词，帮助研究人员检查模型中是否存在仇恨言论和政治偏见。这类测试包括“真实毒性提示词”，它包含从网上提取的10万多个提示词。

谷歌强调Gemini的AI工具效率会非常高、速度非常快。它在谷歌自研的新版云芯片Tensor Processing Units（TPU）上训练，TPU v5p的性能更强，该芯片训练现有模型的速度比前代快2.8倍。TPU v5p是为数据中心的训练和大模型运行而设计。

谷歌机器学习副总裁 Amin Vahdat 表示，这种方法让谷歌“对未来标准AI基础设施有了新的认识”。谷歌仍然使用第三方AI芯片运行Gemini 模型。

谷歌提供的下图可见，谷歌数据中心内成排的谷歌云TPU v5p AI 加速器超级计算机。

${i}`,
      coverUrl: "/images/logo.png"
    });
  }
}

async function createProductionList() {
  for(let i = 0; i < 20; i++) {
    await createProduction({
      name: `产品${i}`,
      desc: `产品${i}`,
      coverUrl: "/images/logo.png"
    });
  }
}

async function main() {
  const { superRole, userRole } = await createRolesList();
  await createUserList();
  await createMenus({role: {superRole, userRole}});
  await createNewsList();
  await createProductionList()

  console.log()
  console.log("🚀🚀🚀 seed completed")
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
