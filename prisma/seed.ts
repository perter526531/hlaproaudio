import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";

// Image URLs are hosted on ZAI's OSS CDN (guaranteed reachable).
const IMG = {
  homeBanner: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/82a65c8db7d0.jpg",
  aboutBanner: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/89daa1bd4580.webp",
  productsBanner: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d59cddb322c6.jpg",
  solutionsBanner: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4b3eeacf8a24.jpg",
  contactBanner: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cb084abd47b8.jpg",
  newsBanner: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5614de08b729.jpg",
  aboutStory: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1e01c14710b4.png",
  aboutWorkshop: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/36e1894f9542.jpg",
  solution1: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5858247c9a7e.jpg",
  solution2: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cda799fd070b.jpg",
  solution3: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2e4e4b2e0ba0.jpg",
  solution4: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/807c30151978.jpg",
  prodLineArray: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ab67df55ab17.jpg",
  prodSubwoofer: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/80a5a5c0ded4.jpg",
  prodColumn: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d59cddb322c6.jpg",
  prodAmplifier: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/af4ca9017221.jpg",
  prodMixer: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3493e548b310.jpg",
  prodProcessor: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/fb49b51fd072.jpg",
  prodWireless: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f84edc63ffde.webp",
  prodMicrophone: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0b55df3f677c.jpeg",
};

