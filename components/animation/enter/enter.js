// pages/components/animation/enter/enter.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    direction: {
      type: String,
      value: 'bottom'
    },
    state: {
      type: Boolean,
      value: false,
      observer (after, before, key) {
        // 第一次进来不显示元素, 防止元素加载完成后显示下滑动画
        if (this.data.showState) this.setData({showState: false})
        this.setData({newState: after})
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    newState: true, // 控制动画显示
    showState: true // 控制首次进入不显示动画
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})
