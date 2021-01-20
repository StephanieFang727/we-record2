// components/calendar/calendarHeader.js
import create from '../../../utils/create'
import { 
  formatMonth
} from "../../../utils/util"

create.Component({
  use:[
    "month",
  ],
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
  /**
   * 组件的初始数据
   */
  data: {

  },
  lifetimes: {
    attached: function() {
  
    },
    ready: function() {
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // observers: {
  //   'year, month': function(year, month) {
  //     console.log(year)
  //     this.setData({
  //       curMonth: formatMonth(year, month)
  //     })
  //   }
  // },
  computed: {
   
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 月份选择处理
  bindMonthChange: function(e){
    const {type} = e.currentTarget.dataset;
    let [year, month] = this.store.data.month.split('-').map(item => parseInt(item));
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
    this.store.data.month = formatMonth(year, month);
    // this.triggerEvent('monthChange',{value:{
    //   year,
    //   month
    // }})
  },
  }
})

