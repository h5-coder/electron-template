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

//内置合约abi,地址
const DEFAULT_ABI = [{
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
		},
		{
			"constant": false,
			"inputs": [],
			"name": "unRegister",
			"outputs": [],
			"payable": false,
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [{
					"name": "_name",
					"type": "string"
				},
				{
					"name": "_version",
					"type": "string"
				}
			],
			"name": "register",
			"outputs": [],
			"payable": false,
			"type": "function"
		},
		{
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
		},
		{
			"constant": true,
			"inputs": [{
					"name": "_name",
					"type": "string"
				},
				{
					"name": "_version",
					"type": "string"
				}
			],
			"name": "getContractAddress",
			"outputs": [{
				"name": "_address",
				"type": "address"
			}],
			"payable": false,
			"type": "function"
		}
	],
	DEFAULT_ADDRESS = '0x0000000000000000000000000000000000000011';

//是否为数组
const isArray=(o)=>{
    return Object.prototype.toString.call(o) === '[object Array]';
}

//合约类
class ContractServies {

	constructor() {
		this.web3 = null;
		this.provider = 'http://192.168.9.18:6789'; //节点地址	
		this.privateKey='';//用户私钥
		this.MetaCoin = null;
		this._contracts = {};//所有的合约
		
		this.initWeb3();
		
		
	}

	initWeb3() {
		/*if(this.web3 != null) {
			this.web3 = new Web3(this.web3.currentProvider);
		} else {
			this.web3 = new Web3(new Web3.providers.HttpProvider(this.provider));
		}*/
		if(this.web3 == null) {
			this.web3 = new Web3(new Web3.providers.HttpProvider(this.provider));
		}

		//return this.web3;
	}

	/*setProvider(url) {
		this.provider = url;
		
	}*/
	
	/*
	 * 设置私钥
	 * key 私钥
	 */
	setPrivateKey(key) {
		this.privateKey = key;
		
	}*
	
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
	initRegisterContract = function(ABI = DEFAULT_ABI, address = DEFAULT_ADDRESS) {
		
		let REGContract = this.web3.eth.contract(ABI),
			_registerInstance = REGContract.at(address),
			registerInstance = {
				ABI: ABI,
				address: address,
				contract: _registerInstance,
			};

		this._contracts["RegisterManager"] = registerInstance;
	}

	/*
	 * 添加合约 合约注册器
	 * contractName 合约名  来源：合约开发文档/合约代码 
	 * ABI   来源：合约开发文档/合约代码 
	 * address 合约地址   来源：合约部署后的地址 
	 */
	addContract(contractName, ABI, address) {console.log(this)
		//内置合约是否注册
		this._contracts["RegisterManager"] ? '' : this.initRegisterContract();
		//默认查询0.0.1版本
		let version = '0.0.1',
			register = this._contracts["RegisterManager"].contract,
			//通过内置合约查找其他合约地址
			queryAddress = register.getContractAddress.call(contractName, version);
		//console.log('queryAddress',queryAddress)
		
		if(queryAddress != "0x0000000000000000000000000000000000000000") {
			address = queryAddress;
		} else if(address === null || address == "(null)") {//空地址
			address = "0x0000000000000000000000000000000000000000";
		} else {}

		let ContractABI = this.web3.eth.contract(ABI),
			contractInstance = ContractABI.at(address),
			registerInstance = {
				ABI: ABI,
				address: address,
				contract: contractInstance,
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
		
		const contractInstance = this.getContract(contractName).contract;
		let result = contractInstance[methodName].apply(null, argumentList);
		
		console.log("result:", result);
		return result;
	
	}

	/*
	 * 发送一个已经签名的交易
	 * contractName 合约名  来源：合约开发文档/合约代码 
	 * eventName 方法名  来源：合约开发文档/合约代码 
	 * argumentList 合约方法的参数列表  来源：合约开发文档/合约代码 
	 * cb 回调函数
	 */
	sendRawTrasaction(contractName, methodName, argumentList, eventName, cb) {
		console.log('sendRawTrasaction==>',contractName, methodName, argumentList, eventName,this.privateKey);
		//console.warn('请先执行addContract添加'+contractName+'合约')
		const contractInstance = this.getContract(contractName).contract,
			data=this.getData(contractName, methodName, argumentList),
			txParams = {
				nonce: this.web3.nonce(),
				gasPrice: 21000000000,
				gasLimit: 9999999999,
				to: contractInstance.address,
				value: 0,
				data: data,
			},
			tx = new EthereumTx(txParams);
			
		if(this.privateKey){
			//钱包返回的是buffer 不用Buffer.from了 跳过  假私钥
			
			this.privateKey='3cdae1f148dc5cf4ef551a39e256dc2f54838c636b063a0881d6527f4d325414';
			let privateKey = Buffer.from(this.privateKey, 'hex');
			console.log(privateKey)
			tx.sign(privateKey);
			
			//真实的 以后用这个 然后把上面的假私钥注释
			//tx.sign(this.privateKey);
			const serializedTx = tx.serialize();
			
			let serializedTxHex = "0x" + serializedTx.toString('hex');
	
			let hash = this.web3.eth.sendRawTransaction(serializedTxHex);
			console.log('hash', hash);
			this.watchEvent(contractName, eventName, hash, cb);
		}else{
			console.log('请设置私钥==>setPrivateKeyr');
		}
		
	}
	
	/*
	 * 将参数列表传给合约的getData方法 返回要到发送的数据
	 * contractName 合约名   来源：合约开发文档/合约代码 
	 * eventName 方法名  来源：合约开发文档/合约代码 
	 * argumentList 合约方法的参数列表  来源：合约开发文档/合约代码 
	 */
	getData(contractName, methodName, argumentList){
		const contractInstance = this.getContract(contractName).contract;

		if (isArray(argumentList)) {//数组
        	return contractInstance[methodName].getData.apply(null, argumentList);
        } else if(typeof argumentList=='string'){//字符串
        	return contractInstance[methodName].getData(argumentList);
        }else{
        	console.warn('argumentList参数类型不正确！！！');
        }
	}
	
	/*
	 * 观察
	 * contractName 合约名  来源：合约开发文档/合约代码 
	 * eventName 方法名  来源：合约开发文档/合约代码 
	 * hash 哈希   来源：调用sendRawTrasaction获得的hash
	 * cb 回调函数
	 */
	watchEvent(contractName, eventName, hash, cb) {
		console.log('watchEvent==>',contractName, eventName);

		setTimeout(() => {
			const contractInstance = this.getContract(contractName).contract;
			//创建合约事件
			let MyEvent = contractInstance[eventName]({
				_info: contractInstance.address
			}, {
				fromBlock: 0,
				toBlock: 'latest'
			});
			MyEvent.watch(function(error, result) {
				if(result.transactionHash == hash) {
					MyEvent.stopWatching();
					console.log(contractName+' '+eventName+'@result==》', result);
					cb && cb(result);
				}
			});
		}, 1000);

	}
	
	/*
	 * 停止观察
	 * 没有用到 没开发
	 */
	stopWatch(contractName, eventName) {
		
	}

}

export default new ContractServies;