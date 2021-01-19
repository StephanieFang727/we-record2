// components/todo/todoItem/todoItem.js
import {wxp}  from '../../../utils/api';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {},
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    editBtnWidth: 400,
    todoContentWidth: 0,
  },
  lifetimes: {
    attached(){
      const {windowWidth} = wxp.getSystemInfoSync();
      this.setData({
        todoContentWidth: windowWidth-16,
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
  touchS: function(e){
    if(e.touches.length !== 1) return;
    this.setData({
      // 触摸起始的X坐标
      startX: e.touches[0].clientX
    })
  },
  touchM: function(e) {
    if(e.touches.length !== 1) return;
    const {startX} = this.data;
    // 触摸点的X坐标
    const moveX = e.touches[0].clientX
    // 计算手指起始点的X坐标与当前触摸点的X坐标的差值
    const disX = startX - moveX;
    // delBtnWidth 为右侧按钮区域的宽度
    const {editBtnWidth} = this.data;
    let itemStyle = ''
    if (disX == 0 || disX < 0){ // 如果移动距离小于等于0，文本层位置不变
      itemStyle = 'left:0'
    } else if (disX > 0 ){ // 移动距离大于0，文本层left值等于手指移动距离
      itemStyle = 'left:-' + disX + 'rpx'
      if(disX >= editBtnWidth){
        // 控制手指移动距离最大值为删除按钮的宽度
        itemStyle = 'left:-' + editBtnWidth + 'rpx'
      }
    }
    // 获取手指触摸的是哪一个item
    const { id }= e.currentTarget.dataset;
    // 将拼接好的样式设置到当前item中
    this.triggerEvent('curListChange',{
      value: {
        id,
        itemStyle
    }})
  },
  touchE: function(e) {
    if(e.changedTouches.length !== 1) return;
    const {startX} = this.data;
    // 手指移动结束后触摸点位置的X坐标
    const endX = e.changedTouches[0].clientX
    // 触摸开始与结束，手指移动的距离
    const disX = startX - endX
    const {editBtnWidth} = this.data;
    // 如果距离小于删除按钮的1/2，不显示删除按钮
    const itemStyle = disX > 10 ? 'left:-' + editBtnWidth + 'rpx' : 'left:0'
    // 获取手指触摸的是哪一个item
    const { id }= e.currentTarget.dataset;
    // 将拼接好的样式设置到当前item中
    this.triggerEvent('curListChange',{
      value: {
        id,
        itemStyle
    }})
  },
  // item事件处理
  bindTodoTap(e){
    this.triggerEvent('longPress',{
      value: {
        id: e.currentTarget.dataset.id
      }
    })
  },
  bindEditTap(e){
    this.triggerEvent('editTap',{
      value: {
        item: this.data.item
      }
    })
  },
  bindUrgentTap(e){
    this.triggerEvent('urgentTap',{
      value: {
        id: e.currentTarget.dataset.id
      }
    })
  },
  bindDelTap(e){
    this.triggerEvent('delTap',{
      value: {
        id: e.currentTarget.dataset.id
      }
    })
  }
  }
})
