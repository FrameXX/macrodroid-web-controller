<div align="center">

<img width="" src="./src/assets/img/favicon.svg"  width=160 height=160>

# MacroDroid Web Controller

**Single page app that serves as a remote control to trigger MacroDroid actions on remote Android devices connected to internet and running the MacroDroid app with ease**

<a href="https://www.gnu.org/licenses/agpl-3.0.en.html" alt="License: GPLv3"><img src="https://img.shields.io/badge/License-AGPL%20v3-blue.svg"></a>

</div>

## Using the app

The app is available at [https://macrodroid-wc.web.app/](https://macrodroid-wc.web.app/). It will guide you through its usage.

## Features

- Easily create connections with devices running MacroDroid. Manage multiple connections and see when they were last active.
- Request actions on a single or multiple connections, see your last requested actions, save actions as favourite, create your custom actions and create links to your actions.
- Send notifications from your MacroDroid devices to the web client (usually on desktop), or share any text you wish.
- Inspect log to see responses to your actions or history of web client and connections activity.
- Use the magic text cheat sheet to remind yourself of MacroDroid's magic text options, without leaving the web UI.
- Selectively export and import data from the web client running on one device to other device.

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

Run `npm run dev` or `npm run landev` to run the server also on LAN instead of just localhost.

### Distributing

- Build the app

When you are ready you can try to build a distributable version using `npm run build` that will be saved into a folder called `dist` if it finishes without errors.

- Host the website

Host the website on domain and using service of your choice.
