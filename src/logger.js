import chalk from 'chalk';;

export function int(data) {
    console.log(chalk.green(`[INTERNAL]` + ' ' + data));
}
export function er(data) {
    console.log(chalk.red(`!!! [ERROR]` + ' ' + data));
}
export function warn(data) {
    console.log(chalk.yellow(`[WARNING]` + ' ' + data));
}
export function fb(data) {
    console.log(chalk.cyan(`~ [FACEBOOK]` + ' ' + data));
}
export function load(data) {
    console.log(chalk.green(`[LOADING]` + ' ' + data));
}