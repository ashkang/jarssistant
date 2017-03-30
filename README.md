Jarssistant
=========

Use [Google Assistant](https://assistant.google.com/) or a [Google Home](https://madeby.google.com/home/) device to execute custom commands on your computer.
Jarssistant is a small and dumb utility which uses [Dropbox](https://www.dropbox.com/) and [IFTTT](https://ifttt.com) to listen for incoming commands.
It then utilizes a similarity algorithm to compare your command with it's locally stored list of pre-defined set commands. You don't need to say commands exactly in order
or completely. If your phrase has a similarity level close to a match, jarssistant just goes ahead with executing it.

Documentation
-------------

Starts jarssistant as a service

    # jars -s -d


Stops jarssistant service

    # jars -k

Adds jarssistant to your startup services

    # jars -a

Removes jarssistant from your startup services

    # jars -z

Shows jarssistant service status

    # jars -p

Reloads jarssistant configuration file

    # jars -r

Points you to ifttt service applet configuration page

    # jars -i


Cool Stuff
----------
Here are some of the things you can do:

* Synchronize your git repositories
* Send a message to your team with [Slack](https://slack.com) when you are going out
* Update your computer
* Turn off your system remotely if you forgot to do so
* Use your Raspberry Pie at home to turn on your computer remotely
* Restart your production server
* Launch a shuttle into orbit with just a voice command
* ...etc (YMMV. Use the power of bash, command line utilities, curl, public APIs and your imagination)

Installation
-------
With npm do:

    # npm install -g jarssistant

IFTTT configuration
-------------------
1. Go to [your applets page](https://ifttt.com/my_applets)
1. Click **New Applet**
1. Click on **+ this**
1. Search for **Google Assistant**
1. Click **Say a phrase with a text ingredient**
1. In section "What do you want to say?" type in **execute $**
1. Click **Create trigger**
1. Click on **+ that**
1. Search for **Dropbox**
1. Click **Append to a text file**
1. In section "File name (required), type in a file name in your Dropbox directory. We'll be using this later.
1. In section "Content (required)", type in **{{TextField}}** and get rid of everything else.
1. In section "Dropbox folder path", type in the folder name to hold the relay file. Default is: **IFTTT**
1. Click **Create action** and you are done.
1. Test your applet to make sure everything is fine.

Configuration
------------
* `dropbox_relay` or environment variable `JARS_DROPBOX_RELAY_PATH`: specify the full path of Dropbox relay file that you configured on ifttt. e.g. `/Users/tony.stark/Dropbox/jars_relay.txt`

**defaults to:** `$HOME/Dropbox/IFTTT/jars_relay.txt`

* `threshold` or environment variable `JARS_THRESHOLD`: jarssistant compares all locally defined custom commands with the one coming from your assistant device.
It would not execute it if it is below this threshold level. Similarity is a number between 0 and 1, with 0 meaning no similarity at all
and 1 meaning a perfect match. You can arrive at your magic threshold number using trial and error.

Command Definition
-------------
Each command has 5 sections.

* `name`: choose a friendly name for your command
* `type`: currently, only *bash* commands are supported.
* `description`: describe what this particular command does, so that you don't forget
* `command`: a string consisting of a bash command. You can chain multiple bash commands in the following format:
    `command1; command2; command3; ...; command N`
* `keywords`: a string consisting of phrases you normally use to execute this command. Be as descriptive as possible. For instance,
if you normally say **update jarssistant repository on columbia** but you might occasionally say **synchronize jarssistant git repository on my desktop**
then use a keywords argument containing all of them: **update synchronize my git jarssistant repository on my desktop columbia**

Caveats
-------
* You can take a look at `config.json.example` for very simple ideas.
* Don't forget to reload jarvis configuration after adding your new commands with `jars -r`.
* Don't use potentially destructive commands. I don't take responsibility for your blown up computers, lost data or fried circuit boards.
* For turning computers on, you can send a magic packet with a wake on lan tool like [this](https://linux.die.net/man/8/ether-wake).
* To enable debugging, set the **DEBUG** environment variable to **debug**. e.g. `export DEBUG=debug; jars -s`
* Share your ideas with other people.
* I'm completely new to the art of node. Please excuse the funky code here. This has been a weekend fun project for me, for fun and profit.
