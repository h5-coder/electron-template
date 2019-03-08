# 客户端 electron-template

electron-template项目用于作为客户端开的模版。

## 搭建跨平台桌面应用

仅仅使用JavaScript,HTML以及CSS

-----

### 1.软件成分：

<div>
	<span class="electron-versions-main">Electron: <strong>1.7.5</strong></span> &nbsp;&nbsp;&nbsp;
	<span>Node: <strong>7.9.0</strong></span> &nbsp;&nbsp;&nbsp;
	<span>Chromium: <strong>58.0.3029.110</strong></span> &nbsp;&nbsp;&nbsp;
	<span>V8:<strong>5.8.283.38</strong></span>
</div>

### 2.前期工作

<ol>
	<li>git</li>
	<li>node.js</li>
	<li>node-gyp(全局安装)</li>
	<li>python(需要配置环境变量)</li>
	<li>翻墙工具</li>
</ol>

### 3 搭建开发环境

<pre>
<code>
# Clone the Quick Start repository
$ git clone -b develop http://192.168.9.66/Juzix-ethereum/electron-template
# Go into the repository
$ cd electron-template
# Install the dependencies and run
$ npm install&amp;&amp;npm run dev
</code>
</pre>

<p>但是如果有小伙伴没翻墙，被拦在的寡妇网内，会npm install导致失败，那就用下面这个办法吧（换了源也不好使的话）</p>

<p>用
	<a href="http://npm.taobao.org/">淘宝的镜像</a>安装</p>
<p>用了cnpm 安装依赖后，
	<strong style="color: red;">打包会有问题，</strong>
	<strong style="color: red;">打包会有问题，</strong>
	<strong style="color: red;">打包会有问题，</strong> 找不到依赖的路径!!!
</p>

### 4.ipc

````js
//main.js
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg);  // prints "ping"
  event.sender.send('asynchronous-reply', 'pong');
});

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg);  // prints "ping"
  event.returnValue = 'pong';
});
````

````js
const {ipcRenderer} = require('electron');

console.log(ipcRenderer.sendSync('synchronous-message', 'ping'));

ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log(arg); // prints "pong"
});

ipcRenderer.send('asynchronous-message', 'ping');
````

### 5.钱包和U-key

### 6.合约API

### 7.相关链接

<ol>
	<li>
		<p>electron官网</p>
		<a href="https://electron.atom.io/">https://electron.atom.io/</a>
	</li>
	<li>
		<p>electron中文文档</p>
		<a href="https://github.com/electron/electron/tree/1-6-x/docs-translations/zh-CN">https://github.com/electron/electron/tree/1-6-x/docs-translations/zh-CN</a>
	</li>
</ol>

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


```