async function main() {
  // Wipe
  await db.formSubmission.deleteMany();
  await db.productImage.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();
  await db.contentBlock.deleteMany();
  await db.sitePage.deleteMany();
  await db.siteSetting.deleteMany();
  await db.adminUser.deleteMany();

  // Admin
  await db.adminUser.create({
    data: { username: "admin", passwordHash: hashPassword("admin123") },
  });

  // Site settings
  await db.siteSetting.create({
    data: {
      siteNameEn: "AudioCenter",
      siteNameCn: "AudioCenter 专业音响",
      logo: null,
      phoneEn: "+86 400-888-0000",
      phoneCn: "400-888-0000",
      emailEn: "info@audiocenter.example",
      emailCn: "info@audiocenter.example",
      addressEn: "No. 88 Sound Avenue, Hi-Tech Zone, Guangzhou, China",
      addressCn: "广州市高新技术开发区音响大道88号",
      whatsapp: "+86 138 0000 0000",
      wechat: "AudioCenter_Official",
      facebook: "https://facebook.com",
      youtube: "https://youtube.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
      copyrightEn: "© AudioCenter Professional Audio. All rights reserved.",
      copyrightCn: "© 奥迪中心专业音响 版权所有",
    },
  });

  // Pages
  const home = await db.sitePage.create({
    data: {
      slug: "home",
      titleEn: "Home",
      titleCn: "首页",
      bannerImage: IMG.homeBanner,
      bannerTitleEn: "Engineered for Sound. Built for the Stage.",
      bannerTitleCn: "为声音而生，为舞台而造。",
      bannerSubEn: "Professional audio systems trusted by venues, artists and integrators across 80+ countries.",
      bannerSubCn: "专业音响系统，深受全球80多个国家场馆、艺术家和集成商信赖。",
    },
  });

  const about = await db.sitePage.create({
    data: {
      slug: "about",
      titleEn: "About Us",
      titleCn: "关于我们",
      bannerImage: IMG.aboutBanner,
      bannerTitleEn: "20 Years of Acoustic Innovation",
      bannerTitleCn: "20年声学创新之路",
      bannerSubEn: "From a small workshop to a global professional audio brand.",
      bannerSubCn: "从一间小作坊到全球专业音响品牌。",
    },
  });

  const products = await db.sitePage.create({
    data: {
      slug: "products",
      titleEn: "Products",
      titleCn: "产品中心",
      bannerImage: IMG.productsBanner,
      bannerTitleEn: "Sound Solutions for Every Venue",
      bannerTitleCn: "为每一种场馆而生",
      bannerSubEn: "Line arrays, subwoofers, amplifiers, mixers, processors and more.",
      bannerSubCn: "线阵列、低音炮、功放、调音台、处理器等专业音响产品。",
    },
  });

  const solutions = await db.sitePage.create({
    data: {
      slug: "solutions",
      titleEn: "Solutions",
      titleCn: "解决方案",
      bannerImage: IMG.solutionsBanner,
      bannerTitleEn: "Tailored Audio for Every Application",
      bannerTitleCn: "为每一种场景量身定制",
      bannerSubEn: "Touring, fixed installation, houses of worship, sports, education and more.",
      bannerSubCn: "流动演出、固定安装、宗教场所、体育场馆、教育等多个领域。",
    },
  });

  const contact = await db.sitePage.create({
    data: {
      slug: "contact",
      titleEn: "Contact",
      titleCn: "联系我们",
      bannerImage: IMG.contactBanner,
      bannerTitleEn: "Let's Talk About Sound",
      bannerTitleCn: "让我们聊聊声音",
      bannerSubEn: "Reach our team for sales, support and partnerships.",
      bannerSubCn: "销售、支持与商务合作，欢迎与我们联系。",
    },
  });

  const news = await db.sitePage.create({
    data: {
      slug: "news",
      titleEn: "News",
      titleCn: "新闻资讯",
      bannerImage: IMG.newsBanner,
      bannerTitleEn: "Latest from AudioCenter",
      bannerTitleCn: "AudioCenter 最新动态",
      bannerSubEn: "Events, product launches and industry stories.",
      bannerSubCn: "活动、新品发布与行业故事。",
    },
  });

  // News content blocks
  const newsBlocks = [
    {
      type: "news-list",
      titleEn: "Latest News",
      titleCn: "最新动态",
      contentEn:
        '[{"titleEn":"AudioCenter Showcases New Line Array at Prolight+Sound 2024","titleCn":"AudioCenter 在 2024 法兰克福展发布全新线阵列","excerptEn":"The VA-12 line array drew crowds with its punchy, musical sound and fast rigging hardware.","excerptCn":"全新 VA-12 线阵列凭借饱满悦耳的声音与便捷挂件硬件吸引大量观众。","dateEn":"Apr 15, 2024","dateCn":"2024年4月15日","tagEn":"Event","tagCn":"活动","image":"https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5614de08b729.jpg"},{"titleEn":"VA-12 Line Array Now Shipping Worldwide","titleCn":"VA-12 线阵列全球同步发售","excerptEn":"Touring-grade output, 24-cabinet array capability and refined voicing are now available globally.","excerptCn":"巡演级输出、24只阵列规模与精细调校，全球同步发售。","dateEn":"Feb 28, 2024","dateCn":"2024年2月28日","tagEn":"Product","tagCn":"新品","image":"https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ab67df55ab17.jpg"},{"titleEn":"Stadium Project in Southeast Asia Completed","titleCn":"东南亚某体育馆扩声项目顺利完成","excerptEn":"A multi-zone line array + column speaker solution delivered even coverage across the bowl.","excerptCn":"线阵列+柱式扬声器多分区方案，为整个场馆提供均匀覆盖。","dateEn":"Jan 10, 2024","dateCn":"2024年1月10日","tagEn":"Case Study","tagCn":"案例","image":"https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2e4e4b2e0ba0.jpg"}]',
      order: 0,
    },
  ];
  for (const b of newsBlocks) {
    await db.contentBlock.create({ data: { ...b, pageId: news.id } });
  }

  // Content blocks for home page
  // (The home hero is driven by the page banner fields above — no separate
  // "hero" block here, which would duplicate the banner image.)
  const homeBlocks = [
    {
      type: "features",
      titleEn: "Why Choose AudioCenter",
      titleCn: "为什么选择 AudioCenter",
      order: 0,
    },
    {
      type: "stats",
      titleEn: "Our Numbers",
      titleCn: "数据见证",
      order: 1,
    },
    {
      type: "text",
      titleEn: "Research & Development",
      titleCn: "研发实力",
      contentEn: "A 50+ engineer R&D team covering acoustics, electronics, software and mechanical design powers continuous innovation across our product lines.",
      contentCn: "50余位工程师组成的研发团队，覆盖声学、电子、软件与结构设计，为产品线持续创新提供动力。",
      image: IMG.aboutWorkshop,
      order: 2,
    },
    {
      type: "featured",
      titleEn: "Star Products",
      titleCn: "明星产品",
      contentEn: "Featured Products",
      contentCn: "明星产品",
      order: 3,
    },
    {
      type: "solution-cards",
      titleEn: "Where We Help",
      titleCn: "应用领域",
      contentEn: "Solutions",
      contentCn: "解决方案",
      order: 4,
    },
    {
      type: "cta",
      titleEn: "Let's build your next sound system.",
      titleCn: "让我们一起打造下一套声音系统。",
      contentEn: "Tell us about your venue, audience and budget — we'll propose the right system.",
      contentCn: "告诉我们您的场馆、听众和预算，我们会为您推荐最合适的方案。",
      order: 5,
    },
  ];
  for (const b of homeBlocks) {
    await db.contentBlock.create({ data: { ...b, pageId: home.id } });
  }

  // About content blocks
  const aboutBlocks = [
    {
      type: "text",
      titleEn: "Our Story",
      titleCn: "品牌故事",
      contentEn: "Founded in 2003, AudioCenter began as a small workshop dedicated to building reliable loudspeakers for local sound rental companies. Over two decades, we have grown into a global professional audio brand with products spanning line arrays, subwoofers, column speakers, amplifiers, digital mixers, DSP and wireless systems — all designed and tested in-house.",
      contentCn: "AudioCenter 创立于2003年，最初是一间为本地演出租赁公司打造可靠扬声器的小作坊。历经二十年发展，已成为拥有线阵列、低音炮、柱式扬声器、功放、数字调音台、DSP处理器及无线系统等完整产品线的全球专业音响品牌，所有产品均在内部研发与测试。",
      image: IMG.aboutStory,
      order: 0,
    },
    {
      type: "text",
      titleEn: "Manufacturing & Quality",
      titleCn: "制造与品质",
      contentEn: "Our 30,000m² facility combines automated PCB assembly, climate-controlled acoustics labs, Klippel measurement and 100% product aging before shipment. Every system is tuned by ear and measured by machine.",
      contentCn: "30,000平方米的生产基地集成自动贴片、恒温声学实验室、Klippel测量系统与100%出厂老化测试。每一套系统，既由仪器测量，也由耳朵调校。",
      image: IMG.aboutWorkshop,
      order: 1,
    },
    {
      type: "text",
      titleEn: "What We Believe",
      titleCn: "我们的信念",
      contentEn: "Sound should be honest, musical and powerful — never harsh.",
      contentCn: "声音应当真实、悦耳且富有力量 —— 绝不刺耳。",
      order: 2,
    },
    {
      type: "stats",
      titleEn: "Milestones",
      titleCn: "发展历程",
      contentEn: '[{"value":"2003","labelEn":"Founded","labelCn":"创立"},{"value":"20+","labelEn":"Years of Innovation","labelCn":"年声学创新"},{"value":"80+","labelEn":"Countries Served","labelCn":"服务国家"},{"value":"30,000m²","labelEn":"Manufacturing Base","labelCn":"生产基地"}]',
      order: 3,
    },
    {
      type: "cta",
      titleEn: "Work with us.",
      titleCn: "与我们合作。",
      contentEn:
        "From rental houses to integrators, we partner with professionals worldwide.",
      contentCn: "从租赁公司到集成商，我们与全球专业人士建立合作关系。",
      order: 4,
    },
  ];
  for (const b of aboutBlocks) {
    await db.contentBlock.create({ data: { ...b, pageId: about.id } });
  }

  // Solutions content blocks
  const solBlocks = [
    { type: "text", titleEn: "Touring & Live Sound", titleCn: "流动演出", contentEn: "High-output line arrays with predictable coverage, fast rigging and road-ready cabinets for rental companies and tours.", contentCn: "高输出线阵列系统，覆盖可预测、装配快捷、箱体坚固，专为租赁与巡演而设计。", image: IMG.solution1, order: 0 },
    { type: "text", titleEn: "Fixed Installation", titleCn: "固定安装", contentEn: "Architectural loudspeakers and steerable column arrays for auditoriums, transport hubs and corporate spaces.", contentCn: "适用于礼堂、交通枢纽与企业空间的建筑化扬声器与可指向柱式阵列。", image: IMG.solution2, order: 1 },
    { type: "text", titleEn: "Houses of Worship", titleCn: "宗教场所", contentEn: "Speech-intelligible, music-warm systems designed to respect the architecture and the message.", contentCn: "兼顾语言清晰与音乐温暖，尊重建筑空间与表达内容的专业音响系统。", image: IMG.solution3, order: 2 },
    { type: "text", titleEn: "Sports & Education", titleCn: "体育与教育", contentEn: "Weather-resistant systems and campus-wide paging tuned for clarity and durability.", contentCn: "耐候型扬声器与校园级广播系统，清晰、耐用、易维护。", image: IMG.solution4, order: 3 },
    { type: "cta", titleEn: "Have a specific venue in mind?", titleCn: "有具体的场馆场景？", contentEn: "Our application engineers can help design the right system.", contentCn: "我们的应用工程师可协助设计最合适的系统。", order: 4 },
  ];
  for (const b of solBlocks) {
    await db.contentBlock.create({ data: { ...b, pageId: solutions.id } });
  }

  // Categories (3 levels)
  // Level 1
  const catL1 = await db.category.create({
    data: {
      nameEn: "Loudspeakers",
      nameCn: "扬声器",
      order: 0,
      icon: "speaker",
      descEn: "Professional loudspeakers for every venue and application.",
      descCn: "为各类场馆与应用打造的专业扬声器。",
      image: IMG.prodLineArray,
    },
  });
  const catAmp = await db.category.create({
    data: {
      nameEn: "Amplifiers",
      nameCn: "功放",
      order: 1,
      icon: "amp",
      descEn: "Touring-grade amplifiers with integrated DSP.",
      descCn: "集成 DSP 的巡演级功放。",
      image: IMG.prodAmplifier,
    },
  });
  const catMix = await db.category.create({
    data: {
      nameEn: "Mixers & Processors",
      nameCn: "调音台与处理器",
      order: 2,
      icon: "mixer",
      descEn: "Digital mixers and signal processors.",
      descCn: "数字调音台与信号处理器。",
      image: IMG.prodMixer,
    },
  });
  const catWireless = await db.category.create({
    data: {
      nameEn: "Wireless & Microphones",
      nameCn: "无线与话筒",
      order: 3,
      icon: "mic",
      descEn: "Wireless systems and microphones.",
      descCn: "无线系统与话筒。",
      image: IMG.prodWireless,
    },
  });

  // Level 2 under Loudspeakers
  const cLineArray = await db.category.create({
    data: { parentId: catL1.id, nameEn: "Line Arrays", nameCn: "线阵列", order: 0, descEn: "High-output modular line array systems for large venues.", descCn: "适用于大型场馆的模块化高输出线阵列系统。" },
  });
  const cSub = await db.category.create({
    data: { parentId: catL1.id, nameEn: "Subwoofers", nameCn: "低音炮", order: 1, descEn: "Deep, punchy low-frequency reinforcement.", descCn: "深沉有力的低频补充。" },
  });
  const cColumn = await db.category.create({
    data: { parentId: catL1.id, nameEn: "Column Speakers", nameCn: "柱式扬声器", order: 2, descEn: "Steerable, slim column loudspeakers for speech and music.", descCn: "可指向、纤薄柱式扬声器，兼顾语言与音乐。" },
  });
  const cPoint = await db.category.create({
    data: { parentId: catL1.id, nameEn: "Point Source", nameCn: "点声源", order: 3, descEn: "Two-way full-range cabinets for small to mid venues.", descCn: "适用于中小型场馆的两分频全频音箱。" },
  });

  // Level 3 under Line Arrays
  const cLA12 = await db.category.create({
    data: { parentId: cLineArray.id, nameEn: "12\" Line Array", nameCn: "12寸线阵列", order: 0 },
  });
  const cLA10 = await db.category.create({
    data: { parentId: cLineArray.id, nameEn: "10\" Line Array", nameCn: "10寸线阵列", order: 1 },
  });
  const cLA8 = await db.category.create({
    data: { parentId: cLineArray.id, nameEn: "8\" Compact Line Array", nameCn: "8寸紧凑型线阵列", order: 2 },
  });

  // Level 2 under Amplifiers
  const cAmpSwitch = await db.category.create({
    data: { parentId: catAmp.id, nameEn: "Switching Amplifiers", nameCn: "数字功放", order: 0 },
  });
  const cAmpClassD = await db.category.create({
    data: { parentId: catAmp.id, nameEn: "Class-D Amplifiers", nameCn: "D类功放", order: 1 },
  });

  // Products
  const productsData = [
    {
      categoryId: cLA12.id, nameEn: "VA-12 Line Array", nameCn: "VA-12 线阵列",
      shortDescEn: "12\" 3-way high-output line array module", shortDescCn: "12寸三分频高输出线阵列模块",
      descEn: "The VA-12 is a 3-way line array module featuring a 12\" neodymium LF driver, 6.5\" mid and 3\" titanium HF compression driver. With 100dB sensitivity and 139dB max SPL, it delivers clear, punchy sound for medium to large touring and fixed installations. The rigging hardware enables arrays up to 24 cabinets with precise 0°-10° splay.",
      descCn: "VA-12 是一款三分频线阵列模块，配备12寸钕磁低音单元、6.5寸中音和3寸钛膜高音压缩驱动器。灵敏度100dB，最大声压139dB，适用于中大型流动演出与固定安装。挂件硬件支持最多24只箱体的阵列，角度0°-10°精准可调。",
      coverImage: IMG.prodLineArray, order: 0, featured: true, status: "listed",
      images: [IMG.prodLineArray, IMG.aboutWorkshop, IMG.solution1],
      specs: [
        { labelEn: "Configuration", labelCn: "结构", valueEn: "3-way", valueCn: "三分频" },
        { labelEn: "LF Driver", labelCn: "低音单元", valueEn: "12\" neodymium", valueCn: "12寸钕磁" },
        { labelEn: "Sensitivity", labelCn: "灵敏度", valueEn: "100 dB", valueCn: "100 dB" },
        { labelEn: "Max SPL", labelCn: "最大声压", valueEn: "139 dB", valueCn: "139 dB" },
        { labelEn: "Frequency Response", labelCn: "频响", valueEn: "60 Hz - 20 kHz", valueCn: "60 Hz - 20 kHz" },
        { labelEn: "Impedance", labelCn: "阻抗", valueEn: "8 Ω", valueCn: "8 Ω" },
      ],
    },
    {
      categoryId: cSub.id, nameEn: "SB-218 Subwoofer", nameCn: "SB-218 低音炮",
      shortDescEn: "Dual 18\" high-power subwoofer", shortDescCn: "双18寸大功率低音炮",
      descEn: "SB-218 is a vented subwoofer housing two 18\" neodymium drivers. Tuned for chest-thumping punch and flat extension to 32Hz, it pairs perfectly with VA-12 line arrays for full-range touring systems.",
      descCn: "SB-218 是一款双18寸钕磁单元的倒相式低音炮。专为冲击力十足的胸口感与至32Hz的平坦延伸而调校，与 VA-12 线阵列组成全频段流动系统。",
      coverImage: IMG.prodSubwoofer, order: 0, featured: true, status: "listed",
      images: [IMG.prodSubwoofer, IMG.solution2],
      specs: [
        { labelEn: "Configuration", labelCn: "结构", valueEn: "Dual 18\"", valueCn: "双18寸" },
        { labelEn: "Sensitivity", labelCn: "灵敏度", valueEn: "107 dB", valueCn: "107 dB" },
        { labelEn: "Max SPL", labelCn: "最大声压", valueEn: "145 dB", valueCn: "145 dB" },
        { labelEn: "Frequency Response", labelCn: "频响", valueEn: "32 - 150 Hz", valueCn: "32 - 150 Hz" },
        { labelEn: "Impedance", labelCn: "阻抗", valueEn: "4 Ω", valueCn: "4 Ω" },
      ],
    },
    {
      categoryId: cColumn.id, nameEn: "CS-8 Column Speaker", nameCn: "CS-8 柱式扬声器",
      shortDescEn: "Steerable 8-channel active column array", shortDescCn: "8通道可指向有源柱式阵列",
      descEn: "CS-8 is an active DSP-controlled column loudspeaker with 8 individually steerable tweeter channels. Ideal for reverberant spaces where speech intelligibility is critical — churches, halls, transit hubs.",
      descCn: "CS-8 是一款带DSP控制的8通道可指向有源柱式扬声器，专为混响时间较长、对语言清晰度要求高的教堂、礼堂、交通枢纽等场所设计。",
      coverImage: IMG.prodColumn, order: 0, featured: false, status: "listed",
      images: [IMG.prodColumn, IMG.solution3],
      specs: [
        { labelEn: "Type", labelCn: "类型", valueEn: "Active column", valueCn: "有源柱式" },
        { labelEn: "Steering", labelCn: "指向", valueEn: "8-channel", valueCn: "8通道" },
        { labelEn: "Max SPL", labelCn: "最大声压", valueEn: "128 dB", valueCn: "128 dB" },
        { labelEn: "Beam Control", labelCn: "波束控制", valueEn: "-15° to +15°", valueCn: "-15° 至 +15°" },
      ],
    },
    {
      categoryId: cAmpSwitch.id, nameEn: "DA-4.800 DSP Amplifier", nameCn: "DA-4.800 DSP 功放",
      shortDescEn: "4x2000W switching amp with DSP & Dante", shortDescCn: "4×2000W 数字功放，带DSP与Dante",
      descEn: "DA-4.800 delivers 4x2000W at 4Ω with integrated 96kHz DSP, FIR filters and Dante networking. Switching topology keeps weight under 12kg while providing tour-grade reliability.",
      descCn: "DA-4.800 在4Ω下提供4×2000W输出，集成96kHz DSP、FIR滤波与Dante网络。开关电源拓扑使其重量低于12kg，同时具备巡演级可靠性。",
      coverImage: IMG.prodAmplifier, order: 0, featured: true, status: "listed",
      images: [IMG.prodAmplifier, IMG.aboutWorkshop],
      specs: [
        { labelEn: "Power", labelCn: "功率", valueEn: "4x2000W @ 4Ω", valueCn: "4×2000W @ 4Ω" },
        { labelEn: "DSP", labelCn: "DSP", valueEn: "96kHz, FIR", valueCn: "96kHz, FIR" },
        { labelEn: "Networking", labelCn: "网络", valueEn: "Dante", valueCn: "Dante" },
        { labelEn: "Weight", labelCn: "重量", valueEn: "11.8 kg", valueCn: "11.8 kg" },
      ],
    },
    {
      categoryId: catMix.id, nameEn: "DM-32 Digital Mixer", nameCn: "DM-32 数字调音台",
      shortDescEn: "32-input digital mixing console with touchscreen", shortDescCn: "32路数字调音台，触摸屏",
      descEn: "DM-32 packs 32 mic preamps, 16 mix buses, 9\" touchscreen and motorized faders into a road-ready chassis. Remote control via iPad and Android.",
      descCn: "DM-32 集成32路话筒前置、16条混音母线、9寸触摸屏与电动推子，箱体坚固便携，支持iPad与Android远程控制。",
      coverImage: IMG.prodMixer, order: 0, featured: false, status: "listed",
      images: [IMG.prodMixer, IMG.solution4],
      specs: [
        { labelEn: "Channels", labelCn: "通道", valueEn: "32 mic in", valueCn: "32路话筒输入" },
        { labelEn: "Mix Buses", labelCn: "母线", valueEn: "16", valueCn: "16条" },
        { labelEn: "Display", labelCn: "屏幕", valueEn: "9\" touch", valueCn: "9寸触摸" },
        { labelEn: "Faders", labelCn: "推子", valueEn: "17 motorized", valueCn: "17路电动" },
      ],
    },
    {
      categoryId: catWireless.id, nameEn: "WM-200 Wireless System", nameCn: "WM-200 无线系统",
      shortDescEn: "Dual-channel digital wireless, 2.4GHz", shortDescCn: "双通道数字无线系统，2.4GHz",
      descEn: "WM-200 is a 2.4GHz dual-channel digital wireless system with auto-scan, true-diversity receivers and 24-bit uncompressed audio. Plug-and-play for presentations and small stages.",
      descCn: "WM-200 是一套2.4GHz双通道数字无线系统，具备自动扫频、真分集接收与24位无压缩音频，即插即用，适合演讲与小型舞台。",
      coverImage: IMG.prodWireless, order: 0, featured: false, status: "listed",
      images: [IMG.prodWireless, IMG.prodMicrophone],
      specs: [
        { labelEn: "Band", labelCn: "频段", valueEn: "2.4 GHz", valueCn: "2.4 GHz" },
        { labelEn: "Channels", labelCn: "通道", valueEn: "Dual", valueCn: "双通道" },
        { labelEn: "Audio", labelCn: "音频", valueEn: "24-bit", valueCn: "24位" },
        { labelEn: "Range", labelCn: "距离", valueEn: "60 m line-of-sight", valueCn: "视距60米" },
      ],
    },
    {
      categoryId: cPoint.id, nameEn: "PX-12 Point Source", nameCn: "PX-12 点声源",
      shortDescEn: "12\" 2-way full-range cabinet", shortDescCn: "12寸两分频全频音箱",
      descEn: "PX-12 is a compact 12\" 2-way point source cabinet for live music, AV and small venues. Coaxial-design option available for accurate phase response.",
      descCn: "PX-12 是一款紧凑型12寸两分频点声源音箱，适用于现场音乐、AV与小型场馆。可选同轴设计以获得精准的相位响应。",
      coverImage: IMG.prodMicrophone, order: 1, featured: false, status: "listed",
      images: [IMG.prodMicrophone],
      specs: [
        { labelEn: "Configuration", labelCn: "结构", valueEn: "2-way", valueCn: "两分频" },
        { labelEn: "LF Driver", labelCn: "低音单元", valueEn: "12\"", valueCn: "12寸" },
        { labelEn: "Max SPL", labelCn: "最大声压", valueEn: "131 dB", valueCn: "131 dB" },
      ],
    },
    {
      categoryId: cAmpClassD.id, nameEn: "DA-2.400 Class-D", nameCn: "DA-2.400 D类功放",
      shortDescEn: "2x400W Class-D installation amp", shortDescCn: "2×400W D类安装功放",
      descEn: "DA-2.400 is a compact 2x400W@8Ω Class-D amplifier for distributed installations. Convection cooled, fanless operation.",
      descCn: "DA-2.400 是一款紧凑型2×400W@8Ω D类功放，适用于分布式安装，自然散热无风扇设计。",
      coverImage: IMG.prodProcessor, order: 0, featured: false, status: "unlisted",
      images: [IMG.prodProcessor],
      specs: [
        { labelEn: "Power", labelCn: "功率", valueEn: "2x400W @ 8Ω", valueCn: "2×400W @ 8Ω" },
        { labelEn: "Cooling", labelCn: "散热", valueEn: "Fanless", valueCn: "无风扇" },
      ],
    },
  ];

  for (const p of productsData) {
    const { images, specs, ...rest } = p as any;
    const created = await db.product.create({
      data: { ...rest, specs: JSON.stringify(specs) },
    });
    if (Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        await db.productImage.create({
          data: { productId: created.id, url: images[i], order: i },
        });
      }
    }
  }

  console.log("Seed complete. Admin: admin / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
