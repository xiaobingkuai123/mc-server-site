window.SITE_DATA = {
  // 把下面字段替换成你的服务器真实信息
  siteName: "The Potato",
  heroTitle: "The Potato",
  heroLead: "一个不限制生电的原版生存服，也能玩轻RPG",
  serverAddress: "mc.the-potato.cn",
  serverState: "服务器状态",
  onlineCount: 1,
  maxCount: 20,
  serverVersion: "26.3-1.7.x",

  // 首页四个概览卡片，写玩家进服前最关心的信息
  overview: [
    {
      label: "服务器类型",
      value: "原版生存 + 轻RPG",
      text: "原版生存、建筑养老、轻RPG、红石"
    },
    {
      label: "开放状态",
      value: "24×7 全天开放",
      text: "24x7全天开放"
    },
    {
      label: "玩家规则",
      value: "禁止作弊与消极游戏",
      text: "禁止作弊，如：矿透、作弊，禁止消极游戏、斗殴、发表不良言论"
    },
    {
      label: "资源安排",
      value: "不定期刷新",
      text: "长期无人活动的区域会不定期清理，释放资源"
    }
  ],

  // 玩法卡片写具体体验，避免写系统名和空泛形容词
  features: [
    {
      icon: "01",
      title: "玩法亮点",
      text: "服务器不限制生电、红石，可以原版生存也可以RPG升级"
    },
    {
      icon: "02",
      title: "建筑与地标",
      text: "主城、玩家聚落、公共设施、地标建筑或可申请区域"
    },
    {
      icon: "03",
      title: "活动安排",
      text: "Q群不定期发布各种活动"
    },
    {
      icon: "04",
      title: "管理方式",
      text: "在Q群报告管理员，说明情况，管理员将会在空余时间处理"
    }
  ],

  stats: [
    { value: "24×7", label: "在线时间" },
    { value: "每月1~2次", label: "活动频率" },
    { value: "长期不删档", label: "存档计划" }
  ],

  // 服务器风景图，建议放主城、玩家聚落、活动场和地标建筑
  scenery: [
    {
      image: "./assets/images/scenery-town.png",
      title: "主城或出生点",
      text: "替换成服务器主城、出生点或玩家第一眼会看到的场景说明"
    },
    {
      image: "./assets/images/scenery-lake.png",
      title: "玩家聚落或地标",
      text: "玩家聚落、交通枢纽、地标建筑或建设成果"
    },
    {
      image: "./assets/images/scenery-night.png",
      title: "活动区域",
      text: "替换成活动场、小游戏区域、节日场景或特色玩法截图"
    }
  ],

  // 公告写最近发生的具体事，不要写宣传口号
  news: [
    {
      date: "2026-10-04",
      title: "新功能加入",
      text: "加入公会功能和皮肤自定义功能，可在菜单里使用"
    },
    {
      date: "2026-10-02",
      title: "Bug修复",
      text: "修复玩家间传送和家传送异常问题"
    },
    {
      date: "2026-09-28",
      title: "Bug修复",
      text: "修复钓鱼竿使用异常问题"
    }
  ],

  joinSteps: [
    {
      title: "确认游戏版本",
      text: "Java版: 26.3-1.7.x，基岩版: 1.26.52-1.26.30"
    },
    {
      title: "复制服务器地址",
      text: "把 mc.the-potato.cn 添加到多人游戏服务器列表"
    },
    {
      title: "阅读规则后进入",
      text: "进服后注册账号，第一次注册后需要退出重进以生效"
    }
  ],

  community: {
    title: "Q群",
    note: "玩家交流群，可相互交流、反馈问题、提出建议，或只是潜水～",
    qrLabel: "二维码图片",
    qrNote: "378071460",
    qrImage: "./assets/images/IMG_6062.jpeg",
    links: [
      { label: "服务器规则", href: "./pages/rules.html" },
      { label: "世界地图", href: "./pages/world.html" },
      { label: "支持服务器", href: "./pages/support.html" }
    ]
  },

  faq: [
    {
      question: "为什么我注册账号后无法登陆？",
      answer: "退出重进后即可正常登陆～"
    },
    {
      question: "我的家被破坏怎么办？",
      answer: "进入Q群后反馈服主，并提供截图和坐标，服主会尽快处理～"
    },
    {
      question: "可以开挂/矿透吗？",
      answer: "不可以哦～"
    }
  ]
};
