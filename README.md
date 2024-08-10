<div align="center">

<img width="" src="./src/assets/img/favicon.svg"  width=160 height=160>

# MacroDroid Web Controller

**Single page app that serves as a sort of remote control to trigger MacroDroid actions on remote Android devices connected to internet and running the MacroDroid app with ease**

<a href="https://www.gnu.org/licenses/agpl-3.0.en.html" alt="License: GPLv3"><img src="https://img.shields.io/badge/License-AGPL%20v3-blue.svg"></a>

</div>

## Using the app

The app is available at [https://macrodroid-wc.web.app/](https://macrodroid-wc.web.app/). It will guide you through its usage.

## Development

### Prereqisities

- Internet connection (to download source code and other software and also possibly test the app)

- [Node.js](https://nodejs.org/)

### Setting up the project folder

- Download the source code

Either run `git clone https://github.com/FrameXX/macrodroid-web-controller.git` in you terminal if you have [Git](https://git-scm.com/) installed or download the source code zip from github and extract it to the project folder that name however you like.

- Install dependencies

Run `npm install` or just `npm i` inside the project's root folder.

### Developing

- Run local server

Run `npm run dev` or `npm run landev` to start the server on LAN instead of localhost, but you have to have you local ip address defined coreectly in the `landev` command in [package.json](package.json#L8).

### Distributing

- Build the app

When you are ready you can try to build a distributable version using `npm run build` that will be saved into a folder called `dist` if it finishes without errors.

- Host the website

Host the website on domain using service of your choice.
