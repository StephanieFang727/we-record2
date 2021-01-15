// pages/todos.js
import api, {wxp}  from '../../utils/api';
import util from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '1',
    isFormShow: false,
    date: '',
    listData: [], // 列表源数据
    curList:[], // 当前展示列表
    calendarData: {}, // 日历源数据
    editBtnWidth: 400,
    todoContentWidth: 0,
    selectedTodoName: '',
    selectedIsUrgent: '',
    selectedItem: '',
    formType: 'add',
  },
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
  // 点击item处理函数
  bindTodoTap: function(e) {
    const { id } = e.currentTarget.dataset;
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
  bindDateChange: async function(e) {
    this.setData({
      date: e.detail.value
    })
    await this.initCurList();
  },
  delTodo: function(id){
    let listData = this.data.listData.filter(item=>item.id!==id);
    this.setListData(listData);
    this.initCurList();
  },
   // 获取todolist源数据
  getListData: async function() {
     const {date} = this.data;
     let calendarData = {};
     try {
       calendarData = await api.getStorageData('cal');
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
    const {date} = this.data;
    let temp = this.data.calendarData;
    temp[date] = listData;
    try{
      await api.setStorageData('cal',temp);
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
  touchS: function(e){
    if(e.touches.length !== 1) return;
    this.setData({
      // 触摸起始的X坐标
      startX: e.touches[0].clientX
    })
  },
  touchM: function(e) {
    if(e.touches.length !== 1) return;
    const {startX} = this.data;
    // 触摸点的X坐标
    const moveX = e.touches[0].clientX
    // 计算手指起始点的X坐标与当前触摸点的X坐标的差值
    const disX = startX - moveX;
   // delBtnWidth 为右侧按钮区域的宽度
    const {editBtnWidth} = this.data;
    let itemStyle = ''
    if (disX == 0 || disX < 0){ // 如果移动距离小于等于0，文本层位置不变
      itemStyle = 'left:0'
    } else if (disX > 0 ){ // 移动距离大于0，文本层left值等于手指移动距离
      itemStyle = 'left:-' + disX + 'rpx'
      if(disX >= editBtnWidth){
        // 控制手指移动距离最大值为删除按钮的宽度
        itemStyle = 'left:-' + editBtnWidth + 'rpx'
      }
    }
    // 获取手指触摸的是哪一个item
    const { id }= e.currentTarget.dataset;
    // 将拼接好的样式设置到当前item中
    let temp = this.data.curList;
    temp.forEach(item => item.id === id ? item.itemStyle = itemStyle: null);
    this.setData({
      curList: temp
    })
  },
  touchE: function(e) {
    if(e.changedTouches.length !== 1) return;
    const {startX} = this.data;
    // 手指移动结束后触摸点位置的X坐标
    const endX = e.changedTouches[0].clientX
    // 触摸开始与结束，手指移动的距离
    const disX = startX - endX
    const {editBtnWidth} = this.data;
    // 如果距离小于删除按钮的1/2，不显示删除按钮
    const itemStyle = disX > 10 ? 'left:-' + editBtnWidth + 'rpx' : 'left:0'
    // 获取手指触摸的是哪一个item
    const { id }= e.currentTarget.dataset;
    // 将拼接好的样式设置到当前item中
    // this.data.curList.forEach(item => item.id === id ? item.itemStyle = itemStyle: null);
    let temp = this.data.curList;
    temp.forEach(item => item.id === id ? item.itemStyle = itemStyle: null);
    this.setData({
      curList: temp
    })
  },
  bindEditTap: function(e) {
    const { item } = e.currentTarget.dataset;
    this.setData({
      isFormShow: true,
      formType: 'edit',
      selectedItem: item,
    })
  },
  bindUrgentTap: function(e) {
    const { id } = e.currentTarget.dataset;
    const {curList: list } = this.data;
    let item = list.filter(item=>item.id === id)[0];
    item.isUrgent = !item.isUrgent;
    this.setListData(this.data.listData);
    this.initCurList();
  },
  bindDelTap: function(e){
    const { id } = e.currentTarget.dataset;
    console.log(id);
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const {windowWidth} = wxp.getSystemInfoSync();
    // try {
    //   windowWidth = wx.getSystemInfoSync().windowWidth;
    // } catch (e) {
    //   // Do something when catch error
    // }
    this.setData({
      todoContentWidth: windowWidth-16,
      date: util.formatTime(new Date())
    })
    await this.initCurList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})