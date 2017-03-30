'use strict'

require('colors')

const os = require('os')
const fs = require('fs')

const homedir = os.homedir()
const autoStartPath = homedir + '/.config/autostart'
const autoStartFile = autoStartPath + '/jars.desktop'
const desktopFileContent = '[Desktop Entry]\n\
Name=jars\n\
GenericName=jars service file\n\
Comment=Use Google Assistant or a Google Home device to execute custom commands on your computer\n\
Exec=/usr/bin/jars -s -d\n\
Terminal=false\n\
Type=Application\n\
Categories=Network;\n\
StartupNotify=false\n\
X-GNOME-Autostart-enabled=true\n\
'

function terminate(message, code) {
  console.log((message || '').red)
  process.exit(code)
}

exports.terminate = terminate

exports.enableAutoStart = () => {
  if(!fs.existsSync(autoStartPath))
    terminate('not a known desktop enviroment'.red, 1)

  if(fs.existsSync(autoStartFile))
    terminate('already added to startup items', 1)

  fs.writeFileSync(autoStartFile, desktopFileContent)
  console.log('✓'.green, 'jars service', 'added'.cyan, 'to startup items')
}

exports.disableAutoStart = () => {
  if(!fs.existsSync(autoStartPath))
    terminate('not a known desktop environment'.red, 1)

  if(!fs.existsSync(autoStartFile))
    terminate('jars service is not in startup items')

  fs.unlinkSync(autoStartFile)
  console.log('✓'.green, 'jars service', 'removed'.red, 'from startup items')
}
