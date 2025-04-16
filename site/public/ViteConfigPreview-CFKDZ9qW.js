const r=`---\r
id: 1743063234403 # 文章id\r
title: Vite 配置一览 # 文章标题\r
description: Vite 配置一览 # 文章描述\r
tags: 前端 Vite # 文章标签\r
archive: # 文章归档\r
recommendations: # 相关推荐id\r
shadow: false # 是否隐藏\r
top: 0 # 是否zhi置顶，数字越大优先级越高\r
---\r
\r
# Vite 配置一览\r
\r
常用配置如下：\r
\r
\`\`\`js title=vite.config.js\r
import { defineConfig } from 'vite';\r
import vue from '@vitejs/plugin-vue';\r
import path from 'path';\r
\r
export default defineConfig({\r
  // 插件配置\r
  plugins: [\r
    vue(), // 使用 Vue 插件，支持 Vue 3\r
  ],\r
\r
  // 基本配置\r
  base: './', // 设置项目的 base URL，默认是 './'，用于部署到子路径\r
  publicDir: 'public', // 设置静态资源目录，默认是 'public'\r
\r
  // 服务器配置\r
  server: {\r
    port: 3000, // 设置开发服务器的端口号\r
    open: true, // 自动打开浏览器\r
    host: 'localhost', // 设置服务器的主机名，允许外部访问\r
    proxy: {\r
      // 设置代理，解决开发环境下的跨域问题\r
      '/api': {\r
        target: 'http://example.com', // 目标服务器地址\r
        changeOrigin: true, // 是否改变请求的 origin\r
        rewrite: (path) => path.replace(/^\\/api/, ''), // 重写路径\r
      },\r
    },\r
  },\r
\r
  // 构建配置\r
  build: {\r
    outDir: 'dist', // 构建输出目录\r
    assetsDir: 'assets', // 静态资源目录\r
    target: 'es2015', // 构建目标浏览器环境\r
    minify: 'esbuild', // 使用 esbuild 进行代码压缩\r
    chunkSizeWarningLimit: 500, // 警告 chunk 大小的限制\r
    rollupOptions: {\r
      // Rollup 配置\r
      output: {\r
        manualChunks: {\r
          // 手动分包\r
          vendor: ['vue', 'vue-router'], // 将这些依赖打包到一个单独的 chunk 中\r
        },\r
      },\r
    },\r
  },\r
\r
  // 路径别名配置\r
  resolve: {\r
    alias: {\r
      '@': path.resolve(__dirname, './src'), // 设置 '@' 别名指向项目根目录下的 src 文件夹\r
      '@assets': path.resolve(__dirname, './src/assets'), // 设置 '@assets' 别名指向 assets 文件夹\r
    },\r
  },\r
\r
  // 环境变量配置\r
  envPrefix: 'VITE_', // 设置环境变量的前缀，默认是 'VITE_'\r
\r
  // 自定义配置\r
  define: {\r
    __APP_VERSION__: '1.0.0', // 自定义全局变量\r
  },\r
});\r
\`\`\`\r
\r
## base\r
\r
默认情况下，\`base\` 的值是 \`/\`，表示项目位于服务器的根路径。如：\`http://example.com/\`。 如果需要在 \`https://example.com/subpath/\` 下访问项目，只需要将 \`base\` 设置为 \`/subpath/\`;\r
\r
\`\`\`js vite.config.js\r
export default defineConfig({\r
  base: '/subpath/',\r
});\r
\`\`\`\r
\r
## server.host\r
\r
\`server.host\` 用于控制开发服务器的主机名。默认情况下绑定到 \`localhost\`，这意味着它只能在本地机器上访问。通过设置 \`server.host\` 可以允许从其他设备访问开发服务器，或者绑定到特定的 IP 地址。\r
\r
#### 设置为 true\r
\r
让开发服务器绑定到所有网络接口，常常为了在同一局域网的其他设备能够访问。\r
\r
\`\`\`js vite.config.js\r
export default defineConfig({\r
  server: {\r
    host: true,\r
  },\r
});\r
\`\`\`\r
\r
![alt text](assets/ViteConfigPreview/image.png)\r
\r
#### 特定的 IP 地址\r
\r
如果你的开发环境有特定的网络配置，需要绑定到某个特定的 IP 地址，可以将 server.host 设置为该 IP 地址。\r
\r
\`\`\`js vite.config.js\r
export default defineConfig({\r
  server: {\r
    host: '192.168.1.100',\r
  },\r
});\r
\`\`\`\r
\r
## server.proxy\r
\r
\`server.proxy\` 配置会在本地开启一个代理服务器进行请求转发，从而解决跨域问题。\r
\r
\`\`\`js title=vite.config.js\r
export default defineConfig({\r
  server: {\r
    proxy: {\r
      '/api': {\r
        target: 'http://example.com', // 后端服务器的地址\r
        changeOrigin: true, // 是否改变请求的 origin\r
        rewrite: (path) => path.replace(/^\\/api/, ''), // 重写路径\r
      },\r
    },\r
  },\r
});\r
\`\`\`\r
\r
> 当请求目标地址是 \`http://example.com/geturl\`，在项目请求地址为 \`/api/geturl\`。\r
\r
## build.target\r
\r
\`build.target\` 指定构建输出的目标浏览器环境。决定了构建过程中使用的 \`JavaScript\` 和 \`CSS\` 的兼容性级别，以确保生成的代码可以在指定的浏览器环境中正常运行。\r
\r
\`build.target\` 的默认值为 \`modules\`，表示生成的代码将使用 ES 模块语法，并且不会进行额外的兼容性转换。如果兼容是现代浏览器，可以使用默认值或者设置为 \`es2015\` 或更高版本。[版本查看](https://esbuild.github.io/content-types/)\r
\r
\`\`\`js title=vite.config.js\r
export default defineConfig({\r
  build: {\r
    target: 'es2015',\r
  },\r
});\r
\`\`\`\r
\r
> 设置的版本越高，打包体积越小，兼容性越差。\r
\r
## build.minify\r
\r
\`build.minify\` 指定构建过程中代码的压缩方式。只可以设置为以下值：\r
\r
- false：禁用代码压缩，SSR 默认值。\r
- 'terser'：使用 Terser 进行代码压缩。\r
- 'esbuild'：使用 esbuild 进行代码压缩，客户端默认值。\r
\r
> esbuild 的速度比 Terser 快 20 到 40 倍，压缩率仅降低 1 到 2%。\r
\r
## build.chunkSizeWarningLimit\r
\r
\`build.chunkSizeWarningLimit\` 用于设置触发警告的 \`chunk\` 大小限制（以 KB 为单位）。默认值是 500 KB。\r
\r
> 在 Vite（以及 Webpack 和其他构建工具）中，\`chunk\` 是指构建过程中生成的代码块。每个 \`chunk\` 包含了一部分代码，这些代码可以是模块、依赖项或其他资源。当你的项目构建时，代码会被分割成多个 \`chunk\`，以便在浏览器中加载。\r
\r
## resolve.alias\r
\r
\`resolve.alias\` 用于设置路径别名。路径别名可以在项目中使用简短的路径引用文件，从而提高代码的可读性和可维护性。\r
\r
\`\`\`js title=vite.config.js\r
export default defineConfig({\r
  resolve: {\r
    alias: {\r
      '@': path.resolve(__dirname, './src'),\r
      '@assets': path.resolve(__dirname, './src/assets'),\r
      '@components': path.resolve(__dirname, './src/components'),\r
    },\r
  },\r
});\r
\`\`\`\r
\r
当访问以下文件时\r
\r
\`\`\`js\r
import variables from '@/styles/variables.scss';\r
import logo from '@assets/logo.png';\r
import MyComponent from '@components/MyComponent.vue';\r
\`\`\`\r
\r
等同于\r
\r
\`\`\`js\r
import variables from '/src/styles/variables.scss';\r
import logo from '/src/assets/logo.png';\r
import MyComponent from '/src/components/MyComponent.vue';\r
\`\`\`\r
\r
## define\r
\r
\`define\` 选项允许定义全局变量，这些变量可以在项目代码中直接使用，而无需额外的导入。\r
\r
\`\`\`js title=vite.config.js\r
import { defineConfig } from 'vite';\r
\r
export default defineConfig({\r
  define: {\r
    __APP_VERSION__: '1.0.0',\r
    __API_URL__: 'http://example.com/api',\r
    __IS_PRODUCTION__: process.env.NODE_ENV === 'production',\r
  },\r
});\r
\`\`\`\r
\r
\`\`\`js\r
console.log(__APP_VERSION__); // 输出: 1.0.0\r
console.log(__API_URL__); // 输出: http://example.com/api\r
console.log(__IS_PRODUCTION__); // 输出: true 或 false\r
\`\`\`\r
\r
> \`define\` 中的值必须是字符串、数字、布尔值等基本类型。如果需要定义对象或数组，可以使用 \`JSON.stringify\` 将其转换为字符串。\r
\r
## 参考\r
\r
[配置 Vite | Vite 官方中文文档](https://vitejs.cn/vite3-cn/config/)  \r
[esbuild - Content Types](https://esbuild.github.io/content-types/)\r
`;export{r as default};
