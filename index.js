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
        downloadUrl: 'http://61.174.54.76:8000:luzy/admin-template#master',
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
const tempalteChoices = [
    '后台模板','H5模板','大屏模板','小程序模板','微前端后台模板'
]
const getSelectTemplate = answers => {
    for(let item in tempaltes) {
        if(answers.kind === tempaltes[item].description) {
            return tempaltes[item]
        }
    }
    return false;
}
const binHandler = {
    init() {
      inquirer
        .prompt([
          {
            type: 'text',
            message: '请输入文件夹名称',
            name: 'dirname'
          },
          {
            type: 'list',
            message: '请选择模板',
            choices: tempalteChoices,
            name: 'kind'
          }
        ])
        .then(answers => {
            const __dirname = answers.dirname;
            const selectItem = getSelectTemplate(answers)
            if (__dirname) {
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
                        console.log(err)
                        console.log('下载失败')
                        process.exit(1);
                    } else {
                        console.log(chalk.green('项目创建成功'));
                        process.exit(1);
                    }
                })
                // download(template, _projectPath, {clone: true}, err => {
                // spinner.stop();
                // if (err) {
                //     console.error('下载失败', err.message.trim());
                // } else {
                //     // 要把用户整体安装过的项目进行核心数据的替换
                //     shelljs.sed('-i', 'yd-vue-kernel', __dirname, _projectPath+'/package.json');
                //     console.log(chalk.green('项目创建成功'));
                // }
                // });
            }
  
        })
    }
  };
program
    .usage('[cmd] <options>')
    .arguments('<cmd> [env]')
    .description('pyra项目模板')
    .action((cmd, otherParms) => {
        console.log(cmd, otherParms);
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

// console.log('pyra cli')