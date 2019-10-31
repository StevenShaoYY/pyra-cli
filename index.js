#!/usr/bin/env node

const program = require('commander');
const download = require('download-git-repo');
// const sleep = require('sleep');
const lolcatjs = require('lolcatjs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const shelljs = require('shelljs')
const userHome = require('user-home');
const path = require('path')
const ejs = require('ejs');
const fs = require('fs-extra')
const glob = require('glob')
lolcatjs.options.seed = Math.round(Math.random() * 1000);
lolcatjs.options.colors = true;
const input = [
    "           _____                    _____                    _____                    _____                _____                                                    ",
    "          /\\    \\                  /\\    \\                  /\\    \\                  /\\    \\              /\\    \\                                                 ",
    "         /::\\    \\                /::\\____\\                /::\\    \\                /::\\    \\            /::\\    \\                                                 ", 
    "        /::::\\    \\              /::::|   |               /::::\\    \\              /::::\\    \\           \\:::\\    \\                                                 ",
    "       /::::::\\    \\            /:::::|   |              /::::::\\    \\            /::::::\\    \\           \\:::\\    \\                                                ",
    "      /:::/\\:::\\    \\          /::::::|   |             /:::/\\:::\\    \\          /:::/\\:::\\    \\           \\:::\\    \\                                               ",
    "     /:::/__\\:::\\    \\        /:::/|::|   |            /:::/__\\:::\\    \\        /:::/__\\:::\\    \\           \\:::\\    \\                                              ",
    "     \\:::\\   \\:::\\    \\      /:::/ |::|   |           /::::\\   \\:::\\    \\      /::::\\   \\:::\\    \\          /::::\\    \\                                             ",
    "   ___\\:::\\   \\:::\\    \\    /:::/  |::|___|______    /::::::\\   \\:::\\    \\    /::::::\\   \\:::\\    \\        /::::::\\    \\                                            ",
    "  /\\   \\:::\\   \\:::\\    \\  /:::/   |::::::::\\    \\  /:::/\\:::\\   \\:::\\    \\  /:::/\\:::\\   \\:::\\____\\      /:::/\\:::\\    \\                                           ",
    " /::\\   \\:::\\   \\:::\\____\\/:::/    |:::::::::\\____\\/:::/  \\:::\\   \\:::\\____\\/:::/  \\:::\\   \\:::|    |    /:::/  \\:::\\____\\                                          ",
    " \\:::\\   \\:::\\   \\::/    /\\::/    / ~~~~~/:::/    /\\::/    \\:::\\  /:::/    /\\::/   |::::\\  /:::|____|   /:::/    \\::/    /                                          ",
    "  \\:::\\   \\:::\\   \\/____/  \\/____/      /:::/    /  \\/____/ \\:::\\/:::/    /  \\/____|:::::\\/:::/    /   /:::/    / \\/____/                                           ",
    "   \\:::\\   \\:::\\    \\                  /:::/    /            \\::::::/    /         |:::::::::/    /   /:::/    /                                                    ",
    "    \\:::\\   \\:::\\____\\                /:::/    /              \\::::/    /          |::|\\::::/    /   /:::/    /                                                     ",
    "     \\:::\\  /:::/    /               /:::/    /               /:::/    /           |::| \\::/____/    \\::/    /                                                      ",
    "      \\:::\\/:::/    /               /:::/    /               /:::/    /            |::|  ~|           \\/____/                                                       ",
    "       \\::::::/    /               /:::/    /               /:::/    /             |::|   |                                                                         ",
    "        \\::::/    /               /:::/    /               /:::/    /              \\::|   |                                                                         ",
    "         \\::/    /                \\::/    /                \\::/    /                \\:|   |                                                                         ",
    "          \\/____/                  \\/____/                  \\/____/                  \\|___|                                                                         ",
    "",
    "",
    "      _____                    _____                    _____                    _____                    _____                    _____                           ",
    "     /\\    \\                  /\\    \\                  /\\    \\                  /\\    \\                  /\\    \\                  /\\    \\                          ",
    "    /::\\    \\                /::\\    \\                /::\\    \\                /::\\____\\                /::\\    \\                /::\\____\\                         ",
    "    \\:::\\    \\              /::::\\    \\              /::::\\    \\              /:::/    /               /::::\\    \\              /:::/    /                         ",
    "     \\:::\\    \\            /::::::\\    \\            /::::::\\    \\            /:::/    /               /::::::\\    \\            /:::/    /                          ",
    "      \\:::\\    \\          /:::/\\:::\\    \\          /:::/\\:::\\    \\          /:::/    /               /:::/\\:::\\    \\          /:::/    /                           ",
    "       \\:::\\    \\        /:::/__\\:::\\    \\        /:::/__\\:::\\    \\        /:::/____/               /:::/__\\:::\\    \\        /:::/    /                            ",
    "       /::::\\    \\      /::::\\   \\:::\\    \\      /::::\\   \\:::\\    \\       |::|    |               /::::\\   \\:::\\    \\      /:::/    /                             ",
    "      /::::::\\    \\    /::::::\\   \\:::\\    \\    /::::::\\   \\:::\\    \\      |::|    |     _____    /::::::\\   \\:::\\    \\    /:::/    /                              ",
    "     /:::/\\:::\\    \\  /:::/\\:::\\   \\:::\\____\\  /:::/\\:::\\   \\:::\\    \\     |::|    |    /\\    \\  /:::/\\:::\\   \\:::\\    \\  /:::/    /                               ",
    "    /:::/  \\:::\\____\\/:::/  \\:::\\   \\:::|    |/:::/  \\:::\\   \\:::\\____\\    |::|    |   /::\\____\\/:::/__\\:::\\   \\:::\____\\/:::/____/                                ",
    "   /:::/    \\::/    /\\::/   |::::\\  /:::|____|\\::/    \\:::\\  /:::/    /    |::|    |  /:::/    /\\:::\\   \\:::\\   \\::/    /\\:::\\    \\                                ",
    "  /:::/    / \\/____/  \\/____|:::::\\/:::/    /  \\/____/ \\:::\\/:::/    /     |::|    | /:::/    /  \\:::\\   \\:::\\   \\/____/  \\:::\\    \\                               ",
    " /:::/    /                 |:::::::::/    /            \\::::::/    /      |::|____|/:::/    /    \\:::\\   \\:::\\    \\       \\:::\\    \\                              ",
    "/:::/    /                  |::|\\::::/    /              \\::::/    /       |:::::::::::/    /      \\:::\\   \\:::\\____\\       \\:::\\    \\                             ",
    "\\::/    /                   |::| \\::/____/               /:::/    /        \\::::::::::/____/        \\:::\\   \\::/    /        \\:::\\    \\                            ",
    " \\/____/                    |::|  ~|                    /:::/    /          ~~~~~~~~~~               \\:::\\   \\/____/          \\:::\\    \\                           ",
    "                            |::|   |                   /:::/    /                                     \\:::\\    \\               \\:::\\    \\                          ",
    "                            \\::|   |                  /:::/    /                                       \\:::\\____\\               \\:::\\____\\                         ",
    "                             \\:|   |                  \\::/    /                                         \\::/    /                \\::/    /                        ", 
    "                              \\|___|                   \\/____/                                           \\/____/                  \\/____/                          ",
    ""
].join('\n')
// program.version(lolcatjs.fromString(input), "-v --version");
program.version(input, "-v --version");
// program.version(lolcatjs.fromString('0.0.1'), "-v --version");

const tempaltes = {
    'backend': {
        url: 'https://git.wenlvcloud.com/luzy/admin-template',
        downloadUrl: 'http://61.174.54.76:8000:luzy/admin-template#template',
        description: '后台模板'
    },
    'h5': {
        downloadUrl: 'https://github.com:StevenShaoYY/QinQIn#master',
        url: 'https://github.com/StevenShaoYY/QinQIn',
        description: 'H5模板'
    },
    'dashboard': {
        url: '',
        description: '大屏模板'
    },
    'xcc': {
        url: '',
        description: '小程序模板'
    },
    'micro': {
        url: '',
        description: '微前端后台模板'
    },
}
const tempaltesBackend = {
    'normal': {
        url: 'https://git.wenlvcloud.com/luzy/admin-template',
        downloadUrl: 'http://61.174.54.76:8000:luzy/admin-template#template',
        description: '普通后台模板'
    },
    'withForm': {
        url: 'https://git.wenlvcloud.com/luzy/admin-template',
        downloadUrl: 'http://61.174.54.76:8000:luzy/admin-template#template',
        description: '可配置后台模板'
    },
}
const tempalteChoices = [
    '后台模板','H5模板','大屏模板','小程序模板','微前端后台模板'
]
const tempalteBackendChoices = [
    '普通后台模板','可配置后台模板'
]
const getSelectTemplate = (answers,tplList) => {
    for(let item in tplList) {
        if(answers === tplList[item].description) {
            return tplList[item]
        }
    }
    return false;
}
function renderEjs (files, context) {
    for(let tpl of files) {
        render(tpl)
    }
    function render(tpl) {
        ejs.renderFile(tpl, context, {}, function(err, str){
            fs.writeFileSync(tpl.replace('.ejs', ''), str, 'utf8')
            fs.removeSync(tpl)
        })
    }
}

async function startRender (transData) {
    const CWD = process.cwd()
    const PROJECT_DIR = path.resolve(CWD, transData.name)
    const PROJECT_EJS = glob.sync('**/*.ejs', {cwd: PROJECT_DIR, absolute: true, dot: true})
    renderEjs(PROJECT_EJS, transData)
    console.log(chalk.green('项目创建成功'));
}
const binHandler = {
    async form() {
        return inquirer
          .prompt([
            {
              type: 'list',
              message: '请选择后台模板类别',
              choices: tempalteBackendChoices,
              name: 'backkind'
            }
        ]).then(answers => {
            const selectItem = getSelectTemplate(answers.backkind, tempaltesBackend)
            return selectItem
        })
    },
    init() {
      inquirer
        .prompt([
          {
            type: 'text',
            message: '请输入文件夹名称',
            name: 'name',
            validate: function (input) {
                if (input === '') {
                    console.log('请输入文件夹名称!!!!');
                    return false;
                } else {
                    return true
                }
              }
          },
          {
            type: 'text',
            message: '请输入项目描述',
            name: 'description',
            default: '智慧旅游项目'
          },
          {
            type: 'text',
            message: '请输入作者',
            name: 'author',
            default: 'shaojy'
          },
          {
            type: 'list',
            message: '请选择模板',
            choices: tempalteChoices,
            name: 'kind'
          }
        ])
        .then( async answers => {
            const __dirname = answers.name;
            const selectItem = getSelectTemplate(answers.kind, tempaltes)
            if (__dirname) {
                if(selectItem.description === '后台模板') {
                    const tempAnswer = await binHandler['form']()
                    selectItem.downloadUrl = tempAnswer.downloadUrl
                }
                const spinner = ora('下载初始化模板中，请稍等...');
                spinner.start();
                // // 创建文件夹
                if(shelljs.test('-d', __dirname)) {
                    spinner.stop();
                    console.log(chalk.red('项目已经存在'));
                    process.exit(1);
                }
                // shelljs.mkdir(__dirname);
                // 下载github项目
                download(selectItem.downloadUrl, __dirname, { clone: true }, (err) => {
                    spinner.stop();
                    if (err) {
                        console.log(chalk.red('下载失败'))
                     
                        process.exit(1);
                    } else {
                        startRender(answers)
                        process.exit(1);
                    }
                })
            }
  
        })
    }
  };
program
    .usage('[cmd] <options>')
    .arguments('<cmd> [env]')
    .description('pyra项目模板')
    .action((cmd, otherParms) => {
        // console.log(cmd, otherParms);
        // console.log(tempaltes[templateName].downloadUrl)
        const handler = binHandler[cmd];
        if (typeof handler === 'undefined') {
            console.log(`${chalk.yellow('非常遗憾')}【${chalk.red(cmd)}】${chalk.yellow('暂未开发')}`);
            process.exit(1);
        } else {
            handler(otherParms);
        }
    });


program
    .command('list')
    .description('查看所有模板')
    .action(() => {
        for (let key in tempaltes) {
            console.log(lolcatjs.fromString(`${key}----------------${tempaltes[key].description}`))
        }

    })
program.parse(process.argv);