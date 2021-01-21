// components/calendar/calendarTable.js
import create from '../../../utils/create'
import { 
  getMonthArr,
  getFirstday,
  getPreMonthArr,
  getNextMonthArr,
} from "../../../utils/util"
import {getStorageData}  from '../../../utils/api';

create.Component({
  // options: {
  //   pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  // },
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
  use:[
    'month',
    'curDate',
  ],
  /**
   * 组件的初始数据
   */
  data: {
    weekArr:['一','二','三','四','五','六','日'],
    curMonthArr: [],
    preArr: [],
    nextArr: [],
    curMonthTodo: {},
    selectedDate: '',
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      // 可以执行一些初始化操作
     // this.updateCalendarArr();
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
      // this.updateCalendarArr()
      // this.getTodoInCurMonth()
    }
  },
  observers: {
    'month': function() {
      this.updateCalendarArr();  // 更新日历
      // 拉取对应月份的事件
      this.getTodoInCurMonth()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 更新日历相关方法==================================================================================
    updateCalendarArr: function(){
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
    // 获取对应月份事件相应方法
    getAllCalendarTodo: async function() {
      let calendarData = {};
      try {
        calendarData = await getStorageData('allCalData');
      } catch(e) {
        console.log(e),
        calendarData = {};
      }
      return calendarData;
    },
    getTodoInCurMonth: async function(){
      // 不用每次都拉一遍所有数据
      const calendarData = await this.getAllCalendarTodo();
      let curMonthTodo = {};
      for (let date in calendarData){
        if(date.slice(0,7) === this.store.data.month){
          // console.log(calendarData[day]);
          /**
           * curMonthTodoArr 形如：{
           * "2021-01-11"：{todoCount: 2, isExerise: false},
           * "2021-01-20"：{todoCount: 3, isExerise: false}, 
           * }
           * 
           */
          curMonthTodo[date] = {
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
    }
  }
})
