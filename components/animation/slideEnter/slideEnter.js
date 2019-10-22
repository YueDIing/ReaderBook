// pages/components/animation/slideEnter/slideEnter.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    direction: {
      type: String,
      value: 'bottom'
    },
    duration: {
      type: Number,
      value: 300
    },
    state: {
      type: Boolean,
      value: false,
      observer(after, bofore, key) {
        const _this = this;
        /* if (after) {
          this.setData({ status: true })
          setTimeout(() => {
            _this.setData({ exec: true })
          }, 50)
        } else {
          this.setData({ exec: false })
          setTimeout(() => {
            _this.setData({ status: false })
          }, this.properties.duration)
        } */


        /* const animation = wx.createAnimation();
        this.animation = animation;

        animation[this.properties.direction](after ? 0 : '-100%').step();
        this.setData({
          animaiton: this.animation.export()
        }) */

        let animation = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease',
        })

        this.animation = animation

        setTimeout(function () {
          animation[this.properties.direction](after ? 0 : '-100%').step({duration: this.properties.duration});
          this.setData({
            animationData:animation.export()
          })
        }.bind(this), 0)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    /* status: false,
    exec: false, */
    animationData: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
