//
//  key.js
//  <project>
//  钱包管理
//  key-manager的git url:http://192.168.9.66/Juzix-ethereum/key-manager/tree/develop
//  Created by yann_liang on 2017-08-02.
//  Copyright 2017 yann_liang. All rights reserved.
//
/*
 * 错误码
 * 
 * 1.
 * 2.
 * 3.密码不能为空
 * 4.不支持的type类型
 * 5.初始密码，请修改
 * 6.用户名不能为空
 * 7.用户名和密码不能为空
 * 8.密码错误
 * 
 */

import ContractServies from './contract-servies';
import { ipcMain, ipcRenderer } from 'electron';

const KeyManager = require('key-manager'),
	{
		dialog
	} = require('electron').remote,
	util = require("console-utility"),
	EthereumTx = require('ethereumjs-tx');

//文件过滤
const FILE_FILTERS = [{
		name: 'Json',
		extensions: ['json']
	},
	{
		name: 'All Files',
		extensions: ['*']
	}
];

/*
 * 钱包类
 */
class Key {
	constructor() {
		this.path = ''; //钱包默认保存的路径
		this.keyObject = {}; //钱包对象
		this.keyList = []; //钱包对象列表
		this.privateKey = ''; //钱包私钥
		this.type = ''; //文件证书类型 1软件证书 2U-key
		this.version = '0.0.2';
		this.loginFlag = false;
		this.userId = '';
		this.uuid = '';
		this.password = "";
		this.uKey = {
			phDev: '', //设备句柄
			dwPinType: 1, //PIN类型 0：管理员PIN，1：用户PIN
			showData: "我爱 this world 呵呵哒",
		}

	}

	/*
	 * 创建钱包对象
	 * username 用户名
	 * password 密码
	 * successCB 成功回调 可选
	 * errorCB 失败回调 可选
	 */
	createKey(username, password, successCB, errorCB) {
		let keyObject = KeyManager.createKey(username, password);

		successCB && successCB(keyObject);

		return keyObject;

	}
	/*
	 * 生产钱包文件
	 * keyObject 钱包对象
	 * successCB 成功回调 可选
	 * errorCB 失败回调 可选
	 */
	createFile(keyObject, successCB, errorCB) {
		KeyManager.exportToFile(keyObject, this.path, '', (errorCore, outpath) => {
			if(!errorCore) {
				successCB && successCB(keyObject, outpath);
			} else {
				errorCB && errorCB();
			}
		});

	}
	/*
	 * 获取用户公钥
	 */
	getPublicKey() {
		if(this.type == 1) {
			return KeyManager.getPublicKey(this.privateKey);
		} else if(this.type == 2) {
			return KeyManager.ukeyECCGetPubKey(this.uKey.phDev).pbPubKey;
		}
	}

	/*
	 * 获取用户列表
	 * type 文件证书类型 1软件证书 2U-key
	 * successCB(usernameList) 成功回调 返回用户名列表
	 * errorCB 失败回调
	 */
	getUserList(type, successCB, errorCB) {

		if(type == 1) {
			//回调的有问题 用同步
			this.keyList = KeyManager.importFromDir(this.path);
			let usernameList = this.keyList.map(function(item, index, input) {
				return item.username;
			});
			successCB && successCB(usernameList);
		} else if(type == 2) {
			const result = KeyManager.ukeyEnumDevice()
			if(result.err == 0) {
				successCB && successCB(result.pbNameList);
			} else {
				errorCB && errorCB(result.err);
			}

		} else {
			errorCB && errorCB(4, '不支持的type类型');
		}
	}

