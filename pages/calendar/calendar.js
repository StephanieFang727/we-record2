// pages/calendar/calendar.js
import create from '../../utils/create'
import store from '../../store/index'
import {formatMonth, formatDate2} from  "../../utils/util"


create.Page(store, {
  use:[
    
  ],
  /**
   * 页面的初始数据
   */
  // data: {
  //   year: '',
  //   month: '',
  // },
  // handler:  function (evt) {
  //   console.log(evt)
  // },
  //监听，允许绑定多个
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // store.onChange(this.handler),
    this.store.data.month = formatMonth(new Date().getFullYear(), new Date().getMonth() + 1); 
    this.store.data.curDate = formatDate2(new Date());
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})