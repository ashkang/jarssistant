'use strict'

require('colors')

const daemon = require('daemon')
const fs = require('fs')
const os = require('os')
const _u = require('lodash')
const readLastLines = require('read-last-lines');
const firstline = require('firstline')
const similar = require('string-similarity')
const shell = require('shelljs');
const program = require('commander');
const npid = require('npid')
const debug = require('debug')('debug')

const configuration = require('./configuration.js')

const pidfile = os.tmpdir() + '/jarssistant.pid'

function shutdown(keepPid) {
  if(!keepPid)
    npid.remove(pidfile)

  process.exit(1)
}

function getpid(cb) {
  if(!fs.existsSync(pidfile))
    return cb()

  firstline(pidfile).then(
    line => {
      cb(null, parseInt(line))
    }
  )
}

process.on('SIGTERM', () => {
  shutdown()
})

// process.on('SIGINT', () => {
//   shutdown()
// })
//

// process.on('SIGKILL', () => {
//   shutdown()
// })

exports.pidfile = pidfile

exports.shutdown = () => {
  getpid((err, pid) => {
    if(!pid) {
      console.log('jars service is not running')
      return
    }

    if(fs.existsSync(pidfile)) {
      process.kill(pid)
      console.log('terminating jars service with pid:', pid)
    }
  })
}

exports.status = () => {
  getpid((err, pid) => {
    if(fs.existsSync(pidfile)) {
      console.log('✓'.green, 'jars service is up and running with pid:', pid)
    } else {
      console.log('✘'.red, 'jars service is not running or it has crashed')
    }
  })
}

exports.reload = () => {
  getpid((err, pid) => {
    if(!pid) {
      console.log('jars service is not running')
      return
    }

    if(fs.existsSync(pidfile)) {
      process.kill(pid, 'SIGHUP')
      console.log('reloading jars service configurations')
    }
  })
}

exports.handler = (daemonize, configFile) => {
  exports.CONFIG_FILE = configFile || exports.CONFIG_FILE

  let config = configuration.readConfiguration(configFile)

  const threshold = config.threshold
  const watch = config.dropbox_relay
  const commands = config.commands

  process.on('SIGHUP', () => {
    config = configuration.readConfiguration(exports.CONFIG_FILE)
    debug('recieved SIGHUP. reloading configuration\n', JSON.stringify(config, null, 2))
  })

  debug('jars daemon is starting with the following configuration:\n', JSON.stringify(config, null, 2))

  console.log('👁  jars is now watching for incoming commands...'.yellow)

  if (daemonize) {
    daemon()

    try {
      const pid = npid.create(pidfile)
      pid.removeOnExit()
    } catch (err) {
      shutdown(true)
    }
  }

  fs.watchFile(watch, () => {
    debug('*'.cyan, 'incoming command...')

    readLastLines.read(watch, 1)
    .then((lines) => {
      const p = commands.map((r, i) => {
        return {
          index: i,
          name: r.name,
          similarity: similar.compareTwoStrings(lines, r.keywords)
        }
      })

      const s = _u.orderBy(p, 'similarity', ['desc'])
      const index = s[0].index
      const command = commands[index]

      debug(s)
      if (s[0].similarity > threshold) {
        debug('=> action:'.cyan, command.name.yellow, 'similarity:', s[0].similarity)

        shell.exec(command.command, (err, stdout, stderr) => {
          console.log('=>'.yellow, command.name.cyan)
          if(err) {
            console.log('✘'.red, command.name.cyan, stderr)
          }
          else {
            console.log('✓'.green, command.name.cyan, stdout)
          }
        })
      }
    })
  })
}
