import { promisifyAll, promisify } from 'miniprogram-api-promise';

const wxp = {}
// promisify all wx's api
promisifyAll(wx, wxp)

const getRpx = () => { 
  const {windowWidth} = wxp.getSystemInfoSync();
  return 750/windowWidth;
}
const getStorageData = (key) => {
  return new Promise((resolve, reject)=>{
    wx.getStorage({
      key,
      success: (res) => resolve(res.data),
      fail: (e) => {
        console.log('fail to get storage data',e);
        reject();
      }
    })
  })
}

const setStorageData = (key, data) =>{
  return new Promise((resolve, reject) => {
    wx.setStorage({
      data,
      key,
      success: (res) =>{
        resolve(res.data);
      },
      fail: () => {
        console.log('fail to set storage data',e);
        reject();
      }
    })
  })
}

module.exports = {
  getStorageData,
  setStorageData,
  wxp,
  getRpx, // 获取px与rpx比例
}