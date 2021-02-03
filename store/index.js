export default {
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    logs: [],
    month: 0, //cal用 形如xxxx-xx
    date: '', //todo用 形如xxxx-xx-xx
    curDate: '',//cal用 形如xxxx-xx-xx
    calendarData: '',// 所有日期中的事件对象
    updateFlag: false, // todo增、修改todo、删 要反馈给calendar进行更新
  },
  //无脑全部更新，组件或页面不需要声明 use
  // updateAll: true,
  debug: true
}