// components/todo/todoHeader.js
import create from '../../../utils/create'
import {formatDay} from '../../../utils/util';

create.Component({
  use:[
    "date",
  ],
  /**
   * 组件的属性列表
   */
  // properties: {
  //   date:{
  //     type: String,
  //     value: '',
  //   }
  // },

  /**
   * 组件的初始数据
   */
  // data: {

  // },
  lifetimes: {
    ready(){
      
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindDateChange: function(e) {
      // this.triggerEvent('dateChange',{value: e.detail.value})
      this.store.data.date = e.detail.value;
    },
  }
})
