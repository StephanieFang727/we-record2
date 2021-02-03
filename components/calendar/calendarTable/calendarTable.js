// components/calendar/calendarTable.js
import create from '../../../utils/create'
import {
  formatDate2,
  transformDate,
  formatDateToMonth,
  getMonthArr,
  getFirstday,
  getPreMonthArr,
  getNextMonthArr, formatDate
} from "../../../utils/util"
import {wxp, getRpx}  from '../../../utils/api';

const calTodoBehavior = require('../../calTodo-behavior')

create.Component({
  options: {
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  },
  // /**
  //  * 组件的属性列表
  //  */
  // properties: {
  //   year: {
  //     type: Number,
  //     value: 0,
  //   },
  //   month: {
  //     type: Number,
  //     value: 0,
  //   }
  // },
  behaviors:[calTodoBehavior],
  use:[
    'month',
    'curDate',
    'calendarData',
    'updateFlag'
  ],
  /**
   * 组件的初始数据
   */
  data: {
    weekArr:['一','二','三','四','五','六','日'],
    curMonthArr: [],
    preArr: [],
    nextArr: [],
    calendarData: '',// 日历事件源数据
    curMonthTodo: {},
    selectedDate: '',
    _count: 0,//用于记录是否是第一次刷新,
    tdStyle: 'height: 100rpx',
    tdHeight: 100,
    showDetailBox: true, // 是否展示下方详情区
    tableMode: "shrink", // table拉伸状态，初始为压缩态
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      // 可以执行一些初始化操作
     // this.initCalendarArr();
     const rgx = getRpx();
     const {windowHeight} = wxp.getSystemInfoSync();
     const tdMaxHeight = (windowHeight*rgx-240)/6;
     const itemNum = Math.floor((tdMaxHeight - (750/7)*0.76)/28);// 日期下方最多可容纳todo条数
     this.setData({
       _count: 1,
       tdMaxHeight,
       itemNum,
     })
    },
    ready: function(){
      this.setData({
        selectedDate: this.store.data.curDate
      })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    // 页面被切换到时也要重新拉一遍数据
    // TODO: 如何避免无用拉取？
    show: function(){
      // this.initCalendarArr()
      // this.getTodoInCurMonth()
    }
  },
  observers: {
    'month': async function(month) {
      console.log(month);
      //
     // TODO 持久化 不用每次都计算
      this.initCalendarArr();  // 初始化日历
      // 如果不是本月，光圈聚焦在当月第一天
      if(month !== formatDateToMonth(new Date())){
        this.setData({
          selectedDate: `${transformDate(month)}/01`
        })
      }else {
        this.setData({
          selectedDate: formatDate2(new Date())
        })
      }
      console.log(this.data.selectedDate);
      console.log('calchange1')
      // 拉取对应月份的事件
      await this.getTodoInCurMonth()
    },
    // 'calendarData': function(){
    //   // if(this.data._count === 1){
    //   //   this.setData({
    //   //     _count: 0
    //   //   })
    //   //   return;
    //   // }
    //   console.log('calchange')
    //   this.getTodoInCurMonth();
    // }
    'updateFlag': async function(updateFlag){
      // todo数据有更新时刷新日历数据，第一次不用刷新
      if(this.data._count === 1){
        this.setData({
          _count: 0
        })
        return;
      }
      console.log('updateFlag')
      await this.getTodoInCurMonth();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // touch日历相关方法
    bindTbodyS: function(e){
      if(e.touches.length !== 1) return;
      this.setData({
      // 触摸起始的X坐标
      startY: e.touches[0].clientY
      })
    },
    bindTbodyM: function(e){
      if(e.touches.length !== 1) return;
      const {startY, tdMaxHeight} = this.data;
      let {tdHeight} = this.data;
      let tdStyle = '';
      let nH = 0;
      // 触摸点的X坐标
      const moveY = e.touches[0].clientY
      // 计算手指起始点的X坐标与当前触摸点的X坐标的差值
      const disY = moveY - startY;
      nH = disY + tdHeight;// todo
      // console.log("tdh"+tdHeight);
      // console.log("nh"+nH);
     // if (disY > 0 ){ // 移动距离大于0，文本层left值等于手指移动距离
        tdStyle = 'height:' + nH + 'rpx';
        if(nH >= tdMaxHeight){
          tdStyle = 'height:' + tdMaxHeight + 'rpx';
        }
        if(nH <= 100){
          // 控制手指移动距离最大值为删除按钮的宽度
          tdStyle = 'height:' + 100 + 'rpx';
        }
      //}
      // 将拼接好的样式设置到当前item中
      this.setData({
        tdStyle
      })
    },
    bindTbodyE: function(e){
      if(e.changedTouches.length !== 1) return;
      const {startY, tdMaxHeight} = this.data;
      let {tdHeight, showDetailBox,tableMode} = this.data;
      let tdStyle = '';
      // 触摸点的X坐标
      const moveY = e.changedTouches[0].clientY;
      // 计算手指起始点的X坐标与当前触摸点的X坐标的差值
      const disY = moveY - startY;
      if(disY > -10 && disY < 10){
        return;
      }
      if (disY >= 10){ // table拉伸
          tdStyle = 'height:' + tdMaxHeight + 'rpx';
          tdHeight = tdMaxHeight;
          tableMode = "stretch"; 
          showDetailBox = false; 
      }
      if (disY <= -10){ // table压缩
        tdStyle = 'height:' + 100 + 'rpx';
        tdHeight = 100;
        tableMode = "shrink";  
        showDetailBox = true; 
      }
      // 将拼接好的样式设置到当前item中
      this.setData({
        tdStyle,
        tdHeight,
        tableMode,
        showDetailBox
      })
      // console.log("tdheight"+this.data.tdHeight);
    },
    // 更新日历相关方法==================================================================================
    initCalendarArr: function(){
      const [year, month] = this.store.data.month.split('-').map(item => parseInt(item));
      const { preArr, curMonthArr, nextArr} = this.getCalendarArr(year, month);
      this.setData({
        preArr,
        curMonthArr,
        nextArr,
      })
    },
    getCalendarArr: function(year, month){
      const curMonthArr = getMonthArr(year, month);
      const preMonthArr = getPreMonthArr(year, month);
      const nextMonthArr = getNextMonthArr(year, month);
      const firstDay = getFirstday(year,month) || 7;
      const preArr =  firstDay !== 1 ? preMonthArr.slice(-1 * firstDay + 1) : [];
      const nextArr = nextMonthArr.slice(0, 42 - curMonthArr.length - firstDay + 1 );
      /**
       * curMonthArr 形如：
       * [{date:2021-01-11,day:11},{date:2021-01-20,day:20},...]
       */
      return{
        preArr,
        curMonthArr,
        nextArr,
      };
    },
    // todo事件=====================================
    // 强制拉取数据
    forceUpdatetAllCalendarTodo: async function(){
      const calendarData = await this.getAllCalendarData();
      this.setData({
        calendarData
      })
      return calendarData;
    },
    // 获取对应月份事件相应方法
    getAllCalendarTodo: async function() {
      // 不用每次都拉取日历事件数据
      let {calendarData} = this.store.data;
      if(calendarData){
        return calendarData;
      }
      calendarData = await this.getAllCalendarData();
      this.store.data.calendarData = calendarData;
      console.log(calendarData);
      return calendarData;
    },
    getTodoInCurMonth: async function(force=false){
      // 不用每次都拉一遍所有数据
      let calendarData = {};
      // if(force){ //强制拉取
      //   calendarData = await this.forceUpdatetAllCalendarTodo();
      // }else{
      //   calendarData = await this.getAllCalendarTodo();
      // } 
      calendarData = await this.getAllCalendarTodo();
      console.log(calendarData);
      let curMonthTodo = {};
      for (let date in calendarData){
        if(date.slice(0,7) === transformDate(this.store.data.month)){
          // console.log(calendarData[day]);
          /**
           * curMonthTodo 形如：{
           * "2021/01/11"：{listData: [], todoCount: 2, isExerise: false},
           * "2021/01/20"：{todoCount: 3, isExerise: false}, 
           * }
           * 
           */
          curMonthTodo[date] = {
            listData:  calendarData[date].listData ? 
            calendarData[date].listData.slice(0,this.data.itemNum) : [],
            todoCount: calendarData[date].todoCount || 0,
            isExerise: calendarData[date].isExerise || false,
          }
        }
      }
      console.log(curMonthTodo);
      this.setData({
        curMonthTodo,
      })
    },
    // 事件处理函数============================
    bindDateTap: function(e){
      this.setData({
        selectedDate: e.currentTarget.dataset.date
      })
    },
    bindDetailTap: function(e){
     this.store.data.date = this.data.selectedDate;
      wx.switchTab({
        url: '/pages/todos/todos',
      })
    },
    bindSwithChange: async function(e){
      await this.setCalendarData(
        {isExerise: e.detail.value},
        this.data.selectedDate,
        this.data.calendarData
      );
      this.store.data.updateFlag = !this.store.data.updateFlag;
    }
  }
})
