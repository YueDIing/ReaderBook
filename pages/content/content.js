// pages/content2/content2.js
const common = require('../../utils/util');
//  引入dom-parser库 用于解决小程序无法解析xml
const parseXml = require('../../public/script/dom-parser')
// 解码
function decodeChapterContent(string) {
  var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  function decode_chapter_content(code) {
    var bytes = new Uint8Array(4);
    var bytes = '';
    for (var i = 0; i < code.length; i++) {
      var charAt = code.charCodeAt(i);
      if ('A'.charCodeAt(0) <= charAt && charAt <= 'Z'.charCodeAt(0)) {
        charAt = (charAt + 13);
        if (charAt > 'Z'.charCodeAt(0)) {
          charAt = (((charAt % 90) + 65) - 1);
        }
      }
      else if ('a'.charCodeAt(0) <= charAt && charAt <= 'z'.charCodeAt(0)) {
        charAt = (charAt + 13);
        if (charAt > 'z'.charCodeAt(0)) {
          charAt = (((charAt % 122) + 97) - 1);
        }
      }
      bytes += String.fromCharCode(charAt)
    }
    return decode(bytes)
  }
  function _utf8_decode(utftext) {
    var string = "";
    var i = 0;
    // var c = c1 = c2 = 0;
    let c = 0;
    let c1 = 0;
    let c2 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        let c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }
  function decode(input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  }
  return decode_chapter_content(string);
}
// 解码xml并解密文章内容
function decodingContent(xmlString) {
  if (!xmlString.length) return '';
  let domParser = new parseXml.DOMParser();
  const cipherText = domParser.parseFromString(xmlString, 'text/xml');
  return decodeChapterContent(cipherText.lastChild.lastChild.data).replace(/\<br\/\>/g, '\n');
}

