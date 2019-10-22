// pages/chapter/chapter.js
const common = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chapter: {},
    loadingStatus: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    // let {bookId} = options
    const bookId = 7210545;
    const {sign, time, user_id} = common.signData()
    common.request('post', 'http://walden1.shuqireader.com/webapi/book/chapterlist?_=1562155741858', {
      user_id,
      sign,
      bookId,
      timestamp: time
    }).then(res => {
      console.log(res.data)
      if (res.state === '200') {
        let chapterList = Array.from(res.data.chapterList[0].volumeList);
        res.data.chapterList[0].volumeList = []
        _this.setData({
          chapter: res.data
        })
        // 章节过长, 超出数据传输限制, 分批传输
        let sum = 0
        let len = chapterList.length
        let groupSum = 400
        let num = Math.ceil(len / groupSum);
        for (let i = 0; i < num; i++) {
          let key = "chapter.chapterList[0].volumeList[" + i + "]";
          _this.setData({
            [key]: chapterList.slice(sum, sum + groupSum)
          })
          sum += groupSum
        }
        this.setData({
          loadingStatus: false
        })
      }
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

  },
  /**
   * 章节列表 升序或倒序 默认升序
   */
  reverseChapter () {
    let chapter = this.data.chapter.chapterList[0].volumeList.reverse().map(item => item.reverse());
    let len = chapter.length;
    for (let i = 0; i < len; i++) {
      const key = `chapter.chapterList[0].volumeList[${i}]`
      this.setData({
        [key]: chapter[i]
      })
    }
  }
})