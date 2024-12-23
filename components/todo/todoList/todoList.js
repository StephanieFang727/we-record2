// components/todo/todoList/todoList.js
import create from '../../../utils/create'
import {wxp}  from '../../../utils/api';
import {getIndex, transformDate} from '../../../utils/util'
const calTodoBehavior = require('../../calTodo-behavior')

create.Component({
  behaviors:[calTodoBehavior],
  use:[
    "selectedDate",
    "updateFlag",
    "calendarData"
  ],
  // properties: {
  //   // 这里定义了innerText属性，属性值可以在组件使用时指定
  //   date: {
  //     type: String,
  //     value: '',
  //  }
  // },
  data: {
    status: '1',
    isFormShow: false,
    listData: [], // 列表源数据
    curList:[], // 当前展示列表
    calendarData: '', // 日历源数据
    todoCount: 0, // 当日待办
    selectedTodoName: '',
    selectedIsUrgent: '',
    selectedItem: '',
    formType: 'add',
  },
  observers: {
    'selectedDate': async function() {
      await this.initCurList();
    }
  },
  lifetimes: {
    attached() {
  
    },
    ready(){
      
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
  // 获取todolist源数据
  getListData: async function() {
    let {selectedDate} = this.store.data;
    selectedDate = transformDate(selectedDate);
    // 不用每次都拉取日历事件数据
    let calendarData = this.store.data.calendarData || await this.getAllCalendarData();
    if(!calendarData[selectedDate]){
      calendarData[selectedDate] = {};
     }
    const listData = calendarData[selectedDate].listData || [] ;
    const todoCount = calendarData[selectedDate].todoCount || 0;
    this.setData({
      listData,
      todoCount,
    })
    // console.log(calendarData[selectedDate]);
    this.store.data.calendarData = calendarData;
 },
 // 存储todolist数据
 setListData: async function(todoDetail) {
   let {selectedDate} = this.store.data;
   selectedDate = transformDate(selectedDate);
  //  this.setData({
  //   calendarData: await this.setCalendarData(todoDetail, date, this.data.calendarData)
  //  })
   this.store.data.calendarData = await this.setCalendarData(todoDetail, selectedDate, this.store.data.calendarData);
 },
 initCurList: async function () {
   await this.getListData();
   this.setData({
     curList: this.getList(),
   })
 },
  // 获取最新展示列表
  getList: function(){
    let curList = [];
    const { listData: data } = this.data;
    const { status } = this.data;
    switch(status){
      case '1':
        curList = data;
        break;
      case '2':
        curList = data.filter(item=>!item.completed);
        break;
      case '3':
        curList = data.filter(item=>item.completed);
        break;
    }
      return curList;
  },
  // 切换tab处理函数
  switchStatus: function(e){
    let { status } = e.currentTarget.dataset;
    this.setData({
      status: status
    })
    this.setData({
      curList: this.getList(),
    })
  },
  // 表单相关处理函数============================================================
  // 添加任务函数
  bindAddTap: function(e) {
    this.setData({
      isFormShow: true,
      formType: 'add',
    })
  },
  // 关闭弹窗函数
  hideForm: function(e) {
    this.setData({
      isFormShow: false,
    })
  },
  // 提交表单函数
  formSubmit: async function(e) {
    const {formType, selectedItem: item} = this.data;
    let {todoCount} = this.data;
    let listData = [];
    let newItem = {};
    if(formType==='add'){
      newItem = {id:new Date().getTime(), completed: false, ...e.detail.value};
      listData = [...this.data.listData,newItem];
      todoCount ++;
    }else if(formType==='edit'){
      newItem = {id:item.id, completed: item.completed, ...e.detail.value};
      console.log(newItem);
      listData = this.data.listData;
      const index = getIndex(listData,item);
      let temp = listData.splice(index,1, newItem);
      console.log(temp);
    }
    await this.setListData({
      listData,
      todoCount,
    });
    this.initCurList();
    this.setData({
      isFormShow: false,
      selectedItem: {},
    })
    this.store.data.updateFlag = !this.store.data.updateFlag;
  },
 // 重置表单
  formReset: function(e) {

  },
 
 // ListItem相关处理函数 =======================================
  onCurlistChange: function(e){
    // 将拼接好的样式设置到当前item中
    const {id, itemStyle} = e.detail.value;
    let temp = this.data.curList;
    temp.forEach(item => item.id === id ? item.itemStyle = itemStyle: null);
    this.setData({
      curList: temp
    })
  },
  // 点击item处理函数
  bindTodoTap: async function(e) {
    const { id } = e.detail.value;
    const {curList: list } = this.data;
    let {todoCount} = this.data;
    let item = list.filter(item=>item.id === id)[0];
    if(!item.completed){ //未完成-->已完成
      item.completed = !item.completed;
      todoCount --;
      await this.setListData({
        listData: this.data.listData,
        todoCount,
      });
      this.initCurList();
      this.store.data.updateFlag = !this.store.data.updateFlag;
    } else {
      wxp.showModal({
        content: '该任务已完成，确定重新打开吗？',
        success: async (e) => {
          if(e.confirm){
            item.completed = !item.completed;
            todoCount ++;
            await this.setListData({
              listData: this.data.listData,
              todoCount
            });
            this.initCurList();
            this.store.data.updateFlag = !this.store.data.updateFlag;
          }
        }
      })
    }
  },
  bindEditTap: function(e) {
    const { item } = e.detail.value;
    this.setData({
      isFormShow: true,
      formType: 'edit',
      selectedItem: item,
    })
  },
  bindUrgentTap: async function(e) {
    const { id } = e.detail.value;
    console.log(id);
    const {curList: list } = this.data;
    let item = list.filter(item=>item.id === id)[0];
    item.isUrgent = !item.isUrgent;
    await this.setListData({
      listData: this.data.listData
    });
    this.initCurList();
  },
  bindDelTap: function(e){
    const { item } = e.detail.value;
    wx.showModal({
      title: '删除提示',
      content: '确定要删除这项任务吗？',
      success: (e) => {
        if (e.confirm) {
          this.delTodo(item);
          this.store.data.updateFlag = !this.store.data.updateFlag;
        }
      }
    })
  },
  delTodo: async function(item){
    let {todoCount} = this.data;
    let listData = this.data.listData.filter(v=>v.id!==item.id);
    if(!item.completed){// 如果删除的是未完成的事项 则todoCount也要相应减一
      todoCount --;
    }
    await this.setListData({
      listData,
      todoCount
    });
    this.initCurList();
  },
  }
})
