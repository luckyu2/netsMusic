// 引入pubsub  页面通信
import Pubsub from "pubsub-js";
import request from "../../until/request";
//引入时间格式化
import moment from "moment"
// 获取全局的的data
const 	appInstance = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isPlay:false,
		musicDetail:[],
		musicId:'',     //音乐ids
		musicLink:'',  //音乐播放地址
		createtime:'00:00', //播放进度
		musictime:'00:00',   //歌曲时长
		brodcastWith:0   //进度条长度
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// options用于接收路由传递的参数，默认值为空对象

		//通过路由跳转获取的音乐ids
		let	idsData = Number(options.ids)
		this.setData({
			musicId:idsData
		})
		//通过调用下面方法并传入的ids来获取音乐详情的信息  对应 获取【音乐详情的信息】的方法
		this.getMusicDetail(idsData)   //此次调用需要加this
		//通过调用下面方法并传入的ids来获取音乐播放地址的信息
		// this.getplayMusicLink(idsData)

		//解决回退到每日推荐，再点击时，播放页面被销毁，播放状态不保存的问题
		if(appInstance.globalData.isMusicPlay && appInstance.globalData.ids ===idsData){
			this.setData({
				isPlay:true
			})
		}else {
			this.setData({
				isPlay:false
			})
		}
		// 解决台播放问题 ，如果不设置，后台播放/暂停功能不能生效
		this.BackgroundAudioManager =	wx.getBackgroundAudioManager()  //调用微信音频播放的组件并且实例化
		//监听微信背景音频频播放事件
		this.BackgroundAudioManager.onPlay(()=>{
			// 播放时全局保存播放音乐的ids数据
			appInstance.globalData.ids = idsData
			//后台播放回调
			this.setData({
				isPlay:true
			})
		})

		//微信背景音频暂停
		this.BackgroundAudioManager.onPause(()=>{
			this.setData({
				isPlay:false
			})
		})
		//监听背景音频播放进度更新事件
		this.BackgroundAudioManager.onTimeUpdate(()=>{
			let durationtime =	this.BackgroundAudioManager.duration //总时长
			let createTimes =this.BackgroundAudioManager.currentTime   //播放时长
			let brodcastWith = (createTimes/durationtime)*400   //进度条长度
			let createtime = moment((createTimes*1000)).format("mm:ss");
			this.setData({
				createtime,
				brodcastWith
			})
		})
		//监听音乐播放结束事件并切换下一首和重置歌曲状态
		this.BackgroundAudioManager.onEnded(()=>{
			// console.log('播放结束')
			//发送数据给recommendsong
			Pubsub.publish('switchType','next')
			// 重置数据
			this.setData({
				brodcastWith:0,
				createtime:'00:00',
				isPlay:false
			})
			//拿到recommendsong的数据并调用相关方法
			Pubsub.subscribe('musicId',(msg,musicId)=>{
				this.getMusicDetail(musicId);
				this.setData({
					isPlay:true
				})
				//这里不要传this.data.musicLink，不然点击下一首时，歌不会播放
				this.playMusic(this.data.isPlay,musicId)
			})
		})
	},
	// 播放器的关闭和暂停的按钮
	playbtn(){
		let isPlay =!this.data.isPlay
		// this.setData({
		// 	isPlay
		// 		})
		// 在全局中保存是否播放的记录
		appInstance.globalData.isMusicPlay= isPlay
		// 点击按钮时播放/暂停时调用方法
		let {musicId,musicLink}=this.data
		// 调用播放方法
		this.playMusic(isPlay,musicId,musicLink)
	},
	//获取音乐详情的信息
	 async getMusicDetail(ids){
	 let musicDetailData = await request('/song/detail',{ids:ids});
	 //音乐时长 用第三方库moment格式时间戳
		 let durationtime = moment(musicDetailData.songs[0].dt).format("mm:ss");

	 this.setData({
		 musicDetail:musicDetailData.songs,
		 musictime:durationtime
	 })
		 //修改窗口顶部的标题
		 wx.setNavigationBarTitle({
			 title: this.data.musicDetail[0].name
		 })
	},

	// 播放和暂停功能的实现
	 async	playMusic(isPlay,musicId,musicLink){
			//解决多次点击播放，多次请求音乐地址的问题
			if(!musicLink) {
				let musicLinkData = await request('/song/url',{id:musicId})
				this.setData({
					musicLink: musicLinkData.data[0].url
				})
			}
				// 【坑：】必须添加title不然音乐不会播放
			if (isPlay){
				this.BackgroundAudioManager.src = this.data.musicLink
				this.BackgroundAudioManager.title= this.data.musicDetail[0].name


			}else {
				this.BackgroundAudioManager.pause() //调用微信音频暂停的方法
			}
		},
	//切换上一首/下一首
	handSwitch(event){
		// console.log(event)
		let type = event.currentTarget.id
		if(type ==='next'){  //下一首
			//发送下一首点击事件
			Pubsub.publish('switchType',type)
		}else {             //上一首
			//给recommendsong发送上一首点击事件
			Pubsub.publish('switchType',type)
		}
		Pubsub.unsubscribe('musicId');  //防多次点击添加数据
		//接收recommendsong发过来的数据
		Pubsub.subscribe('musicId',(msg,musicId)=>{
			this.getMusicDetail(musicId);
			this.setData({
				isPlay:true
			})
			//这里不要传this.data.musicLink，不然点击下一首时，歌不会播放
			this.playMusic(this.data.isPlay,musicId)
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