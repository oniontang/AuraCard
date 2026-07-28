import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 };
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/HomePage.vue"),
      meta: { title: "光语 - 让文字发光" },
    },
    {
      path: "/card",
      name: "card",
      component: () => import("./views/CardPage.vue"),
      meta: { title: "图文卡片 · 光语" },
    },
    {
      path: "/cover",
      name: "cover",
      component: () => import("./views/CoverPage.vue"),
      meta: { title: "封面生成" },
    },
    {
      path: "/image-cards",
      name: "image-cards",
      component: () => import("./views/ImageCardsPage.vue"),
      meta: { title: "AI 图卡" },
    },
    {
      path: "/wechat-typeset",
      name: "wechat-typeset",
      component: () => import("./views/WechatTypesetPage.vue"),
      meta: { title: "文章排版 · 光语" },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("./views/NotFoundPage.vue"),
      meta: { title: "页面不存在" },
    },
  ],
});

router.afterEach((to) => {
  const title = to.meta?.title as string | undefined;
  if (title) document.title = title;
});

export default router;
