// pages/components/animation/fade/fade.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mode: {
      type: Boolean,
      value: true
    },
    duration: {
      type: Number,
      value: 300
    },
    delay: {
      type: Number,
      value: 0
    },
    state: { // 状态切换
      type: Boolean,
      value: false,
      observer (after, before, key) {
        let animation = wx.createAnimation({
          duration: 400,
          timingFunction: 'linear',
          delay: 0,
        });
        this.animation = animation;
        
        setTimeout(function () {
          animation.opacity(after ? 1 : 0).step();
          this.setData({
            animation: this.animation.export()
          })
        }.bind(this), this.properties.delay);
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animation: {}
  }
})
