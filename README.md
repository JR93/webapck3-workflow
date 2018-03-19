## 前端构建工作流

主要使用 webpack3 并搭配 npm scripts 开发的满足日常开发需求和场景的易用工作流，支持 jquery/vue/react 三种开发模式。

### 使用

```
拷贝项目：
git clone git@github.com:JR93/workflow.git

安装依赖项：(由于依赖包较多，此安装过程需要几分钟，请耐心等候...)
npm install

开发模式：
npm run dev

生产模式：
npm run prod
```

### 配置选项

配置均在 **config** 目录下的 **index.js** 文件里，根据项目需求进行相对应的配置。

#### globals

*type: Object*

此对象主要是添加一些外部全局变量，对应于 webpack 配置项中的 **externals**，默认已经添加了 **jquery** 全局变量，
若有开启使用vue（选项为：vue），同样会自动添加 **vue** 全局变量。其他全局变量根据项目需要自定义添加。

这样就可以在js文件直接使用：

```
import $ from 'jquery';
import Vue from 'vue';
```

#### provide

*type: Object*

此对象主要是与 **globals** 搭配使用（**推荐**），就可以免 import/require 声明而直接使用全局变量。
同样地，默认已经支持在代码中使用 **$** 和 **Vue** (若 vue: true)。其他全局变量推荐和 **globals** 的配置同步。

#### eslint

*type: Boolean*

是否开启 **eslint** ，推荐开启（**默认**）。这有助于多人开发合作时代码规范一致。

#### hash

*type: Boolean*

是否对打包的资源文件名加hash值，推荐开启（**默认**）。

#### px2rem

*type: Boolean | Number*

是否将px转成rem，推荐开启（**默认**）。

rem基准值默认是75（对应于750px的设计稿）。默认 1px 不转换rem，PX（大写）也不转换rem。

若基准值不想是75（个别情况下），则可以传字符串：64（表示设计稿是640px），或者通过 **postcss** 配置项重置默认 **pxtorem** 的配置。

#### postcss

*type: Object*

自定义 **postcss** 插件配置，默认使用的插件有 **cssnext** 和 *pxtorem** （若 px2rem: true），
其他插件则需要安装和自行配置。比如重置 **pxtorem** 配置项：

```
postcss: {
 'postcss-pxtorem': {
    rootValue: 64,
    unitPrecision: 4,
    propList: ['*'],
    minPixelValue: 2
  }
}
```

#### open

*type: Boolean*

是否开发模式下自动打开浏览器，默认开启。

#### vue

*type: Boolean*

是否使用vue，默认开启。若不使用vue框架，则将其设为 false 。这样就不会加载vue.js。**若使用vue，请记得关闭react选项**

#### react

*type: Boolean*

是否使用react，默认不开启。若使用react框架，则将其设为 true 。同时设置vue选项为false。

#### port

*type: String*

指定端口号，为空则默认是8899。

#### autoprefixer

*type: Boolean*

是否开启autoprefixer，默认开启。

#### sprite

*type: Boolean*

是否开启雪碧图，默认关闭。小图优先使用base64（放置于 img/base64 中），折中保留该功能，仅在PC项目使用。

#### dev

*type: Object*

配置开发环境下的输出目录和cdn前缀。一般保持为默认值即可。

##### dev.publicPath

默认值： '/'

##### dev.outputPath

默认值：path.resolve(__dirname, '../dev')

```
dev: {
  publicPath: '/',
  outputPath: path.resolve(__dirname, '../dev')
}
```

#### prod

*type: Object*

配置生产环境下的输出目录和cdn前缀。输出目录可指定为其他绝对路径。

##### prod.publicPath

默认值： '/'，生产环境若静态资源需要放CDN，可配置对应的前缀路径。

##### prod.outputPath

默认值：path.resolve(__dirname, '../output')

```
prod: {
  publicPath: '/',
  outputPath: path.resolve(__dirname, '../output')
}
```

