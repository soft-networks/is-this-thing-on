import chalk from "chalk";
import e from "express";



export function logError(message:string, ...args: any[]) {
  console.error(chalk.red(message),  (args && args.length>0) ? args : "");
}

export function logInfo(message:string, ...args: any[]) {
  console.info(chalk.gray(message), (args && args.length>0) ? args : "");
}

export function logUpdate(message:string, ...args: any[]) {
  console.info(chalk.blue(message), (args && args.length>0) ? args : "");
}

export function logWarning(message:string, ...args: any[]) {
  console.warn(chalk.yellow(message), (args && args.length>0) ? args : "");
}