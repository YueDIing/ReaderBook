//index.js
//获取应用实例
const app = getApp()
const common = require('../../utils/util');
Page({
  data: {
    books: {},
    config: {}
  },
  onLoad: function () {
    this.getBook();
    common.getBaseConfig(this);
  },
  onShow () {
    this.getBook();
    common.getBaseConfig(this);
  },
  getBook () {
    const books = common.getStorage('books') || {};
    this.setData({books})
  }
})
