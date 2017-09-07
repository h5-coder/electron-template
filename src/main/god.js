const Key = require('key-manager');

const god = {
	//钱包
	wallet: {
		data: {
			dwPinType: 1
		},
		sign(argsStr, cb) {
			console.log('wallet', 'sign')
			cb('wahhahahah')
		},
		getList(type, cb) {
			if(type == 1) {
			} else if(type == 2) {
				const result = Key.ukeyEnumDevice();
				if(result.err == 0) {
					cb({
						code: 0,
						msg: '',
						data: result.pbNameList,
					});
				} else {
					cd({
						code: 2,
						msg: '异常',
						data: '',
					})
				}
			} else {
				cb({
					code: 1,
					msg: '不支持的type类型',
					data: '',
				})
			}
		},
		getUKeyAddress(args, cb) {
			if(args.hDev) {
				Key.ukeyECCAddress(args.hDev, (code, res) => {
					console.log(code, res)
					if(code === 0) {
						cb(res.address);
					}
				})
			} else if(args.pbName) {
				Key.ukeyOpenDevice(args.pbName, (code, res) => {
					console.log(code, res)
					if(code === 0) {
						Key.ukeyECCAddress(res.phDev, (code1, res1) => {
							console.log(code1, res1)
							if(code1 === 0) {
								cb(res1.address);
							}
						})
					}
				})
			} else {
				cb({
					code: 1,
					msg: '参数不对',
					data: '',
				})
			}
		},
		genRSAAndECCKey(args, cb) {
			const set = (hDev) => {
				Key.ukeyVerifyPin(hDev, god.wallet.data.dwPinType, args.password, (errorCode, result) => {
					if(errorCode === 0) {
						Key.ukeyRSAGenKey(hDev, (code, res) => {
							console.log('ukeyRSAGenKey', code, res)
							if(code === 0) {
								Key.ukeyECCGenKey(hDev, (code1, res1) => {
									console.log(code1, res1)
									if(code1 === 0) {
										cb({
											code: 0,
											msg: '成功',
											data: '',
										})
									} else {
										cb({
											code: code1,
											msg: '异常',
											data: '',
										})
									}
								})
							} else {
								cb({
									code: code,
									msg: '异常',
									data: '',
								})
							}
						})
					} else {
						cb({
							code: errorCode,
							msg: '密码错误',
							data: '',
						})
					}
				})

			}
			if(args.hDev) {
				set(args.hDev)
			} else if(args.pbName) {
				Key.ukeyOpenDevice(args.pbName, (code, res) => {
					console.log('ukeyOpenDevice', code, res)
					if(code === 0) {
						set(res.phDev);
					}
				})
			} else {
				cb({
					code: 1,
					msg: '参数不对',
					data: '',
				})
			}

		},
		getECCPubKey(args, cb) {
			const get = (hDev) => {
				Key.ukeyECCGetPubKey(hDev, (code, res) => {
					console.log(code, res)
					if(code === 0) {
						cb({
							code: 0,
							msg: '',
							data: res.pbPubKey,
						})

					} else {
						cb({
							code: code,
							msg: '',
							data: '',
						})
					}
				})
			}

			if(args.hDev) {
				set(args.hDev)
			} else if(args.pbName) {
				Key.ukeyOpenDevice(args.pbName, (code, res) => {
					console.log(code, res)
					if(code === 0) {
						get(res.phDev);
					}
				})
			} else {
				cb({
					code: 1,
					msg: '参数不对',
					data: '',
				})
			}

		},

	},
	//合约
	contract: {
		data: {
			url: 'http://10.10.8.42:6789',
		},
		getWeb3Url(args, cb) {
			cb({
				code: 0,
				msg: '',
				data: god.contract.data.url,
			});
		},
		setWeb3Url(url) {
			god.contract.data.url = url;
		}
	},
	//用户
	user: {
		data: {
			userInfo: {
				uuid: '',
				address: '', //userAddr
				publicKey: '',
				privateKey: '', //
			},
		},
		getUserInfo(args, cb) {
			cb({
				code: 0,
				msg: '',
				data: god.user.data.userInfo,
			})
		},
		setUserInfo(args, cb) {
			args.uuid ? god.user.data.userInfo.uuid = args.uuid : '';
			args.address ? god.user.data.userInfo.address = args.address : ''; //userAddr
			args.publicKey ? god.user.data.userInfo.publicKey = args.publicKey : '';
			args.privateKey ? god.user.data.userInfo.privateKey = args.privateKey : '';
		}
	},
	app: {
		data: {
			chainUrl: 'http://10.10.8.42:8080/blockchain-web',
		},
		getAppInfo(args, cb) {
			cb({
				code: 0,
				msg: '',
				data: {
					chainUrl: god.app.data,
				},
			})
		},
		setAppInfo(args, cb) {
			args.chainUrl ? god.app.data.chainUrl = args.chainUrl : '';
		}
	}
}

export default god;