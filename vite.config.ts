import { fileURLToPath, URL } from "node:url";

import CompressionPlugin from "vite-plugin-compression";
import { createHtmlPlugin as html } from "vite-plugin-html";

const { resolve } = require("path");
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import {
  createStyleImportPlugin,
  AndDesignVueResolve
} from "vite-plugin-style-import";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createStyleImportPlugin({
      resolves: [AndDesignVueResolve()],
      // 如果没有你需要的resolve，可以在lib内直接写
      libs: [
        {
          libraryName: "ant-design-vue",
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/index`;
          },
        },
      ],
    }),
    CompressionPlugin({
      verbose: true, //	是否在控制台输出压缩结果
      algorithm: "gzip", //压缩算法，默认为 gzip。
      ext: ".gz", //压缩后的文件扩展名，默认为 .gz。
      threshold: 102400, //只有大小超过此值（以字节为单位）的文件才会被压缩，默认为 10240 字节（即 100KB）。
      deleteOriginFile: false, //是否删除原始文件，默认为 false，即保留原始文件。
      filter: /.(js|mjs|css)$/i, //用于匹配需要压缩的文件类型的正则表达式，默认为 /.(js|mjs|json|css|html)$/i，即匹配 js、css、html 和 svg 文件。
    }),
    html({
      inject: {
        data: {
          VUE_APP_NAME: "浙江绿色电力管理中心",
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), //运行使用@符代替src目录
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "less-file": "global-class",
          "text-color": "#333",
          "text-gray": "#999",
        },
        javascriptEnabled: true,
      },
    },
    modules: {
      // 自动将 .module.less 结尾的文件视为 CSS Modules 模块
      // 其他的文件仍然按照普通的 CSS 文件处理
      // 修改这里的配置
      localsConvention: "camelCaseOnly",
      generateScopedName: "[local]__[hash:base64:5]",
      globalModulePaths: [/\.module\.\w+$/i],
    },
  },
  optimizeDeps: {
    include: ["ant-design-vue/es/locale/zh_CN"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "ant-design-vue": ["ant-design-vue"],
        }
      }
    }
  }
});
