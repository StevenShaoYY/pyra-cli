#!/usr/bin/env node

const program = require('commander');
const download = require('download-git-repo');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const shelljs = require('shelljs')
const userHome = require('user-home');
const path = require('path')
const ejs = require('ejs');
const fs = require('fs-extra')
const glob = require('glob')
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
program.version(input, "-v --version");

const tempaltes = {
    'backend': {
        url: 'https://git.wenlvcloud.com/luzy/admin-template',
        downloadUrl: 'http://61.174.54.76:8000:luzy/admin-template#template',
        description: '后台模板'
    },
    'h5': {
        url: 'https://git.wenlvcloud.com/shaojy/h5-template',
        downloadUrl: 'http://61.174.54.76:8000:shaojy/h5-template#template',
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
        downloadUrl: 'https://git.wenlvcloud.com:shaojy/backend-template#normal',
        description: '普通后台模板'
    },
    'withForm': {
        url: 'https://git.wenlvcloud.com/luzy/admin-template',
        downloadUrl: 'https://git.wenlvcloud.com:shaojy/backend-template#master',
        description: '可配置后台模板'
    },
}
const tempalteChoices = [
    '后台模板', 'H5模板', '大屏模板', '小程序模板', '微前端后台模板'
]
const tempalteBackendChoices = [
    '普通后台模板', '可配置后台模板'
]
const getSelectTemplate = (answers, tplList) => {
    for (let item in tplList) {
        if (answers === tplList[item].description) {
            return tplList[item]
        }
    }
    return false;
}

function renderEjs(files, context) {
    for (let tpl of files) {
        render(tpl)
    }

    function render(tpl) {
        ejs.renderFile(tpl, context, {}, function(err, str) {
            fs.writeFileSync(tpl.replace('.ejs', ''), str, 'utf8')
            fs.removeSync(tpl)
        })
    }
}