	/*
	 * 登录
	 * username 用户名
	 * password 密码
	 * type 文件证书类型 1软件证书 2U-key
	 * successCB 成功回调 可选
	 * errorCB(errorCode,msg) 失败回调 可选 
	 */
	login(username, password, type, successCB, errorCB) {
		console.log(type);
		this._updateKeyList();
		if(username && password) {
			if(type == 1) {
				let keyObject = null;
				for(let i = 0; i < this.keyList.length; i++) {
					if(this.keyList[i].username == username) {
						keyObject = this.keyList[i];
						break;
					}
				}
				KeyManager.recover(password, keyObject, (errorCore, privateKey) => {
					console.log(errorCore, privateKey)
					if(!errorCore) {
						this.privateKey = privateKey;
						this.keyObject = keyObject;
						this.type = 1;
						this.uuid = username;
						this.password = password;
						//发给主进程
						ipcRenderer.send('event', 'user', 'setUserInfo', {
							address: keyObject.address,
							uuid: keyObject.id,
							privateKey: privateKey,
							type: 1,

						});

						//设置钱包私钥
						ContractServies.setPrivateKey(privateKey);
						successCB && successCB();
					} else {
						errorCB && errorCB();
					}
				});
			} else if(type == 2) {
				//创建USBKEY设备上下文并打开USBKEY设备
				KeyManager.ukeyOpenDevice(username, (errorCode, res) => {
					console.log('创建USBKEY设备上下文并打开USBKEY设备', res);
					this.type = 2;
					if(errorCode == 0) {
						console.log(errorCode, res);
						//保存句柄
						this.uKey.phDev = res.phDev;
						//判断是否是初始PIN
						KeyManager.ukeyIsDefaultPin(res.phDev, this.uKey.dwPinType, (errorCode, res1) => {
							console.log(errorCode, res1)
							if(res1.pbDefaultPin) {
								errorCB && errorCB(5, '初始密码，请修改');
							} else {
								KeyManager.ukeyVerifyPin(res.phDev, this.uKey.dwPinType, password, (errorCode, res2) => {
									console.log('ukeyVerifyPin', errorCode, res2);
									if(errorCode == 0) {
										this.uuid = username;
										this.password = password;
										//发给主进程
										ipcRenderer.send('event', 'user', 'setUserInfo', {
											address: KeyManager.ukeyECCAddress(res.phDev).address,
											uuid: username,
											privateKey: '',
											type: 2,

										});
										successCB && successCB();

									} else if(errorCode == -5) {
										errorCB && errorCB(8, '密码错误');
									} else {
										errorCB && errorCB(errorCode, '异常');
									}
								})
							}
						})
					} else {
						errorCB && errorCB(errorCode, '异常');
					}
				})
			} else {
				errorCB && errorCB(4, '不支持的type类型');
			}
		} else if(!username && !password) {
			console.warn('用户名和密码不能为空');
			errorCB && errorCB(7, '用户名和密码不能为空');
		} else
		if(!username) {
			console.warn('用户名不能为空');
			errorCB && errorCB(6, '用户名不能为空');
		} else if(!password) {
			console.warn('密码不能为空');
			errorCB && errorCB(3, '密码不能为空');
		}

	}

	/*
	 * 导出文件
	 * successCB 成功回调 可选
	 * errorCB 失败回调 可选
	 */
	exportFile(successCB, errorCB) {
		dialog.showSaveDialog({
			filters: FILE_FILTERS
		}, (filename) => {
			console.log(filename)
			const index = filename.lastIndexOf('\\'),
				path = filename.substr(0, index),
				name = filename.substr(index, filename.length);
			console.log('path=', path, 'name=', name)
			KeyManager.exportToFile(this.keyObject, path, name, (errorCore, outpath) => {
				console.log('outpath', errorCore, outpath);
				if(!errorCore) {
					successCB && successCB(outpath);
				} else {
					errorCB && errorCB();
				}
			});
		});
	}

	/*
	 * 导入文件 不需要输入密码
	 * successCB 成功回调 可选
	 * errorCB 失败回调 可选
	 */
	importFile(keyObject, successCB, errorCB) {
		KeyManager.exportToFile(keyObject, this.path, keyObject.username + '.json', (errorCore, files) => {
			console.log(errorCore, files)
			if(!errorCore) {
				//获取最新的钱包对象[]
				this._updateKeyList();
				successCB && successCB();
			} else {
				errorCB && errorCB();
			}
		});
	}

	/*
	 * 待定
	 */
	getKeyObjectOfPath(successCB, errorCB) {
		dialog.showOpenDialog({
			filters: FILE_FILTERS,
			//批量导入用
			/*properties:['openFile','openDirectory']*/
		}, (filenames) => {
			//单个导入，取第一个
			const filePath = filenames[0];
			KeyManager.importFromFilePath(filePath, function(errorCore, keyObject) {
				if(!errorCore) {
					/*console.log(keyObject)
					this.keyList = keyObject;
					console.log(this.keyList)
					let usernameList = [];
					for(let i = 0; i < keyObjects.length; i++) {
						usernameList[i] = keyObjects[i].id;
					}*/
					successCB && successCB(filePath, keyObject);
				} else {
					errorCB && errorCB();
				}
			});

		});
	}

	/*
	 * 重置密码
	 * 
	 * 
	 * type 类型
	 * successCB 成功回调 可选
	 * errorCB 失败回调 可选
	 * 
	 */
	resetPassword(username, newPassword, oldPassword, type, successCB, errorCB) {
		type = type || this.type;

		if(type == 1) {
			let keyObject = null;
			//找出相应的钱包
			for(let i = 0; i < this.keyList.length; i++) {
				if(this.keyList[i].id == username) {
					keyObject = this.keyList[i];
					break;
				}
			};

			//重置相应钱包的密码
			KeyManager.resetPassword(oldPassword, newPassword, keyObject, (errorCore, newKeyObject) => {
				if(!errorCore) {
					//将新的钱包保存到默认目录
					KeyManager.exportToFile(newKeyObject, this.path, '', (errorCore, outpath) => {
						if(!errorCore) {
							//获取最新的钱包对象[]
							this._updateKeyList();
							successCB && successCB(outpath);
						} else {
							errorCB && errorCB();
						}
					});
				} else {
					errorCB && errorCB();
				}
			});
		} else if(type == 2) {
			let phDev = this.uKey.phDev ? this.uKey.phDev : KeyManager.ukeyOpenDevice(username).phDev;
			console.log(phDev, this.uKey.dwPinType, oldPassword, newPassword);
			KeyManager.ukeyChangePin(phDev, this.uKey.dwPinType, oldPassword, newPassword, (errorCode, res) => {
				console.log(res)
				if(errorCode == 0) {
					successCB && successCB();
				} else {
					errorCB && errorCB(errorCore, '异常');
				}
			})
		}

	}

