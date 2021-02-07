// components/todo/todoHeader.js
import create from '../../../utils/create'
import {formatDate} from '../../../utils/util';

create.Component({
  use:[
    "selectedDate",
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
    attached(){
     
    },
    ready(){
      // this.store.data.selectedDate = new Date();
      //console.log(new Date());
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindDateChange: function(e) {
      // this.triggerEvent('dateChange',{value: e.detail.value})
      this.store.data.selectedDate = e.detail.value;
    },
  }
})
