// pages/index/index.js
const 	appInstance = getApp();
import request from "../../until/request";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		bannerList:[],    //轮播图
		playList:[],     //每日歌曲推荐
		topList:[] ,     //获取排行榜数据
		index:0,			//排行榜的下标
		song:[]				//点击时下标歌曲的数据
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		// 获取轮播图数据
	 let bannerData = await request('/banner',{type:2});
				// console.log(res)
				this.setData({
					bannerList:bannerData.banners
				});
		// 获取每日歌曲推荐数据
		let playListData = await request('/personalized',{limit:10});
				this.setData({
					playList:playListData.result
				})
		//获取排行榜数据
			if(playListData){
		let index = 0;
		let result =[];
		while (index < 6){
			let topListData = await request('/top/list',{idx:index++});
			let topListItem ={name:topListData.playlist.name, tracks:topListData.playlist.tracks}
			result.push(topListItem)
			this.setData({
				topList:result
				})
			}
		}
		this.BackgroundAudioManager =	wx.getBackgroundAudioManager()  //调用微信音频播放的组件并且实例化
	
	},
	//点击排行榜歌曲跳转到songDetail
	
	toSongDetail(event){
			 //获取点击音乐列表的下标
		 let {index,song} = event.currentTarget.dataset;
			//获取点击歌曲的音乐下标
		 this.setData({
			 index
		 })
		// 停止上一个页面在播放的事件，并将最新播放事件更新到全局
		if(song.tracks[this.data.index].id !== appInstance.globalData.ids){
			appInstance.globalData.isMusicPlay =false;
			appInstance.globalData.ids = song.tracks[this.data.index].id
			this.BackgroundAudioManager.stop()
		// })
		}
	
		// 将点击时获取音乐的ids 传给songDetail页面
				wx.navigateTo({
					url: '/pages/songDetail/songDetail?ids='+ song.tracks[this.data.index].id
				})
    },
	//点击每日推荐跳转到推荐页面
	toRecommendsSong(){
			wx.navigateTo({
				url: '/pages/recommendSong/recommendSong',
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