async function startRender(transData) {
    const CWD = process.cwd()
    const PROJECT_DIR = path.resolve(CWD, transData.name)
    const PROJECT_EJS = glob.sync('**/*.ejs', { cwd: PROJECT_DIR, absolute: true, dot: true })
    renderEjs(PROJECT_EJS, transData)
    console.log(chalk.green('项目创建成功'));
}
const binHandler = {
    async form() {
        return inquirer
            .prompt([{
                type: 'list',
                message: '请选择后台模板类别',
                choices: tempalteBackendChoices,
                name: 'backkind'
            }]).then(answers => {
                const selectItem = getSelectTemplate(answers.backkind, tempaltesBackend)
                return selectItem
            })
    },
    async add() {
        let has = await fs.exists(path.resolve('./package.json'))
        if (!has) {
            console.log(chalk.red('请在项目根目录下运行该命令！'))
            process.exit(1);
        }
        let packageFile = await fs.readFile(path.resolve('./package.json'), "utf-8")
        packageFile = JSON.parse(packageFile)
        if (packageFile.templateType !== 'Configurable background template') {
            console.log(chalk.red('该命令只能在 《可配置后台模板》 生成的项目中使用！'))
            process.exit(1);
        }
        inquirer
            .prompt([{
                    type: 'text',
                    message: '请输入页面文件夹名称(英文)',
                    name: 'fileName',
                    validate: function(input) {
                        if (input === '') {
                            console.log(chalk.red('请输入页面文件夹名称!!!!'));
                            return false;
                        } else {
                            return true
                        }
                    }
                },
                {
                    type: 'text',
                    message: '请输入页面名称(中文)',
                    name: 'fileTitle',
                    default: '表单模板'
                },
            ])
            .then(async answers => {
                answers.fileNamePascal = answers.fileName.charAt(0).toUpperCase() + answers.fileName.slice(1)
                let fileNameFlag = await fs.exists(path.resolve(`./src/views/${answers.fileName}`))
                if (fileNameFlag) {
                    console.log(chalk.red(`${answers.fileName}文件已存在！`))
                    process.exit(1);
                }
                const TPL_DIR1 = path.resolve(__dirname, './', 'template/edit.vue.ejs')
                const TPL_DIR2 = path.resolve(__dirname, './', 'template/formConfig.js.ejs')
                const TPL_DIR3 = path.resolve(__dirname, './', 'template/index.vue.ejs')
                const TPL_DIR4 = path.resolve(__dirname, './', 'template/indexConfig.js.ejs')
                const TPL_DIR5 = path.resolve(__dirname, './', 'template/Service.js.ejs')
                const TPL_DIR6 = path.resolve(__dirname, './', 'template/router.js.ejs')
                const page_DIR1 = path.resolve(`./src/views/${answers.fileName}/edit.vue.ejs`)
                const page_DIR2 = path.resolve(`./src/views/${answers.fileName}/formConfig.js.ejs`)
                const page_DIR3 = path.resolve(`./src/views/${answers.fileName}/index.vue.ejs`)
                const page_DIR4 = path.resolve(`./src/views/${answers.fileName}/indexConfig.js.ejs`)
                const page_DIR5 = path.resolve(`./src/api/Service.js.ejs`)
                const page_DIR6 = path.resolve(`./src/router/routertest.js.ejs`)
                for (let i = 1; i <= 4; i++) {
                    let tp = eval(`TPL_DIR${i}`)
                    let pp = eval(`page_DIR${i}`)
                    await fs.copy(tp, pp)
                    ejs.renderFile(pp, answers, {}, function(err, str) {
                        fs.writeFile(pp.replace('.ejs', ''), str, 'utf8')
                        fs.remove(pp)
                    })
                }
                await fs.copy(TPL_DIR5, page_DIR5)
                ejs.renderFile(page_DIR5, answers, {}, function(err, str) {

                    fs.writeFile(page_DIR5.replace('Service.js.ejs', `${answers.fileName}Service.js`), str, 'utf8')
                    fs.remove(page_DIR5)
                })
                await fs.copy(TPL_DIR6, page_DIR6)
                ejs.renderFile(page_DIR6, answers, {}, async function(err, str) {
                    let routerFile = await fs.readFile(path.resolve('./src/router/asyncRoutes.js'), "utf-8")
                    let routerFileList = routerFile.split('asyncRoutes = ')
                    let AsyncRouter = routerFileList[1].trim()
                    AsyncRouter = AsyncRouter.substring(0, AsyncRouter.length - 1)
                    AsyncRouter = AsyncRouter.trim() + ',\n  ' + str + '\n]\n'
                    let fileHandled = routerFileList[0] + 'asyncRoutes = ' + AsyncRouter
                    fs.writeFile('./src/router/asyncRoutes.js', fileHandled, 'utf8')
                    fs.remove(page_DIR6)
                })
            })

    },
    init() {
        inquirer
            .prompt([{
                    type: 'text',
                    message: '请输入文件夹名称',
                    name: 'name',
                    validate: function(input) {
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
                    type: 'text',
                    message: '请输入项目标题',
                    name: 'title',
                    default: '我的项目'
                },
                {
                    type: 'list',
                    message: '请选择模板',
                    choices: tempalteChoices,
                    name: 'kind'
                }
            ])
            .then(async answers => {
                const __dirname = answers.name;
                const selectItem = getSelectTemplate(answers.kind, tempaltes)
                if (__dirname) {
                    if (selectItem.description === '后台模板') {
                        const tempAnswer = await binHandler['form']()
                        selectItem.downloadUrl = tempAnswer.downloadUrl
                    }
                    const spinner = ora('下载初始化模板中，请稍等...');
                    spinner.start();
                    // // 创建文件夹
                    if (shelljs.test('-d', __dirname)) {
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
}
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
            console.log(`${key}----------------${tempaltes[key].description}`)
        }

    })
program.parse(process.argv);