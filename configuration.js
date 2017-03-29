const validator = require('is-my-json-valid')
const os = require('os')
const fs = require('fs')
const jsonfile = require('jsonfile')

const utils = require('./utils.js')

exports.readConfiguration = (configFile) => {
  if(configFile && !fs.existsSync(configFile))
    utils.terminate(`cannot open configuration file: ${configFile}`.red, 1)

  if(!configFile && !fs.existsSync('./config.json'))
    utils.terminate(`cannot open default configuration file: ./config.json`.red, 1)

  const config = jsonfile.readFileSync(configFile || './config.json')

  const configuration = {
    dropbox_relay: process.env.JARS_DROPBOX_RELAY_PATH || config.dropbox_relay || os.homedir() + '/Dropbox/IFTTT/jars_relay.txt',
    threshold: parseFloat(process.env.JARS_THRESHOLD) || config.threshold || 0.45,
    commands: config.commands || []
  }

  const configuration_schema = {
    required: true,
    type: 'object',
    properties: {
      dropbox_relay: {
        type: 'string',
        required: false
      },
      threshold: {
        type: 'number',
        required: false,
        minimum: 0.1,
        maximum: 1
      },
      commands: {
        type: 'array',
        items: {
          properties: {
            name: {
              type: 'string',
              required: true,
            },
            type: {
              type: 'string',
              enum: [ 'bash' ],
              required: true
            },
            command: {
              type: 'string',
              required: true
            },
            description: {
              type: 'string',
              required: false
            },
            keywords: {
              type: 'string',
              required: true
            }
          }
        }
      }
    }
  }

  const validate = validator(configuration_schema, {verbose: true})

  if (!validate(configuration)) {
    const err = validate.errors[0]
    utils.terminate('✘ '.red + `invalid configuration file: ${err.field} ${err.message}`, 1)
  }

  if (!fs.existsSync(configuration.dropbox_relay)) {
    utils.terminate('✘ '.red + `Dropbox relay file not found: ${configuration.dropbox_relay}`, 1)
  }

  return configuration
}
