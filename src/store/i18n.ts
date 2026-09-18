"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "en" | "cn";

type I18nState = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

export const useI18n = create<I18nState>()(
  persist(
    (set) => ({
      lang: "cn",
      setLang: (l) => set({ lang: l }),
      toggle: () => set((s) => ({ lang: s.lang === "cn" ? "en" : "cn" })),
    }),
    { name: "ac-i18n" }
  )
);

/** Static UI strings used across the site (nav labels, buttons, etc.) */
export const t = {
  nav_home: { en: "Home", cn: "首页" },
  nav_about: { en: "About Us", cn: "关于我们" },
  nav_products: { en: "Products", cn: "产品中心" },
  nav_solutions: { en: "Solutions", cn: "解决方案" },
  nav_news: { en: "News", cn: "新闻资讯" },
  nav_contact: { en: "Contact", cn: "联系我们" },
  nav_admin: { en: "Admin", cn: "后台" },
  read_more: { en: "Read More", cn: "查看更多" },
  view_detail: { en: "View Details", cn: "查看详情" },
  learn_more: { en: "Learn More", cn: "了解更多" },
  submit: { en: "Submit", cn: "提交" },
  back: { en: "Back", cn: "返回" },
  all_products: { en: "All Products", cn: "全部产品" },
  all_categories: { en: "All Categories", cn: "全部分类" },
  featured_products: { en: "Featured Products", cn: "明星产品" },
  product_center: { en: "Product Center", cn: "产品中心" },
  specifications: { en: "Specifications", cn: "技术参数" },
  description: { en: "Description", cn: "产品描述" },
  related_products: { en: "Related Products", cn: "相关产品" },
  cf_title: { en: "Send Us a Message", cn: "在线留言" },
  cf_subtitle: { en: "Tell us about your needs and we'll get back to you within 24 hours.", cn: "告诉我们您的需求，我们将在24小时内与您联系。" },
  cf_company: { en: "Company Name", cn: "公司名称" },
  cf_contact: { en: "Contact Person", cn: "联系人" },
  cf_phone: { en: "Phone Number", cn: "联系电话" },
  cf_email: { en: "Email (optional)", cn: "邮箱（选填）" },
  cf_requirements: { en: "Detailed Requirements", cn: "详细需求" },
  cf_submit: { en: "Submit Inquiry", cn: "提交需求" },
  cf_success: { en: "Thank you! Your inquiry has been received. We will contact you soon.", cn: "感谢您的提交！我们已收到您的需求，将尽快与您联系。" },
  cf_required: { en: "Please fill in all required fields.", cn: "请填写所有必填项。" },
  ci_title: { en: "Get in Touch", cn: "联系方式" },
  ci_phone: { en: "Phone", cn: "电话" },
  ci_email: { en: "Email", cn: "邮箱" },
  ci_address: { en: "Address", cn: "地址" },
  ci_hours: { en: "Business Hours", cn: "工作时间" },
  ci_hours_val: { en: "Mon - Fri, 9:00 - 18:00", cn: "周一至周五 9:00 - 18:00" },
  footer_about: { en: "About Us", cn: "关于我们" },
  footer_about_desc: {
    en: "A leading manufacturer of professional audio systems, delivering exceptional sound experiences worldwide.",
    cn: "专业音响系统领先制造商，致力于为全球用户提供卓越的声音体验。",
  },
  footer_links: { en: "Quick Links", cn: "快速导航" },
  footer_contact: { en: "Contact", cn: "联系我们" },
  footer_follow: { en: "Follow Us", cn: "关注我们" },
  admin_login: { en: "Admin Login", cn: "后台登录" },
  admin_username: { en: "Username", cn: "用户名" },
  admin_password: { en: "Password", cn: "密码" },
  admin_logout: { en: "Logout", cn: "退出登录" },
  admin_dashboard: { en: "Dashboard", cn: "仪表盘" },
  admin_pages: { en: "Pages", cn: "页面管理" },
  admin_categories: { en: "Categories", cn: "分类管理" },
  admin_products: { en: "Products", cn: "产品管理" },
  admin_submissions: { en: "Inquiries", cn: "留言管理" },
  admin_settings: { en: "Settings", cn: "网站设置" },
  admin_back_site: { en: "View Site", cn: "返回前台" },
  add: { en: "Add", cn: "新增" },
  edit: { en: "Edit", cn: "编辑" },
  delete: { en: "Delete", cn: "删除" },
  save: { en: "Save", cn: "保存" },
  cancel: { en: "Cancel", cn: "取消" },
  confirm_delete: { en: "Are you sure to delete this?", cn: "确认删除此项吗？" },
  search: { en: "Search", cn: "搜索" },
  upload: { en: "Upload", cn: "上传" },
  listed: { en: "Listed", cn: "已上架" },
  unlisted: { en: "Unlisted", cn: "已下架" },
  list: { en: "List", cn: "上架" },
  unlist: { en: "Unlist", cn: "下架" },
  featured: { en: "Featured", cn: "推荐" },
  not_featured: { en: "Not Featured", cn: "未推荐" },
  stat_pages: { en: "Site Pages", cn: "页面数量" },
  stat_categories: { en: "Categories", cn: "产品分类" },
  stat_products: { en: "Products", cn: "产品数量" },
  stat_inquiries: { en: "New Inquiries", cn: "新增留言" },
} as const;

export type TKey = keyof typeof t;

export function tr(key: TKey, lang: Lang): string {
  return t[key][lang];
}
