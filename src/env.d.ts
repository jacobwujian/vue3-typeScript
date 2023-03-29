/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  // 因为创建组件的时候没用DefineComponent声明，所以ts检查导入的时候会报错
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
// 解决引入base-64爆红的问题
declare module "base-64" {
  const base64: {
    decode(input: string): any;
    encode(input: string): any;
  };
  export default base64;
}

// 环境变量 TypeScript的智能提示
interface ImportMetaEnv {
  VUE_APP_NAME: string;
  NODE_ENV: string;
  VUE_APP_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