let _data = null;
let _this = null;
Page({
  requestContent(chapterId) {
    const bookInfo = this.data.bookInfo
    return common.request('get', `https://c1.shuqireader.com/httpserver/filecache/get_book_content_${bookInfo.bookId}_${chapterId}_1463557822_1_0.xml`);
  },
  // 页面的初始数据
  data: {
    loading: true,
    bookInfo: null,
    chapter: {},
    contents: null,
    screen: {
      width: 0,
      height: 0
    },
    consoleState: false,
    viewConstrol: true,
    menus: {
      directory: { id: 1, name: '目录', icon: 'iconmenu', state: false },
      chapter: { id: 2, name: '章节', icon: 'iconzhangjie', state: false },
      higt: { id: 3, name: '亮度', icon: 'iconliangdu-', state: false },
      setting: { id: 4, name: '设置', icon: 'iconshezhi', state: false }
    },
    chapters: { // 章节参数
      data: null,
      sort: true,
      currentChapters: 0,
      mask: false
    },
    viewConfig: { // 阅读器视觉配置
      fontSize: 16,
      fontType: {
        current: 0,
        lists: ['微软雅黑', '幼圆', '华为行楷', '苹方常规']
      },
      background: {
        current: 0,
        lists: ['#e5c9a2', '#faf9f7', '#fbf5ed', '#e6ebef']
      },
      modes: {
        protection: {state: false, enter: 'iconyanjing1', leave: 'iconyanjing', text:'护眼', enterText: '护眼'},
        daytoNight: {state: false, enter: 'iconliangdu-', leave: 'iconyejian', text: '夜间', enterText: '日间'},
        other: {state: false, enter: 'icongengduo', leave: 'icongengduo', text: '更多', enterText: '更多'}
      }
    },
    menusIndex: null,
    lightNumber: 0,
    books: {},
    contentsTop: 0
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    _data = this.data;
    _this = this;
    const {bookId = 7210545, chapterId = null} = options;
    const {windowWidth: width, windowHeight: height} = wx.getSystemInfoSync();
    // const bookId = 7210545;
    const intBookInfo = {
      bookId,
      bookName: null,
      imgUrl: null,
      reader: true,
      record: true,
      chapterInfo: {
        index: 0,
        prev: false,
        next: true
      }
    }
    // 获取本地书本
    let books = wx.getStorageSync('books');
    books = books.constructor === Object ? books : {};
    const currentBook = books.hasOwnProperty(bookId) ? books[bookId] : intBookInfo;
    const chapterInfo = currentBook.chapterInfo;
    const { sign, time, user_id } = common.signData(bookId);
    const readerConfig = common.getStorage('settingConfig') || common.settingConfig;
    this.setData({ screen: {width, height},  viewConfig: readerConfig })
    const localSettingConfig = wx.getStorageSync('settingConfig');
    if (localSettingConfig && localSettingConfig.constructor === Object) this.setData({ viewConfig: localSettingConfig })

    common.getBook(bookId)
      .then(res => {
        if (res.state === '200') {
          let data = res.data;
          intBookInfo.imgUrl = data.imgUrl;
          this.setData({ bookInfo: data, books})
          return common.request('post', `http://walden1.shuqireader.com/webapi/book/chapterlist?_=${time}`, { user_id, sign, bookId, timestamp: time })
        }
      })
      .then(res => {
        if (res.state === '200') {
          const chapterList = res.data.chapterList[0].volumeList.map(item => { return { chapterId: item.chapterId, chapterName: item.chapterName } });
          this.setData({ ['chapters.data']: chapterList }, () => {
            setTimeout(() => {
              _this.setData({loading: false})
            }, 300)
          })

          if (currentBook.bookName && !chapterId) {
            chapterInfo.prev = chapterInfo.index > 0 ? true : false;
            chapterInfo.next = chapterInfo.index < chapterList.length - 1 ? true : false;
            this.setData({contents: chapterInfo})
          } else {
            let index = !chapterId ? 0 : chapterList.findIndex(item => item.chapterId === chapterId);
            let currentChapter = chapterList[index];
            this.requestContent(currentChapter.chapterId)
              .then(res => {
                currentBook.bookName = _data.bookInfo.bookName;
                currentBook.reader = true;
                chapterInfo.index = index;

                /* chapterInfo.title = currentChapter.chapterName;
                chapterInfo.text = decodingContent(res); */
                chapterInfo.chapterContents = [{ title: currentChapter.chapterName, text: decodingContent(res) }]
                if (chapterId) {
                  chapterInfo.prev = true;
                  chapterInfo.next = false;
                }
                this.setData({ contents: currentBook.chapterInfo});
                books[bookId] = currentBook;
                common.setLocalStorage('books', books);
              })
          }
        }
      })
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {},
  // 生命周期函数--监听页面显示
  onShow: function () {},
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
  // 显示菜单
  show (ev) {
    const {clientX: x, clientY: y} = ev.touches[0];
    let height = _data.screen.height;
    let block = height / 4;
    let consoleState = _data.consoleState;
    if (!_data.consoleState && !_data.menusIndex && (y <= block || y >= height - block)) {
      if (y <= block) {
        console.log('prev');
      } else {
        console.log('next');
      }
      return;
    }

    if (_data.menusIndex) {
      this.setData({ [`menus.${_data.menusIndex}.state`]: false, menusIndex: null })
      return;
    }

    // 展开或收缩菜单
    if (y >= block && y <= height - block) {
      // const setObj = !_data.menusIndex ? {consoleState: !consoleState} : { consoleState: false, [`menus.${_data.menusIndex}.state`]: false, menusIndex: null }
      this.setData({ consoleState: !consoleState })
      return;
    }
  },
  // 显示菜单对应模块
  showCurrent (options) {
    const index = options.currentTarget.dataset.index;
    switch (index) {
      case 'directory':
        this.setData({ ['chapters.mask']: !_data.chapters.mask })
      break;
      case 'higt': // 获取屏幕的亮度
          wx.getScreenBrightness({
            success: (result) => { _this.setData({ lightNumber: result.value * 100 }) }
          });
      break;
    }
    let current = 'menus.' + index + '.state';
    setTimeout(() => {
      _this.setData({
        consoleState: false,
        [current]: !_data.menus[index].state,
        menusIndex: index
      })
    }, 0)
  },
  // 调整亮度
  reSetLight (options) {
    let value = options.detail.value;
    wx.setScreenBrightness({
      value: value / 100
    });
  },
  // 改变字体或背景
  changeSetting (options) {
    let {index, type = null} = options.currentTarget.dataset;
    let str = `viewConfig.${type ? 'fontType' : 'background'}.current`;
    this.setData({ [str]: index });
    common.setLocalStorage('settingConfig', _data.viewConfig);
  },
  settingFontSize (options) {
    const type = options.currentTarget.dataset.type;
    const val = type === 'add' ? 2 : -2;
    let fontSize = _data.viewConfig.fontSize + val;
    if (fontSize < 16 || fontSize > 26) return;
    this.setData({ ['viewConfig.fontSize']: fontSize});
    common.setLocalStorage('settingConfig', _data.viewConfig);
  },
  toggleVieModes (options) {
    let key = options.currentTarget.dataset.key;
    if (key === 'other') {
      wx.showToast({
        title: '待开发~',
        icon: 'none'
      })
      return;
    }
    this.setData({ ['viewConfig.modes.' + key + '.state']: !_data.viewConfig.modes[key].state });
    common.setLocalStorage('settingConfig', _data.viewConfig);
  },
  closedChapterList () {
    this.setData({ ['chapters.mask']: false }, () => {
      setTimeout(() => {
        this.setData({ [`menus.directory.state`]: false, menusIndex: null })
      }, 350)
    })
  },
  handleContest (chapterId = 0, index = 0) {
    if (isNaN(chapterId) || isNaN(index)) return;
    let newChapter = _data.chapters.data[index];
    this.requestContent(newChapter.chapterId)
      .then(res => {
        this.setData({
          contents: {
            index,
            chapterContents:[{title: newChapter.chapterName, text: decodingContent(res)}],
            prev: index > 0 ? true : false,
            next: index < _data.bookInfo.chapterNum - 1 ? true : false
          }
        })
        let books = _data.books;
        books[_data.bookInfo.bookId].chapterInfo = _data.contents;
        common.setLocalStorage('books', books);
      })
  },
  toggleChapter (options) {
    let val = options.currentTarget.dataset.type;
    let index = _data.contents.index + val / 1;
    if (index < 0 || index > _data.bookInfo.chapterNum - 1) {
      wx.showToast({
        title: '往' + index < 0 ? '前' : '后' + '没有章节了！',
        icon: 'none'
      })
      return;
    };
    this.handleContest(_data.chapters.data[index].chapterId, index)
  },
  loadNewChapter (options) {
    let index = options.currentTarget.dataset.index;
    this.handleContest(_data.chapters.data[index].chapterId, index)
  },
  sortChapters () {
    const {data, sort} = _data.chapters;
    this.setData({
      ['chapters.data']: data.sort((a, b) =>  sort ? b.chapterId - a.chapterId : a.chapterId - b.chapterId),
      ['chapters.sort']: !sort
    })
  },
  attachmentChapter () {
    const index = _data.contents.index + 1;
    const chapters = _data.chapters.data;
    const prev = index < 0;
    const next = index > chapters.length - 1;
    if (index < 0 || index > chapters.length - 1) {
      wx.showToast({
        title: '没有更多章节了~',
        icon: 'none'
      })
      return;
    }
    const chapter = chapters[index];
    wx.showLoading({ title: '加载中...' })
    this.requestContent(chapter.chapterId)
      .then(res => {
        let chapterContents = _data.contents.chapterContents;
        let flag = false;
        if (chapterContents.length > 3) {
          chapterContents = [{title: chapter.chapterName, text: decodingContent(res) }];
          flag = true;
        } else {
          chapterContents.push({ title: chapter.chapterName, text: decodingContent(res) });
        }
        let newContents = {
          index,
          prev: !prev,
          next: !next,
          chapterContents
        }
        this.setData({ contents: JSON.parse(JSON.stringify(newContents)) }, () => {
          if (flag) {
            this.setData({ contentsTop: 0 })
          }
        })
        const books = _data.books;
        newContents.chapterContents = [chapterContents[chapterContents.length - 1]];
        books[_data.bookInfo.bookId].chapterInfo = newContents;
        common.setLocalStorage('books', books)
        wx.hideLoading();
      })
  }
})