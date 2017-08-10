//
//  key.js
//  <project>
//  钱包管理
//  Created by yann_liang on 2017-08-02.
//  Copyright 2017 yann_liang. All rights reserved.
//
import ContractServies from './contract-servies'

const KeyManager = require('key-manager'),
	{
		dialog
	} = require('electron').remote;
	
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
		this.keyObject = null; //钱包对象
		this.keyList = []; //钱包对象列表
		this.privateKey = ''; //钱包私钥

	}

	/*
	 * 创建钱包证书
	 * username 用户名
	 * password 密码
	 * successCB 成功回调 可选
	 * errorCB 失败回调 可选
	 */
	createKey(username, password, successCB, errorCB) {
		const keyObject = KeyManager.createKey(username, password);

		keyObject ? KeyManager.exportToFile(keyObject, this.path, '', (errorCore, outpath) => {
			console.log('createKey', errorCore, outpath);
			if(!errorCore) {
				successCB && successCB(outpath);
			} else {
				errorCB && errorCB();
			}
		}) : (errorCB && errorCB());

	}

	/*
	 * keystore目录名
	 * successCB(usernameList) 成功回调 返回用户名列表
	 * errorCB 失败回调
	 */
	getUserList(successCB, errorCB) {
		KeyManager.importFromDir(this.path, (errorCore, keyObjects) => {
			console.log('getUserList==>', errorCore, keyObjects);
			if(!errorCore) {
				this.keyList = keyObjects;
				let usernameList = [];
				for(let i = 0; i < keyObjects.length; i++) {
					usernameList[i] = keyObjects[i].id;
				}
				successCB && successCB(usernameList);
			} else {
				errorCB && errorCB();
			}
		});
	}

	/*
	 * 登录
	 * username 用户名
	 * password 密码
	 * successCB 成功回调 可选
	 * errorCB 失败回调 可选
	 */
	login(username, password, successCB, errorCB) {
		if(username && password) {
			let keyObject = null;
			for(let i = 0; i < this.keyList.length; i++) {
				if(this.keyList[i].id == username) {
					keyObject = this.keyList[i];
					break;
				}
			}

			KeyManager.recover(password, keyObject, (errorCore, privateKey) => {
				console.log(errorCore, privateKey)
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
		} else if(!username && !password) {
			console.warn('用户名和密码不能为空');
		} else if(!username) {
			console.warn('用户名不能为空');
		} else if(!password) {
			console.warn('密码不能为空');
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
			const index = filename.lastIndexOf('\\'),
				path = filename.substr(0, index),
				name = filename.substr(index, filenames.length);

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
	 * 
	 * successCB 成功回调 可选
	 * errorCB 失败回调 可选
	 */
	importFile(successCB, errorCB) {

		dialog.showOpenDialog({
			filters: FILE_FILTERS,
			//批量导入用
			/*properties:['openFile','openDirectory']*/
		}, (filenames) => {
			//单个导入，取第一个
			const filename = filenames[0];
			KeyManager.restoreKeys(filename, this.path, (errorCore, data) => {
				if(!errorCore) {
					//获取最新的钱包对象[]
					this._updateKeyList();
					successCB && successCB(usernameList);
				} else {
					errorCB && errorCB();
				}
			});
		});

	}

	/*
	 * 重置密码
	 * successCB 成功回调 可选
	 * errorCB 失败回调 可选
	 */
	resetPassword(username, newPassword, oldPassword, successCB, errorCB) {
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
	 * 私有的 更新钱包对象列表 
	 */
	_updateKeyList() {
		this.keyList = KeyManager.importFromDir(this.path);
		console.log(this.keyList)
	}

}

export default new Key;