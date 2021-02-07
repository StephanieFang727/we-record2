export default {
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    logs: [],
    month: 0, //cal用 形如xxxx-xx
    selectedDate: '', //todo用 形如xxxx-xx-xx
    curDate: '',//cal用 形如xxxx/xx/xx
    calendarData: '',// 所有日期中的事件对象
    updateFlag: false, // todo增、修改todo、删 要反馈给calendar进行更新
    lastExerDate: '', // 最近一次锻炼日期 xxxx/xx/xx
    lastTOMDate: '', // 最近一次大姨妈日期 xxxx/xx/xx
    duration: 0, // 姨妈持续日期 为0时不在姨妈期
  },
  //无脑全部更新，组件或页面不需要声明 use
  // updateAll: true,
  debug: true
}