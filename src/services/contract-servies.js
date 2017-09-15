//
//  contract-servies.js
//  <project>
//  钱包管理
//  用户登录时，调用setPrivateKey 设置用户私钥
//	发布时，记得设置正确的provider节点地址
//  Created by yann_liang on 2017-08-02.
//  Copyright 2017 yann_liang. All rights reserved.

//  2017/8/9
//		合约的操作流程  addContract=》call/sendRawTrasaction 添加合约=》调用合约
//			

//引入web3
let Web3 = require('web3'),
	EthereumTx = require('ethereumjs-tx');

import KeyServies from './key-servise.js'

//内置合约abi,地址
const DEFAULT_ABI = [{
		"constant": false,
		"inputs": [{
			"name": "_moduleName",
			"type": "string"
		}, {
			"name": "_moduleVersion",
			"type": "string"
		}, {
			"name": "_contractName",
			"type": "string"
		}, {
			"name": "_contractVersion",
			"type": "string"
		}],
		"name": "register",
		"outputs": [{
			"name": "",
			"type": "uint256"
		}],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [{
			"name": "_addr",
			"type": "address"
		}],
		"name": "findModuleNameByAddress",
		"outputs": [{
			"name": "_moduleName",
			"type": "uint256"
		}],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [{
			"name": "_contractAddr",
			"type": "address"
		}],
		"name": "IfContractRegist",
		"outputs": [{
			"name": "",
			"type": "bool"
		}],
		"payable": false,
		"type": "function"
	}, {
		"constant": false,
		"inputs": [],
		"name": "unRegister",
		"outputs": [],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [{
			"name": "_moduleName",
			"type": "string"
		}, {
			"name": "_moduleVersion",
			"type": "string"
		}],
		"name": "IfModuleRegist",
		"outputs": [{
			"name": "",
			"type": "bool"
		}],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [{
			"name": "_moduleName",
			"type": "string"
		}, {
			"name": "_moduleVersion",
			"type": "string"
		}],
		"name": "getModuleAddress",
		"outputs": [{
			"name": "_address",
			"type": "address"
		}],
		"payable": false,
		"type": "function"
	}, {
		"constant": false,
		"inputs": [{
			"name": "_fromModuleNameAndVersion",
			"type": "string"
		}, {
			"name": "_fromNameAndVersion",
			"type": "string"
		}, {
			"name": "_toModuleNameAndVersion",
			"type": "string"
		}, {
			"name": "_toNameAndVersion",
			"type": "string"
		}, {
			"name": "_signString",
			"type": "string"
		}],
		"name": "transferContract",
		"outputs": [{
			"name": "_errno",
			"type": "uint256"
		}],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [{
			"name": "_moduleName",
			"type": "string"
		}, {
			"name": "_moduleVersion",
			"type": "string"
		}, {
			"name": "_contractName",
			"type": "string"
		}, {
			"name": "_contractVersion",
			"type": "string"
		}],
		"name": "IfContractRegist",
		"outputs": [{
			"name": "",
			"type": "bool"
		}],
		"payable": false,
		"type": "function"
	}, {
		"constant": false,
		"inputs": [{
			"name": "_moduleName",
			"type": "string"
		}, {
			"name": "_moduleVersion",
			"type": "string"
		}, {
			"name": "_newOwner",
			"type": "address"
		}],
		"name": "changeModuleRegisterOwner",
		"outputs": [{
			"name": "",
			"type": "uint256"
		}],
		"payable": false,
		"type": "function"
	}, {
		"constant": false,
		"inputs": [{
			"name": "_moduleName",
			"type": "string"
		}, {
			"name": "_moduleVersion",
			"type": "string"
		}],
		"name": "register",
		"outputs": [{
			"name": "",
			"type": "uint256"
		}],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [{
			"name": "_addr",
			"type": "address"
		}],
		"name": "findContractVersionByAddress",
		"outputs": [{
			"name": "_contractVersion",
			"type": "uint256"
		}],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [{
			"name": "_addr",
			"type": "address"
		}],
		"name": "findResNameByAddress",
		"outputs": [{
			"name": "_contractName",
			"type": "uint256"
		}],
		"payable": false,
		"type": "function"
	}, {
		"constant": false,
		"inputs": [{
			"name": "_moduleName",
			"type": "string"
		}, {
			"name": "_moduleVersion",
			"type": "string"
		}, {
			"name": "_contractName",
			"type": "string"
		}, {
			"name": "_contractVersion",
			"type": "string"
		}, {
			"name": "_newOwner",
			"type": "address"
		}],
		"name": "changeContractRegisterOwner",
		"outputs": [{
			"name": "",
			"type": "uint256"
		}],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [{
			"name": "_moduleName",
			"type": "string"
		}, {
			"name": "_moduleVersion",
			"type": "string"
		}, {
			"name": "_contractName",
			"type": "string"
		}, {
			"name": "_contractVersion",
			"type": "string"
		}],
		"name": "getContractAddress",
		"outputs": [{
			"name": "_address",
			"type": "address"
		}],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [{
			"name": "_addr",
			"type": "address"
		}],
		"name": "findModuleVersionByAddress",
		"outputs": [{
			"name": "_moduleVersion",
			"type": "uint256"
		}],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [{
			"name": "_pageNum",
			"type": "uint256"
		}, {
			"name": "_pageSize",
			"type": "uint256"
		}],
		"name": "getRegisteredContract",
		"outputs": [{
			"name": "_json",
			"type": "string"
		}],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [{
			"name": "_moduleAddr",
			"type": "address"
		}],
		"name": "IfModuleRegist",
		"outputs": [{
			"name": "",
			"type": "bool"
		}],
		"payable": false,
		"type": "function"
	}, {
		"inputs": [],
		"payable": false,
		"type": "constructor"
	}],
	DEFAULT_ADDRESS = '0x0000000000000000000000000000000000000011';