	/*
	 * 设置钱包的属性，属性值
	 * key 属性
	 * value 值
	 */
	setWallet(key, value) {
		this.keyObject[key] = value;
		//写入文件
		KeyManager.exportToFile(this.keyObject, this.path, '');
		//更新钱包对象列表 
		this._updateKeyList();
	}

	/*
	 * 解出用户私钥
	 * password 密码
	 * keyObject钱包对象
	 * successCB
	 * errorCB
	 */
	recover(password, keyObject, successCB, errorCB) {
		console.log(password, keyObject)
		KeyManager.recover(password, keyObject, (errorCore, privateKey) => {
			console.log(errorCore, privateKey);
			if(!errorCore) {
				this.privateKey = privateKey;
				this.keyObject = keyObject;
				//设置钱包私钥
				ContractServies.setPrivateKey(privateKey);
				successCB && successCB();
			} else {
				errorCB && errorCB();
			}
		});
	}

	/*
	 * 获取地址
	 */
	getAddress() {
		if(this.type == 1) {
			return this.keyObject.address;
		} else if(this.type == 2) {
			return KeyManager.ukeyECCAddress(this.uKey.phDev).address;
		} else {
			return '';
		}
	}

	/*
	 * 签名
	 */
	sign(rawTx, successCB, errorCB) {
		if(this.type == 1) {
			const tx = new EthereumTx(rawTx);
			let privateKey = Buffer.from(this.privateKey, 'hex');
			tx.sign(privateKey);

			const serializedTx = tx.serialize();
			let serializedTxHex = "0x" + serializedTx.toString('hex');
			successCB && successCB(serializedTxHex);
		} else if(this.type == 2) {
			rawTx.nonce=0x00;
			console.log(JSON.stringify(rawTx))
			util.rlp(rawTx, (errorCore, res) => {
				if(errorCore === 0) {
					console.log('rlp',errorCore, res)
					var pbMsgRlp = 'F901FA808504E3B292008502540BE3FF941176FD5DC45001002EB2B893E5EF7C488475640780B901D4B1498E290000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000018A7B226964223A227371732D31222C226E616D65223A22535153222C22706172656E744964223A2261646D696E222C226465736372697074696F6E223A22626C6F636B636861696E20706C6174222C22636F6D6D6F6E4E616D65223A225465737431222C2273746174654E616D65223A224744222C22636F756E7472794E616D65223A22434E222C22656D61696C223A227465737431403132362E636F6D222C2274797065223A312C22656E6F64654C697374223A5B7B227075626B6579223A2230783331643137376235623261626133396531633330366331623333383334643234356538356435373763343332366237363162373334323365636139303063616536366638376432333430633135356634303238353832303663396533656566653830376363323433616636323864623138363064393965373132653535343862222C226970223A223139322E3136382E31302E3335222C22706F7274223A223130303031227D5D2C22726F6C6549644C697374223A5B5D2C2266696C6549644C697374223A5B5D7D000000000000';
					KeyManager.ukeyECCSign(this.uKey.phDev, res, "我爱 this world 呵呵哒", (errorCore, res2) => {
							console.log('ukeyECCSign', errorCore, res2)
							if(errorCore === 0) {
								successCB && successCB(res2.pbSignRlp);
							}
						})
					/*KeyManager.ukeyVerifyPin(this.uKey.phDev, '0', 'jz1234', (code, res1) => {
						console.log('签名', this.uKey.phDev, res, this.uKey.showData)
						console.log('验证管理员pin', code, res1);
						
					})*/s
				}
			})

			//return ;
		} else {
			return '';
		}
	}

	/*
	 * 改变用户登录状态
	 *
	 */
	changeUserId(userId) {
		this.userId = userId;
	}

	/*
	 * 判断用户是否登录
	 */
	getUserId() {
		return this.userId;
	}

	/*
	 * 改变用户登录状态
	 * 
	 */
	changeLoginStatus(bool) {
		this.loginFlag = bool;
	}

	/*
	 * 判断用户是否登录
	 */
	isLogin() {
		return this.loginFlag;
	}

	/*
	 * 私有的 更新钱包对象列表 
	 */
	_updateKeyList() {
		this.keyList = KeyManager.importFromDir(this.path);
		console.log('软件证书列表', this.keyList)
	}

}

export default new Key;