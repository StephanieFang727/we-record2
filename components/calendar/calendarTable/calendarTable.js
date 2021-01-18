// components/calendar/calendarTable.js
import create from '../../../utils/create'
import { 
  getMonthArr,
  getFirstday,
  getPreMonthArr,
  getNextMonthArr,
} from "../../../utils/util"

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
    'year',
    'month'
  ],
  /**
   * 组件的初始数据
   */
  data: {
    weekArr:['一','二','三','四','五','六','日'],
    curMonthArr: [],
    preArr: [],
    nextArr: [],
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      // 可以执行一些初始化操作
     this.updateCalendarArr();
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  observers: {
    'year, month': function(year, month) {
      this.updateCalendarArr();  // 更新日历
      // 拉取对应月份的事件
      
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    updateCalendarArr: function(){
      const { preArr, curMonthArr, nextArr} = this.getCalendarArr(this.data.year, this.data.month);
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
      return{
        preArr,
        curMonthArr,
        nextArr,
      };
    }
  }
})
