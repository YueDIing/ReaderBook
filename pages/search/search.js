// pages/search/search.js
const app = getApp()
const data = app.globalData
const common = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotSearch: [],
    searchHistory: [],
    showSearchRes: false,
    searchResult: [],
    sum: 20, // 类似书籍的数量
    searchHandleEvent: null, // 保存输入框的ev用于获取值
    config: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取搜索历史
    const searchHistory = wx.getStorageSync('searchHistory');
    if (searchHistory.constructor === Array) this.setData({ searchHistory })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const _this = this;
    wx.request({ // 热门搜索
      url: 'http://read.xiaoshuo1-sm.com/novel/i.php',
      methods: 'get',
      data: {
        do: 'is_payreco',
        id: 8000000, // 用户id
        qtf: 'shuqiApp',
        qtn: 'cpSearchReplace_sug',
        nums: 8, // 热门搜索数量
        shuqi_h5: '',
        _: data.timestamp // 当前时间戳
      },
      success(res) {
        const getData = res.data;
          console.log(getData)
        if (res.statusCode === 200) {
          _this.setData({
            hotSearch: getData.data // 获取的热门搜索列表
          })
        }
      }
    })

    common.getBaseConfig(this);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    common.getBaseConfig(this);
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
    console.log('上拉')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 触底后在请求当前的api, 加20本类似的书籍
    this.data.sum += 20;
    this.searchHandle(this.data.searchHandleEvent)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 请求搜索数据
   */
  searchRequest (value) {
    const _this = this;
    const requestParameter = {
      do: 'is_serchpay',
      page: 1,
      size: this.data.sum, // 类似的书数量
      q: value, // 搜索的书名或作者名
      filterMigu: 1,
      p: 3,
      shuqi_h5: '',
      _: data.timestamp //时间戳
    }
    if (value) {
      wx.request({
        method: 'get',
        url: 'http://read.xiaoshuo1-sm.com/novel/i.php',
        data: requestParameter,
        success(res) {
          const getData = res.data
          if (res.statusCode === 200) {
            console.log(getData)
            _this.addSearchHistory(value)
            const { aladdin, data } = getData
            data.unshift(aladdin)
            _this.setData({
              searchResult: data,
              showSearchRes: true
            })
          }
        }
      })
    }
  },

  /**
   * 点击搜索按钮事件处理
   */
  searchHandle(ev) {
    this.data.searchHandleEvent = ev;
    let value = ev.detail.value // 获取input的值
    this.searchRequest(value)
  },

  /**
   * 从历史搜索中点击搜索
   */
  historySearch (ev) {
    this.searchRequest(ev.currentTarget.dataset.name)
  },

  /**
   * 从热门搜索添加到历史记录
   */
  addHistory (ev) {
    this.addSearchHistory(ev.target.dataset.name);
  },

  /**
   * 添加历史记录
   */
  addSearchHistory (bookName) {
    const history = wx.getStorageSync('searchHistory');
    let record = history && history.constructor === Array ? history : [];
    const query = record.findIndex(item => item === bookName);
    if (query >= 0) {
      record.unshift(record.splice(query, 1)[0])
    } else {
      record.unshift(bookName)
    }
    if (record.length >= 8) record.pop();
    this.setData({searchHistory: record})
    wx.setStorageSync('searchHistory', record)
  }
})