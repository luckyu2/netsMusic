// pages/personal/personal.js
import request from "../../until/request";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		starty: 0, //开始的位置x
		endy: 0, //结束的位置y
		margintop: 0, //滑动下拉距离
		userInfo:{},  //用户信息
		playList:[] //播放记录
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 获取本地用户信息
	 let userInfo =	wx.getStorageSync('userInfo')
		// console.log(userInfo)
		if (userInfo){
			this.getrecordsPlayList(userInfo.userId)  //
			this.setData({
				userInfo
			})
		}

	},
	// 获取最近播放记录
	async getrecordsPlayList(Id){
		 this.playListData = await request('/user/record',{uid:Id,type:0});
		 // console.log('数据',playListData)
		let index = 0;
		if (this.playListData){
		this.cordsPlayList = this.playListData.allData.splice(0,10).map(item=>{
			item.id = index++;
			return item
		})
		}
			this.setData({
				playList:this.cordsPlayList
			})
	 },



	// 跳转至登录页面
	toLogin(){
		wx.navigateTo({
			url:"/pages/login/login"
		})
	},
	// 下拉回弹效果的
	scrollTouchstart: function (e) {
		let py = e.touches[0].pageY;
		this.setData({
			starty: py
		})
	},
	scrollTouchmove: function (e) {
		let py = e.touches[0].pageY;
		let d = this.data;
		this.setData({
			endy: py,
		})
		if (py - d.starty < 50 && py - d.starty > -50) {
			this.setData({
				margintop: py - d.starty
			})
		}
	},
	scrollTouchend: function (e) {
		this.setData({
			starty: 0,
			endy: 0,
			margintop: 0
		})
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