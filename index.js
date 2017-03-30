#! /usr/bin/env node
'use strict'

const program = require('commander');
const open = require('open')

const utils = require('./utils.js')
const jars = require('./daemon.js')

program
  .version('0.1.0')
  .option('-d, --daemon', 'run jars as daemon')
  .option('-s, --start', 'start jars service')
  .option('-k, --stop', 'stop jars service')
  .option('-p, --status', 'show jars service status')
  .option('-c, --config <path>', 'provide jars configuration file. defaults to ./config.json')
  .option('-r, --reload', 'reload configuration file')
  .option('-i, --ifttt', 'configure ifttt applet')
  .option('-a, --enable-auto-start', 'add jars service to startup items')
  .option('-z, --disable-auto-start', 'remove jars service from startup items')
  .parse(process.argv)

if(program.start) {
  jars.handler(program.daemon, program.config)
}

if(!program.start && program.stop) {
  jars.shutdown()
}

if(!program.start && program.status) {
  jars.status()
}

if(program.reload) {
  jars.reload()
}

if(program.ifttt) {
  open('https://ifttt.com/my_applets')
}

if(program.enableAutoStart) {
  utils.enableAutoStart()
}

if(program.disableAutoStart) {
  utils.disableAutoStart()
}
