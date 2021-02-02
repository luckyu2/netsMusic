// 引入pubsub
import Pubsub from "pubsub-js"
import request from "../../until/request";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		day: '',
		month:'',
		times:'',   //时间小时
		musicList:[],  //音乐列表数据
		index:0 ,  //音乐列表的下标
		count:10,	//获取数据的条数
		showList:false	//延迟显示图片
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 判断用户是否登录
		let userInfo =	wx.getStorageSync('userInfo')
		if (!userInfo){
			// console.log('用户未登录的提示')
			wx.showToast({
				title: '请先登录',
				icon:'none',
				success:()=>{
					wx.reLaunch({
						url: '/pages/login/login',
					})
				}
			})
			return
		}
			this.getMusicList()  //调用每日歌曲推荐	
			//延迟歌曲列表显示
			setTimeout(()=>{
				this.setData({
					showList:true
				});
			},250);
		//当前时间
		this.setData({
			day:new Date().getDate(),  //日
			month:new Date().getMonth() +1, // 月
			times:new Date().getHours()   //小时
		})
	
				//【和songdetal的通信】订阅songDetail的点击事件，来拿到上一首/下一首的音乐id
		Pubsub.subscribe('switchType',(msg,type)=>{
			// console.log(msg,data)
			let {musicList,index} = this.data
			//当页面播放到一定位置，调用上拉获取recommendsong数据事件
			switch (index) {
				case 8:
					this.handtolower();
					break;
				case 18:
					this.handtolower();;
					break;
				case 28:
					this.handtolower();
					break
			}
			//判断songDetail穿过来的点击事件
			if(type ==='next'){  //下一首
				// console.log('调用推荐')
				(index === musicList.length - 1)&&(index =-1)
				index =index+1;
			}else {             //上一首
				(index === 0)&&(index = musicList.length)  //当最上一首的index为0时
				index =index-1
			}
			//更新歌曲下标 不然下一首无反应
			this.setData({
				index
			})

			let musicId = musicList[index].id
			// 将音乐ids数据发送给songDetail
			Pubsub.publish('musicId',musicId)
		})

	},
	// 每日推荐歌曲方法
	async getMusicList(){
	 let musicListData = await request('/recommend/songs');
		this.setData({
			musicList:musicListData.data.dailySongs.slice(0,10)
		})
	},
	//上拉刷新事件
	async handtolower(index){
		console.log('到底了')
		let {count}=this.data;
		if(this.data.musicList.length<31){
			count+=10;
			let newmusicListData = await request('/recommend/songs');
			this.setData({
				musicList:newmusicListData.data.dailySongs.slice(index=0,count)
			})
			this.setData({
				count
			})
		}
		console.log(this.data.count)
		// console.log(newMusiclist)

	},

	//点击歌曲列表 跳转到歌曲详情页并传递歌曲ids  路由跳转传参
	 toSongDetail(event){
		// console.log(event)
		 //获取点击音乐列表的下标
		 let {index,song} = event.currentTarget.dataset;
		 this.setData({
			 index
		 })
		// 点击时获取音乐的id 并传给songDetail页
				wx.navigateTo({
					url: '/pages/songDetail/songDetail?ids='+ song.id
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