// pages/components/diy-nav/nav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    iconClass: {
      type: String,
      value: "iconback"
    },
    showBackIcon: {
      type: Boolean,
      value: true
    },
    title: {
      type: String,
      value: ""
    },
    detla: {
      type: Number,
      value: 1
    },
    removeFixed: {
      type: Boolean,
      value: false
    },
    nightModel: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    back () {
      wx.navigateBack({
        delta: this.properties.detla
      });
    }
  }
})
