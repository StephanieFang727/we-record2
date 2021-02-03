// 格式化日期为xxxx-xx-xx
const formatDate = date => {
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  // const hour = date.getHours()
  // const minute = date.getMinutes()
  // const second = date.getSeconds()
  month = month > 9 ? month : '0' + month;
  day = day > 9 ? day : '0' + day;
  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return [year, month, day].join('-');
}
// 格式为xxxx/xx/xx
const formatDate2 = date => {
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  month = month > 9 ? month : '0' + month;
  day = day > 9 ? day : '0' + day;
  return [year, month, day].join('/');
}
// 从xxxx-xx-xx 到 xxxx/xx/xx
const transformDate = date => {
  return date.replace(/-/g,'/');
}
const formatDateToMonth = (date) => {
 return formatMonth(date.getFullYear(), date.getMonth() + 1)
}

const formatMonth = (year, month) => {
  month = month > 9 ? month : '0' + month;
  return [year, month].join('-');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 获取item对象在array中的index
const getIndex = ((arr,item)=>{
  for(let i in arr){
    if(arr[i].id == item.id){
      return i;
    };
  };
});
/**
 * 日历相关方法start
 */
  // 1.判断闰年
  const isLeapYear = (year) => {
    return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
  };
  // 2.获得每个月的日期有多少，注意 month - [0-11]
  const getMonthArr = (year, month) => {
    let arr = [
      0,
      31, null, 31, 30, 
      31, 30, 31, 31,
      30, 31, 30, 31
    ];
    let count = arr[month] || (isLeapYear(year) ? 29 : 28);
    return Array.from(new Array(count),(value,i) => {
      i ++;
      i = i > 9 ? i : '0'+ i;
      return {date: `${year}/${month > 9 ? month : '0' + month }/${i}`,day: parseInt(i)}});
  };
  // 3.获得某年某月的 1号 是星期几
  const getFirstday = (year, month) => {
    let date = new Date(year, month-1, 1);
    return date.getDay();
  };
  // 4.获得上个月的日期数组
  const getPreMonthArr = (year, month) => {
    if (month === 1) {
      return getMonthArr(year - 1, 12);
    } else {
      return getMonthArr(year, month-1);
    }
  };
  // 5.获得下个月的日期数组
  const getNextMonthArr = (year, month) => {
    if (month === 12) {
      return getMonthArr(year + 1, 1);
    } else {
      return getMonthArr(year, month + 1);
    }
  };
/**
 * 日历相关方法end
 */
module.exports = {
  formatDate,
  formatDate2,
  transformDate,
  formatMonth,
  formatDateToMonth,
  getIndex,
  isLeapYear,
  getMonthArr,
  getFirstday,
  getPreMonthArr,
  getNextMonthArr,
}