//是否为数组
const isArray = (o) => {
		return Object.prototype.toString.call(o) === '[object Array]';
	},
	isJson = (obj) => {
		let isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
		return isjson;
	},
	dealArgumentList = (argumentList) => {
		let result = argumentList.map(function(item, index, input) {
			if(isJson(item)) {

				return JSON.stringify(item);
			}
			return item;
		});
		return result;
	},
	dealData = (str) => {
		const code = parseInt(str.substr(2, 64), 16),
			start = parseInt(str.substr(66, 64), 16),
			dataLength = parseInt(str.substr(130, 64), 16) * 2,
			data = str.substr(194, dataLength);
		if(dataLength % 2 == 0) { //当输入够偶数位；
			var StrHex = "";
			for(var i = 0; i < dataLength; i = i + 2) {
				var str = data.substr(i, 2); //16进制；

				var n = parseInt(str, 16); //10进制；
				StrHex = StrHex + String.fromCharCode(n);
			}
		}
		console.log('code==', code, 'data==', data);
		return {
			code: code,
			data: StrHex,
		}
	}

//合约类
class ContractServies {

	constructor() {
		this.web3 = null;
		this.provider = localStorage.getItem('chainInfo') ? JSON.parse(localStorage.getItem('chainInfo')).url : 'http://10.10.8.42:6789'; //节点地址18
		this.privateKey = ''; //用户私钥
		this._contracts = {}; //所有的合约
		this.callbacks = {}; //存放sendRawTrasaction回调函数
		this.wrapCount = 60; //轮询次数
		this.timeout = 60; //超时时间
	}

	setProvider(url) {
		this.provider = url;
		try {
			this.web3 = new Web3(new Web3.providers.HttpProvider(this.provider));
			this.initRegisterContract();
		} catch(e) {
			alert('sorry,找不到链！！！')
		}
	}

	/*
	 * 设置私钥
	 * key 私钥
	 */
	setPrivateKey(key) {
		this.privateKey = key;

	}
	/*
	 * 设置私钥
	 * key 私钥
	 */
	setTimeout(time) {
		this.timeout = time;
	}

	/*
	 * 获取节点地址
	 */
	getProvider() {
		return this.provider;
	}

	/*
	 * 注册一个内置合约
	 * contractName 合约名   来源：合约开发文档/合约代码 
	 * ABI  来源：合约开发文档/合约代码 
	 * address 合约地址    来源：合约部署后的地址 
	 */
	initRegisterContract(ABI = DEFAULT_ABI, address = DEFAULT_ADDRESS) {
		let REGContract = this.web3.eth.contract(ABI),
			_registerInstance = REGContract.at(address),
			registerInstance = {
				ABI: ABI,
				address: address,
				contract: _registerInstance,
			};

		this._contracts["RegisterManager"] = registerInstance;
	};

