const exec = require('child_process').execSync;
const fs = require('fs');
const download = require('download');
const common = require('./common');

// 公共变量
const KEY = process.env.JD_COOKIE;
const DualKey = process.env.JD_COOKIE_2;

async function downFile() {
    // const url = 'https://cdn.jsdelivr.net/gh/NobyDa/Script@master/JD-DailyBonus/JD_DailyBonus.js'
    const url = 'https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js';
    await download(url, './');
}

async function changeFile() {
    let content = await fs.readFileSync('./JD_DailyBonus.js', 'utf8')
    content = content.replace(/var Key = ''/, `var Key = '${KEY}'`);
    if (DualKey) {
        content = content.replace(/var DualKey = ''/, `var DualKey = '${DualKey}'`);
    }
    await fs.writeFileSync('./JD_DailyBonus.js', content, 'utf8')
}

async function start() {
    if (!KEY) {
        console.log('请填写 key 后在继续')
        return
    }
    // 下载最新代码
    await downFile();
    console.log('下载代码完毕')
    // 替换变量
    await changeFile();
    console.log('替换变量完毕')
    // 执行
    await exec("node JD_DailyBonus.js >> result.txt");
    console.log('执行完毕')

    // 推送消息
    const path = "./result.txt";
    let content = "";
    if (fs.existsSync(path)) {
        content = fs.readFileSync(path, "utf8");
    }
    let t = content.match(/【签到概览】:((.|\n)*)【签到总计】/)
    let res = t ? t[1].replace(/\n/, '') : '失败'
    let t2 = content.match(/【签到总计】:((.|\n)*)【账号总计】/)
    let res2 = t2 ? t2[1].replace(/\n/, '') : '总计0'
    await common.sendMessage("" + ` ${res2} ` + ` ${res} ` + new Date().toLocaleDateString(), content);
}

start()