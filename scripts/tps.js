const axios = require("axios");

const token = config.tps.Cookie;
const agent = config.UserAgent;
var iActivityId = config.tps.iActivityId;
var iFlowId = config.tps.iFlowId;
var sSDID = config.tps.sSDID;
var e_code = config.tps.ecode;
var eas_url = config.tps.easurl;
var taskRicevereArray = [];
// 请求的 URL
const url = `https://comm.ams.game.qq.com/ams/ame/amesvr?sServiceType=tps&iActivityId=${iActivityId}&sServiceDepartment=group_a&sSDID=${sSDID}`;

function tps() { 
  return new Promise(async (resolve) => {
    try {
      msg = '开始领取战令奖励\n'
      // 开始领取日常任务
      iFlowId = config.tps.iFlowId;
      taskRicevereArray = config.tps.taskRicevere.split("&");
      for (let i = 0; i < taskRicevereArray.length; i++){
        const taskRicevere = taskRicevereArray[i];
        await getTask(iFlowId, 'taskRicevere', taskRicevere);
        await wait(2000);
      }

      // 开始领取周常任务
      iFlowId = config.tps.iFlowIdWeek;
      taskRicevereArray = config.tps.taskRicevereWeek.split("&");
      for (let i = 0; i < taskRicevereArray.length; i++){
        const taskRicevere = taskRicevereArray[i];
        await getTask(iFlowId, 'taskRicevereWeek', taskRicevere);
        await wait(2000);
      }

      // 开始领取挑战任务
      iFlowId = config.tps.iFlowIdTz;
      taskRicevereArray = config.tps.taskRicevereTz.split("&");
      for (let i = 0; i < taskRicevereArray.length; i++){
        const taskRicevere = taskRicevereArray[i];
        await getTask(iFlowId, 'taskRicevereTz', taskRicevere);
        await wait(2000);
      }
    } catch (error) {
      msg =`领取失败，原因：${error.message}`;
    }
    console.log(msg)
    resolve("【tps战令】：" + msg);
  });
}
async function getTask(flowId, task, taskId) {
  const randomTag = generateRandomString();
  // POST 请求的数据
  const postData = `sServiceType=tps&iActivityId=${iActivityId}&sServiceDepartment=group_a&iFlowId=${flowId}&g_tk=1842395457&sMiloTag=AMS-tps-1219120114-${randomTag}-${iActivityId}-${flowId}&e_code=${e_code}&g_code=0&eas_url=${eas_url}&eas_refer=${eas_url}&${task}=${taskId}`;
  const response = await axios.post(url, postData, {
    headers: {
      'User-Agent': agent,
      Cookie: token,
      'referer': 'https://tps.qq.com/'
     },
   });
  if (response.status == 200) {
    if(response.data.ret == "0"){
      msg += `${task}${taskId}领取成功\n`;
    } else {
      msg += `${task}${taskId}领取失败,原因：${response.data.msg}\n`;
    }
  } else {
    msg += `${task}${taskId}领取失败\n`;
  }
}
// 生成随机 6 位英文字母的函数
function generateRandomString(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = tps;
