# Typonode

Typonode is a minimal typing speed tester inside your terminal. It is built in Nodejs with Typescript and has no external dependencies.

Download page: [LINK](https://typonodedownload.netlify.app/)

## Description

Typonode started as hobby project with the goal to build a entire project from scratch. So it is strictly bounded with **Zero-dependency** motto.

UI is focused to be minimal yet informative and fullfulling. It is slightly customizable.



https://github.com/user-attachments/assets/50381dd0-34f4-4957-bbeb-42ae91e3c42d



## Features

The foremost features is `zero-dependencies`:

* Multiscreen: Main screen, Result screen and Settings Screen.
* Custom color coding through own mini package (chalky.js, a dumb minimal version of chalk.js)
* Responsive to terminal resize.
* Dynamic FPS (bound limit of 60-70 fps)
* Customizable settings. Set time limit, test type, capital.
* Persistence of your settings and highest record.


## Getting Started

If you are on `windows x64` or `linux`, you can download the executables from [githubrelease](https://github.com/ABA-aadarsh/typonode/releases/tag/Release1.0) or [website](https://typonodedownload.netlify.app/) .
Compiled executable version does not require any dependecies. Just download it and run it.
**Bonus Tip:** Rename the executable to your desire (or just "typonode") and set its path into your environment variable to access it anywhere you want

(It might soon be available through `npm`)

## For those you want to build themselves
If there is no executables available for your system (or simply want to build on your machine yourself), you can easily build it yourself.
### Dependencies

* Nodejs

### Installing

* Clone this repo into your system.`git clone https://github.com/ABA-aadarsh/typonode.git` or download as zip.
* Run `npm i`. This will install the typescript support for development.
* To test instantly, run `npm run dev`

### Building into executable
To build it as executable, follow these:
* After completing above installation process, run `npm run build`. This converts the Typescript to Javascript.
* To compile into executable, you can use `pkg` package. Install `pkg` by running command `npm i -g pkg`.
* Run `pkg dist/index.js --output typonode`. 
* Now you have an executable named "typonode" in the root folder (where you cloned the repo).

## Common Issue

Sometime due to system security, the application can't create a store file (file to store your settings and highest wpm record) and it might crash. In such case, follow these:
* Go to your home directory `~`. ( You can use terminal `cd ~`)
* Check if there is a `typonode.json` file. If not, create one.
* For relase 1.0: Overwrite the content of `typonode.json` with
	```
  { 
    "highestWPM": { "wpm": null, "accuracy": null },
    "settings": { 
    "testParams": { 
      "allowUppercase": false,
      "timeLimit": 15,
      "type": "common" 
    },
    "showFPS": true 
    } 
  }
	```
* Save the new file
## Feedbacks
If you have any feedbacks or improvement suggestions or found a problem, mail me on helloworldaadarsh@gmail.com
## Authors
[ABA-aadarsh](https://logs.aadarshbandhuaryal.com.np)

## Version History

* 1.0
    * First release

## License

I guess the code is open for everyone. You can do anything you want with it.

## Acknowledgments

* [monkeytype](https://www.monkeytype.com) for inspiration
* [netlify](https://www.netlify.com) for free hosting of download page.
