## 客户端 electron-template ##

<p>electron-template项目用于作为客户端开的模版。</p>

<h1>搭建跨平台桌面应用</h1>
<p>仅仅使用JavaScript,HTML以及CSS</p>
<hr />
<h2>1.软件成分：</h2>
<div>
	<span class="electron-versions-main">Electron: <strong>1.7.5</strong></span> &nbsp;&nbsp;&nbsp;
	<span>Node: <strong>7.9.0</strong></span> &nbsp;&nbsp;&nbsp;
	<span>Chromium: <strong>58.0.3029.110</strong></span> &nbsp;&nbsp;&nbsp;
	<span>V8:<strong>5.8.283.38</strong></span>
</div>
<h2>2.前期工作</h2>
<ol>
	<li>git</li>
	<li>node.js</li>
	<li>node-gyp(全局安装)</li>
	<li>python(需要配置环境变量)</li>
	<li>翻墙工具</li>
</ol>

<h2>3 搭建开发环境</h2>

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
<h2>4.ipc</h2>
<pre><code>
//main.js
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg);  // prints "ping"
  event.sender.send('asynchronous-reply', 'pong');
});

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg);  // prints "ping"
  event.returnValue = 'pong';
});
</code></pre>
<pre><code>
<script>
    const {ipcRenderer} = require('electron');

    console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); 

    ipcRenderer.on('asynchronous-reply', (event, arg) => {
        console.log(arg); // prints "pong"
    });

    ipcRenderer.send('asynchronous-message', 'ping');
</script>
</code></pre>
<h2>5.钱包和U-key</h2>

<h2>6.合约API</h2>

<h2>7.相关链接</h2>
<ol>
	<li>
		<p>electron官网</p>
		<a href="https://electron.atom.io/">https://electron.atom.io/</a>
	</li>
	<li>
		<p>electron中文文档</p>
		<a href="https://github.com/electron/electron/tree/1-6-x/docs-translations/zh-CN">https://github.com/electron/electron/tree/1-6-x/docs-translations/zh-CN</a>
	</li>
	<li>
		<p>Web3 JavaScript app API</p>
		<a href="https://github.com/ethereum/wiki/wiki/JavaScript-API">https://github.com/ethereum/wiki/wiki/JavaScript-API</a>
	</li>
	<li>
		<p>Web3.js 中文文档</p>
		<a href="http://web3.tryblockchain.org/index.html">http://web3.tryblockchain.org/index.html</a>
	</li>
	<li>
		<p>key-manager develop分支</p>
		<a href="http://192.168.9.66/Juzix-ethereum/key-manager/tree/develop">http://192.168.9.66/Juzix-ethereum/key-manager/tree/develop</a>
	</li>
	<li>
		<p>RLP编码</p>
		<a href="http://192.168.9.66/Juzix-ethereum/console-utility">http://192.168.9.66/Juzix-ethereum/console-utility</a>
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
