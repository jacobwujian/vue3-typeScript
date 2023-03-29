import debounce from "lodash.debounce";
import { onMounted, onActivated, onBeforeUnmount } from "vue";

export function resize(chart: any) : void{
  let sidebarElm: any = null;
  let resizeHandler: any = null;
  // 监听屏幕尺寸变化
  const initListener = () => {
    resizeHandler = debounce(() => {
      resize();
    }, 100);
    window.addEventListener("resize", resizeHandler);

    sidebarElm = document.getElementsByClassName("ant-layout-sider")[0];
    sidebarElm &&
      sidebarElm.addEventListener("transitionend", sidebarResizeHandler);
  };
  //如果宽度改变就去调用resizeHandler所指向的方法
  const sidebarResizeHandler = (e: any) => {
    if (e.propertyName === "width") {
      resizeHandler();
    }
  };
  //移除监听
  const destroyListener = () => {
    window.removeEventListener("resize", resizeHandler);
    resizeHandler = null;

    sidebarElm &&
      sidebarElm.removeEventListener("transitionend", sidebarResizeHandler);
  };
  //重新绘制chart
  const resize = () => {
    chart && chart.resize();
  };

  onMounted(() => {
    initListener();
  });

  onActivated(() => {
    if (!resizeHandler) {
      // avoid duplication init
      initListener();
    }
  });
  // when keep-alive chart activated, auto resize

  onBeforeUnmount(() => {
    destroyListener();
  });
}
