// pages/bookInfo/bookInfo.js
const app = getApp();
const data = app.globalData;
const common = require('../../utils/util')
let _data = null;
Page({
  // 页面的初始数据
  data: {
    bookInfo: {}, // 书本信息
    descDetails: false,
    loadingStatus: true,
    comments: {},
    books: {},
    currentBookConfig: {},
    config: null
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    // 获取书本信息以及章节
    const _this = this;
    _data = this.data;
    const bookId = options.bookId || 7210545;
    const books = wx.getStorageSync('books') || {};
    const current = books[bookId] || {};
    common.getBaseConfig(this);
    this.setData({books})
    if (current) {
      this.setData({currentBookConfig: current});
    }
    // const bookId = options.bid; // 当前书本的id
    const {sign, time, user_id} = common.signData(bookId); // 书本的加密字段
    common.request('post', 'http://walden1.shuqireader.com/webapi/book/info/?_=1561709343009', {
      bookId, 
      user_id,
      timestamp: time,
      sign
    }).then(res => {
      const getData = res.data;
      if (res.state / 1 === 200) {
        console.log(getData)
        this.setData({
          bookInfo: getData
        })
        const authorId = getData.authorId
        // 获取评论信息
      
        let size = 3;
        return common.request('get', `http://read.xiaoshuo1-sm.com/novel/i.php?do=sp_get&authorId=${authorId}&bookId=${bookId}&fetch=merge&sqUid=${user_id}&source=store&size=${size}&page=1&shuqi_h5=&_=${data.timestamp}`)
      }
    }).then(res => {
      const getData = res.data
      if (res.status / 1 === 200) {
        getData.map(item => {
          item.pubTime = app.dateTostr(item.pubTime).dateTime
          return item;
        })
        _this.setData({
          comments: res,
          loadingStatus: false // 是否显示页面
        })
      }
    }).catch(error => console.log(error))
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {},
  // 生命周期函数--监听页面显示
  onShow: function () {
    // 当第一次点击开始阅读后, 然后在返回回来, 将 开始阅读 按钮文本修改为 继续阅读
    const bookId = this.data.bookInfo.bookId;
    common.getBaseConfig(this);
    if (bookId) {
      const books = wx.getStorageSync('books');
      const queryBook = books.find(item => item.bookId == bookId)
      if (queryBook) {
        // this.setData({ ['localBookInfo.readerState']: queryBook.readerState })
      }
    }
  },
  // 生命周期函数--监听页面隐藏
  onHide: function () {},
  // 生命周期函数--监听页面卸载
  onUnload: function () {},
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {},
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {},
  // 用户点击右上角分享
  onShareAppMessage: function () {},
  expandText () { // 显示或隐藏 简介
    this.setData({
      descDetails: !this.data.descDetails
    })
  },
  // 添加到书架
  addBookshelf () {
    console.log(123)
    let currentBook = _data.currentBookConfig;
    currentBook.record = true;
    let books = _data.books;
    books[_data.bookInfo.bookId] = currentBook;
    this.setData({ currentBookConfig: currentBook, books })
    common.setLocalStorage('books', books)
  }
})