	/*
	 * 添加合约 合约注册器
	 * contractName 合约名  来源：合约开发文档/合约代码 
	 * ABI   来源：合约开发文档/合约代码  默认查询0.0.1.0版本
	 * address 合约地址   来源：合约部署后的地址 没必传
	 * moduleName  模块名字  来源：合约  没必传 默认查询SystemModuleManager
	 * moduleVersion 模块版本 来源：合约 没必传 默认查询0.0.1.0版本
	 * 
	 */
	addContract(contractName, ABI, address, version = '0.0.1.0', moduleName = 'SystemModuleManager', moduleVersion = '0.0.1.0') {
		//内置合约是否注册
		this._contracts["RegisterManager"] ? '' : this.initRegisterContract();
		let register = this._contracts["RegisterManager"].contract,
			//通过内置合约查找其他合约地址
			queryAddress = register.getContractAddress.call(moduleName, moduleVersion, contractName, version);

		if(queryAddress != "0x0000000000000000000000000000000000000000") {
			address = queryAddress;
		} else if(address === null || address == "(null)") { //空地址
			address = "0x0000000000000000000000000000000000000000";
		} else {}

		let ContractABI = this.web3.eth.contract(ABI),
			contractInstance = ContractABI.at(address),
			registerInstance = {
				ABI: ABI,
				address: address,
				contract: contractInstance,
				version: version,
				moduleName: moduleName,
				moduleVersion: moduleVersion,
			};

		this._contracts[contractName] = registerInstance;

	}

	/* 获取合约实例
	 * contractName 合约名  来源：合约开发文档/合约代码 
	 */
	getContract(contractName) {
		return this._contracts[contractName];
	}

	/*
	 * 查询 --在节点的VM中，直接执行消息调用交易。但不会将数据合并区块链中（这样的调用不会修改状态）。
	 * contractName 合约名  来源：合约开发文档/合约代码 
	 * eventName 方法名  来源：合约开发文档/合约代码 
	 * argumentList 合约方法的参数列表  来源：合约开发文档/合约代码 
	 * 返回结果
	 */
	call(contractName, methodName, argumentList) { //address 合约地址
		try {
			console.log('call方法的url' + this.provider, argumentList);
			const contractInstance = this.getContract(contractName).contract;
			console.log(contractInstance);
			//把json对象转为json字符串
			//argumentList = dealArgumentList(argumentList);

			//加上from
			console.log(argumentList);
			argumentList.push({
				from: KeyServies.getAddress()
			});
			console.log(argumentList);

			let result = contractInstance[methodName].apply(null, argumentList);
			console.log("result:", result);

			return JSON.parse(result);
		} catch(e) {
			console.warn(e);
			return {
				ret: 999,
				messge: '合约异常',
				data: '',

			};
		}

	}

	/*
	 * 发送一个已经签名的交易
	 * contractName 合约名  来源：合约开发文档/合约代码 
	 * eventName 方法名  来源：合约开发文档/合约代码 
	 * argumentList 合约方法的参数列表  来源：合约开发文档/合约代码 
	 * cb 回调函数
	 */
	sendRawTrasaction(contractName, methodName, argumentList, eventName, cb) {
		console.log('sendRawTrasaction==>', contractName, methodName, argumentList, this.privateKey);
		//console.warn('请先执行addContract添加'+contractName+'合约')
		const contractInstance = this.getContract(contractName).contract,
			data = this.getData(contractName, methodName, argumentList),
			txParams = {
				//from就是钱包地址，但是用私钥签名后，钱包地址可以通过签名得到公钥再通过公钥得到钱包地址 不用传
				//from: '0x5fd205613e71810387265e7505997c69c27f9ae9',
				//防重 每次都生成一个新的nonce，用过之后就失效了
				nonce: this.web3.nonce(),
				gasPrice: 21000000000,
				gasLimit: 843314949521407,
				to: contractInstance.address,
				value: 0,
				data: data,
			}; //下删
		console.log('txParams', txParams);
		//钱包签名
		KeyServies.sign(txParams, (serializedTxHex) => {
			let hash = this.web3.eth.sendRawTransaction(serializedTxHex);
			//this.watchEvent(contractName, eventName, hash, cb);
			this.callbacks[hash] = {
				cb: cb,
				wrapCount: this.wrapCount,
			};
			this.getTransactionReceipt(hash);
		})
		/*
		if(this.privateKey) {
			//钱包返回的是buffer 不用Buffer.from了 跳过  假私钥

			//this.privateKey = '3cdae1f148dc5cf4ef551a39e256dc2f54838c636b063a0881d6527f4d325414';
			//let privateKey = Buffer.from(this.privateKey, 'hex');
			//console.log(privateKey)
			//tx.sign(privateKey);

			//真实的 以后用这个 然后把上面的假私钥注释
			//tx.sign(this.privateKey);
			let privateKey = Buffer.from(this.privateKey, 'hex');
			tx.sign(privateKey);

			const serializedTx = tx.serialize();
			let serializedTxHex = "0x" + serializedTx.toString('hex');

			let hash = this.web3.eth.sendRawTransaction(serializedTxHex);
			this.watchEvent(contractName, eventName, hash, cb);
		} else {
			console.warn('请设置私钥==>setPrivateKeyr');
		}*/

	}

