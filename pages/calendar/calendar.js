// pages/calendar/calendar.js
import create from '../../utils/create'
import store from '../../store/index'
import { formatMonth } from '../../utils/util'

create.Page(store, {
  use:[
    'year',
    'month'
  ],
  /**
   * 页面的初始数据
   */
  // data: {
  //   curMonth: "2021-01",
  //   year: 2021,
  //   month: 1,
  // },
  computed: {
    curMonth() {
      return formatMonth(this.year, this.month);
    }
  },
 // 月份选择处理
  bindMonthChange: function(e){
    const {type} = e.currentTarget.dataset;
    let { year, month } = this.data;
    console.log(year,month);
    if (type === 'back') {
      if( month === 1 ){
        year --;
        month = 12;
      }else {
        month --;
      }
    }
    if(type==='forward'){
      if( month === 12 ){
        year ++;
        month = 1;
      }else {
        month ++;
      }
    }
    this.store.data.year = year;
    this.store.data.month = month;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.store.data.year = new Date().getFullYear();
    this.store.data.month = new Date().getMonth() + 1;
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