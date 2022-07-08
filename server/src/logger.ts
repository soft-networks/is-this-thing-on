import chalk from "chalk";
import e from "express";



export function logError(message:string, ...args: any[]) {
  console.error(chalk.red(message),args);
}

export function logInfo(message:string, ...args: any[]) {
  console.info(chalk.gray(message),args);
}

export function logUpdate(message:string, ...args: any[]) {
  console.info(chalk.blue(message),args);
}

export function logWarning(message:string, ...args: any[]) {
  console.warn(chalk.yellow(message),args);
}