	/*
	 * 将参数列表传给合约的getData方法 返回要到发送的数据
	 * contractName 合约名   来源：合约开发文档/合约代码 
	 * eventName 方法名  来源：合约开发文档/合约代码 
	 * argumentList 合约方法的参数列表  来源：合约开发文档/合约代码 
	 */
	getData(contractName, methodName, argumentList) {
		const contractInstance = this.getContract(contractName).contract;
		//把json对象转为json字符串
		argumentList = dealArgumentList(argumentList);
		if(isArray(argumentList)) { //数组
			return contractInstance[methodName].getData.apply(null, argumentList);
		} else if(typeof argumentList == 'string') { //字符串
			return contractInstance[methodName].getData(argumentList);
		} else {
			console.warn('argumentList参数类型不正确！！！');
		}
	}

	/*
	 * 观察
	 * contractName 合约名  来源：合约开发文档/合约代码 
	 * eventName 事件名  来源：合约开发文档/合约代码  问过吴wei妹子 默认为'Notify' 看返回参数是几个
	 * hash 哈希   来源：调用sendRawTrasaction获得的hash
	 * cb 回调函数
	 */
	watchEvent(contractName, eventName = 'Notify', hash, cb) {
		console.log('watchEvent==>', contractName, eventName);

		setTimeout(() => { //合约有点慢 等一下
			const contractInstance = this.getContract(contractName).contract;
			//创建合约事件
			let MyEvent = contractInstance[eventName]({
				_info: contractInstance.address
			}, {
				fromBlock: 0,
				toBlock: 'latest'
			});
			MyEvent.watch(function(errorCode, result) {
				if(result.transactionHash == hash) {
					MyEvent.stopWatching();
					let code = '';
					//合约返回不统一  要判断error/errno
					if(result.args._error !== undefined) {
						//错误码
						code = Number(result.args._error);
					} else {
						//错误码
						code = Number(result.args._errno);
					}
					console.log(contractName + ' ' + eventName + '@result==》', code, result.args._info);
					cb && cb(code, result.args._info);
				}
			});
		}, 1000);

	}

	getTransactionReceipt(hash) {
		console.log('hash', hash);

		let id = '',
			result = this.web3.eth.getTransactionReceipt(hash),
			data = {};
		if(result && result.transactionHash) {
			clearTimeout(id);
			if(hash == result.transactionHash && result.logs) {
				data = dealData(result.logs[0].data);
				this.callbacks[hash].cb(data.code, data.data);
				delete this.callbacks[hash];
			}
		} else {
			if(this.callbacks[hash].wrapCount--) {
				console.log(this.callbacks[hash].wrapCount);
				id = setTimeout(() => {
					this.getTransactionReceipt(hash);
				}, 1000); //this.timeout / this.wrapCount
			} else {
				this.callbacks[hash].cb(1000, '超时');
				console.warn('sendRawTrasaction超时');
				id = '';
				delete this.callbacks[hash];
			}
		}
	}

	/*
	 * 停止观察
	 * 没有用到 没开发
	 */
	stopWatch(contractName, eventName) {

	}

}

export default new ContractServies;