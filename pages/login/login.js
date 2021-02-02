// pages/login/login.js
import request from "../../until/request";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		phone:null,
		password:null
	},
	// 获取输入数据
	handInput(e){
		// console.log(e.detail.value)
		let type = e.currentTarget.id;
		this.setData({
			[type]:e.detail.value
		})
	},
	// 前端验证
	async login(){
		let {phone,password} = this.data
		if(!phone){
			wx.showToast({
				title:'手机号不能为空',
				icon:'none'
			})
			return
		}
		let regExp =new RegExp(/^1[3|4|5|7|8][0-9]{9}$/)
		if(!regExp.test(phone)){
			wx.showToast({
				title:'手机号不正确',
				icon:'none'
			})
			return
		}
		if(!password){
			wx.showToast({
				title:'密码不能为空',
				icon:'none'
			})
			return
		}
		// 后端验证        isLogin:true传递给request用来判断是否是登录请求
		let result = await request('/login/cellphone',{phone,password,isLogin:true})
		if (result.code === 200){
			wx.showToast({
				title:'登录成功',
			})
			// 将登录的数据存储在本地 下面不需要加{}
			wx.setStorageSync('userInfo', result.profile)

			// wx.switchTab({   //不能用此跳转方法,个人页面不会刷新
			// 	url:"/pages/personal/personal"
			// })
			// 跳转至个人页面
			wx.reLaunch({
				url:"/pages/personal/personal"
			})

		}else if(result.code === 502){
			wx.showToast({
				title:'密码错误',
				icon:'none'
			})
		}else if(result.code === 400||501){
			wx.showToast({
				title:'账户错误或不存在',
				icon:'none'
			})
		}else {
			wx.showToast({
				title:'登录失败，请重新登录',
				icon:'none'
			})
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})