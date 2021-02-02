// pages/video/video.js
import request from "../../until/request";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		groupList:[], //顶部列表数据
		navId:'', //顶部列表数据的id
		videogroupList:[], //列表对应的视频
		videoId:'',   //点击对应图片的视频列表数据Id
		isTriggered:false,  //下拉刷新的状态是否触发，true表示触发，false则未触发
		videoGroup:[]     //上拉加载更多，因为接口未开发暂无数据
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

		let userInfo =	wx.getStorageSync('userInfo')
			// 判断用户是否登录
		//未登录的话，得到结果是需要登录的提示并跳转
		if (!userInfo){
				wx.showModal({
					title:'你还未登录',
					content: '前往登录？',
					success:(res)=>{
						// console.log(res);
						if(res.confirm){
							wx.reLaunch({url: '/pages/login/login',})
						}
					}
				})
		}else{
				// 调用获取标签的方法
		this.groupListData()
		}
		//停止在播放的事件
		this.BackgroundAudioManager =	wx.getBackgroundAudioManager()  //调用微信音频播放的组件并且实例化
		this.BackgroundAudioManager.onPlay(()=>{
			this.BackgroundAudioManager.stop()
		})
	
		// this.getvideoGroup(this.data.navId) 放在此处获取不到navId的数据
	},
		//点击顶部搜索栏跳转到搜索页面
		toSearch(){
			// console.log('点击了');
		wx.navigateTo({	url: '/pages/search/search'})
	},
	// 1、获取顶部nav标签数据
 async groupListData(){
	 let groupListData = await request('/video/group/list') ;
	 this.setData({
		 groupList:groupListData.data.slice(0,14), //截取显示的navlist
		 navId:groupListData.data[0].id  //标签id
	 })
	 //此设置是为了展示默认获取第一个标签的视频内容
	 this.getvideoGroup(this.data.navId)
},
	// 2、根据navId获取对应的视频内容,此方法将被多次调用
	async getvideoGroup(navId){
		let videoGroupDatata = await request('/video/group',{id:navId});
		// console.log(videoGroupDatata)  
		// 如果获取数据状态被触发则关闭正在加载的效果
		wx.hideLoading();
		// 给数据加上id 添加到wx:key上
		let index = 0;
		// 给每个list标签加上下标
		let videoGroup =videoGroupDatata.datas.map(item=>{
			item.id =index++;
			return item;
		})
		// console.log(videoGroup);
		this.setData({
			videogroupList:videoGroupDatata.datas,
			//下拉刷新事情被触发时,关闭刷新状态
			isTriggered:false
		})
	},
	// 3点击nav标签获得标签的的ID
	navActive(event){
		let navIDData = event.currentTarget.id
		// console.log(typeof navIDData);  //这种清空不了数据
		this.setData({
			navId:navIDData*1,
			videogroupList:[] //切换时 清空列表id数据，让页面清空
		})
		// 切换列表时弹出正在加载
		wx.showLoading({
			title:'正在加载'
		})
		//触发时，回调获取当前页面的navId
		this.getvideoGroup(this.data.navId)
	},
	//点击图片时播放对应vid的视频
	// 为了优化性能，将图片替换成了视频展示内容，其中videoId用于wx:if判断
	handPlay(event){
		let vid = event.currentTarget.id
		this.setData({
			videoId:vid
		})
		this.videoContext = wx.createVideoContext(vid)
		this.videoContext.play()
	},
	//点击视频时停止
	handPlayVideo(event){
		// 需求 只播放一个视频，点击这个视频 上个视频关闭
		// 获取的视频id，对应wx.createVideoContext
		let vid = event.currentTarget.id
		this.vid !== vid && this.videoPlay && this.videoPlay.stop()
		this.vid = vid
		this.videoPlay = wx.createVideoContext(vid)
	},
	//下拉刷新事件的（这是针对scroll）下面的方法也有
	handrefresh(){
		//下拉刷新事件触发时，调用获取视频内容的方法
		this.getvideoGroup(this.data.navId)
	},
	//上拉时加载更多
	handtolower(){
		// let vid =this.data.navId
		// console.log('上拉了')
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
		*生命周期函数--监听页面卸载
	 */

	onUnload: function () {

	},

	//页面相关事件处理函数--监听用户下拉动作,需要在app.json或其他page中json中设置，windos中开启enablePullDownRefresh
	onPullDownRefresh: function () {

	},

	//页面上拉触底事件的处理函数

	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享   传入参数为from
	 */
	onShareAppMessage: function ({from}) {
		// console.log( typeof from)
		if (from === 'button') {
			return {
				title: '来自button',
				path: '/pages/video/video',
				imageUrl: 'http://demo.png',
			}
		} else {
			return {
				title: '来自munu的转发',
				path: '/pages/video/video',
				imageUrl: 'http://demo.png',
			}
		}
	}
})