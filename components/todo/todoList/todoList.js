// components/todo/todoList/todoList.js
import create from '../../../utils/create'
import {getStorageData, setStorageData, wxp}  from '../../../utils/api';

create.Component({
  use:[
    "date",
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
    calendarData: {}, // 日历源数据
    selectedTodoName: '',
    selectedIsUrgent: '',
    selectedItem: '',
    formType: 'add',
  },
  observers: {
    'date': async function() {
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
  // 获取最新列表
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
  formSubmit: function(e) {
    const {formType, selectedItem: item} = this.data;
    let listData = [];
    let newItem = {};
    if(formType==='add'){
      newItem = {id:new Date().getTime(), completed: false, ...e.detail.value};
      listData = [...this.data.listData,newItem];
    }else if(formType==='edit'){
      newItem = {id:item.id, completed: item.completed, ...e.detail.value};
      console.log(newItem);
      listData = this.data.listData;
      const index = util.getIndex(listData,item);
      let temp = listData.splice(index,1, newItem);
      console.log(temp);
    }
    this.setListData(listData);
    this.initCurList();
    this.setData({
      isFormShow: false,
      selectedItem: {},
    })
  },
 // 重置表单
  formReset: function(e) {

  },
   // 获取todolist源数据
  getListData: async function() {
     const {date} = this.store.data;
     console.log(date);
     let calendarData = {};
     try {
       calendarData = await getStorageData('todoInDay');
     } catch(e) {
       console.log(e),
       calendarData = {};
     }
     this.setData({
       calendarData,
       listData: calendarData[date] || [],
     })
  },
  // 存储todolist数据
  setListData: async function(listData) {
    const {date} = this.store.data;
    let temp = this.data.calendarData;
    temp[date] = listData;
    try{
      await setStorageData('todoInDay',temp);
    } catch(e) {
      console.log(e)
    }
    this.setData({
      calendarData: temp
    })
  },
  initCurList: async function () {
    await this.getListData();
    this.setData({
      curList: this.getList(),
    })
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
  bindTodoTap: function(e) {
    const { id } = e.detail.value;
    const {curList: list } = this.data;
    let item = list.filter(item=>item.id === id)[0];
    if(!item.completed){
      item.completed = !item.completed;
      this.setListData(this.data.listData);
      this.initCurList();
    } else {
      wxp.showModal({
        content: '该任务已完成，确定重新打开吗？',
        success: (e) => {
          if(e.confirm){
            item.completed = !item.completed;
            this.setListData(this.data.listData);
            this.initCurList();
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
  bindUrgentTap: function(e) {
    const { id } = e.detail.value;
    console.log(id);
    const {curList: list } = this.data;
    let item = list.filter(item=>item.id === id)[0];
    item.isUrgent = !item.isUrgent;
    this.setListData(this.data.listData);
    this.initCurList();
  },
  bindDelTap: function(e){
    const { id } = e.detail.value;
    wx.showModal({
      title: '删除提示',
      content: '确定要删除这项任务吗？',
      success: (e) => {
        if (e.confirm) {
          this.delTodo(id);
        }
      }
    })
  },
  delTodo: function(id){
    let listData = this.data.listData.filter(item=>item.id!==id);
    this.setListData(listData);
    this.initCurList();
  },
  }
})
