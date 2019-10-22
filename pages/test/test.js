Page({
  data: {
    animationData: {},
    state: false
  },
  onShow: function(){
    /* var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })

    this.animation = animation
    // animation.opacity(.2).step();

    setTimeout(function () {
      animation.left('100%').step();
      this.setData({
        animationData:animation.export()
      })
    }.bind(this), 1000) */
  },

  methods: {
  },
  tap () {
    this.setData({ state: !this.data.state });
  }
})