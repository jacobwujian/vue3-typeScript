import router, { asyncRoutes, resetRouter } from "./router";
import NProgress from "nprogress";
import app from "@/main";
import { userStore } from "@/stores/user";

import { menuStore } from "@/stores/menu";
import { breadcrumbStore } from "@/stores/breadcrumb";
import "nprogress/nprogress.css";
import api from "@/api";
import { cPath, accessToken } from "@/utils/constant";
import clonedeep from "lodash.clonedeep";

NProgress.configure({
  showSpinner: false,
});
const whiteList = ["/login", "/screen"];

const redirect404 = [
  {
    path: "/adm:catchAll(.*)",
    redirect: "/404",
    hidden: true,
  },
];

function reLogin(next: Function) {
  next({
    path: "login",
    replace: true,
  });
}

router.beforeEach((to: any, from:any, next: Function) => {
  const store = userStore();
  (<Document>document).title = to.meta.title || "浙江绿色电力";
  NProgress.start();
  const getToken = app.ls.get(accessToken);
  if (whiteList.includes(to.path)) {
    next();
    NProgress.done();
    return true;
  }
  if (getToken) {
    const hasRoles = store && store.userInfo.companyName;
    if (hasRoles) {
      if (
        !router.getRoutes().some((item: any) => {
          if (item.path.includes("organization")) {
            return true;
          }
        })
      ) {
        loadMunes(to, next);
      } else {
        next();
      }
    } else {
      store
        .getUserInfo()
        .then(() => {
          if (to.path.indexOf(cPath) === 0) {
            loadMunes(to, next);
          } else {
            router.addRoutes(redirect404);
            next({
              path: to.path,
              replace: true,
            });
          }
        })
        .catch((e: any) => {
          console.error(e);
          NProgress.done();
          app.ls.remove(accessToken);
          reLogin(next);
        });
    }
  } else if (to && to.meta && to.meta.noPermission) {
    next();
  } else {
    reLogin(next);
  }
});

export const loadMunes = (to: any, next: any) => {
  api.menu
    .getUserMenu()
    .then((res: any) => {
      const store = userStore();
      if (!res.childMenu) res.childMenu = [];
      const resList = res.childMenu;
      let list: any[] = [];
      let asyncRoutesList = clonedeep(asyncRoutes);
      asyncRoutesList[0].children.forEach((item: any) => {
        if (item.children) {
          const findResItem = resList.find(
            (it: any) => it.menuCode === item.name || item.name === "charts"
          );
          if (!findResItem) return false;
          const childList: any[] = [];
          const resItem = findResItem.childMenu || [];
          item.children.forEach((ii: any) => {
            if (
              resItem.some((it: any) => it.menuCode === ii.name) ||
              ii.hidden
            ) {
              childList.push(ii);
            }
          });
          item.children = childList;
        }
        if (store.userInfo.status === 0) {
          if (
            resList.some(
              (it: any) =>
                ((it.menuItem === "机构管理" || it.menuItem === "系统管理") &&
                  it.menuCode === item.name) ||
                item.name === "star"
            )
          ) {
            list.push(item);
          }
        } else {
          if (
            resList.some(
              (it: any) => it.menuCode === item.name || item.name === "star"
            )
          ) {
            if (
              store.userInfo.userType === 2 &&
              item.name === "deviceManagement"
            ) {
            } else {
              list.push(item);
            }
          }
        }
      });
      asyncRoutesList[0].children = list;
      menuStore().setMenulist(asyncRoutesList);
      const routeList = asyncRoutesList.concat(redirect404);
      resetRouter();
      router.addRoutes(routeList);
      next({
        path: to.path,
        replace: true,
      });
    })
    .catch((e: any) => {
      console.error(e);
      reLogin(next);
    });
};

router.afterEach((to: any) => {
  if (to.path.indexOf(cPath) === 0) {
    breadcrumbStore().setBreadcrumb(to.matched);
  }
  NProgress.done();
});
