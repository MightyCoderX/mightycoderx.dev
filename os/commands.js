import { state, terminalElem } from "../index.js";
import { commands } from "./shell.js";
import { fs, isDirectory, getFsObject } from "./fs.js";

export function help(args) {
    let helpMessage = "";
    if (args.length == 0) {
        for (const command in commands) {
            helpMessage += `${command} ${commands[command]?.usage}\n`;
        }
    }
    else if (args.length == 1) {
        if (commands[args[0]]) {
            helpMessage = `usage: ${args[0]} ${commands[args[0]]?.usage}\n`;
        }
        else {
            commands.echo.run(`error: command '${args[0]}' found`);
            return;
        }
    }
    terminalElem.append(helpMessage);
}

export function clear() {
    terminalElem.innerHTML = "";
}

export function ls(args) {
    let contents = state.workdir.contents;

    if (args.length == 1 && args[0]) {
        const path = args[0];
        const obj = getFsObject(path);
        if (!obj) {
            commands.echo.run(`error: '${path}' no such file or directory`);
            return;
        }

        if (!isDirectory(obj)) {
            commands.echo.run(`${obj.name}`);
            return;
        }

        contents = obj.contents;
    }

    for (const obj of contents) {
        commands.echo.run(`${obj.name}${isDirectory(obj) ? '/' : ''}`);
    }
}

export function cd(args) {
    if (args.length == 0) {
        state.workdir = getFsObject("~");
        return;
    }

    const path = `${state.workdir.path}/${args[0]}`;

    const obj = getFsObject(path);
    if (!obj) {
        commands.echo.run(`error: '${path}' no such file or directory`);
        return;
    }

    if (isDirectory(obj)) {
        state.workdir = obj;
    }
    else {
        commands.echo.run(`cd: '${obj.path}' is a file`);
    }
}

export function cat(args) {
    if (args.length == 0) {
        commands.echo.run("usage: cat <filename>");
        return;
    }

    const path = args[0];

    const obj = getFsObject(path);

    if (!obj) {
        commands.echo.run(`error: '${path}' no such file or directory`);
        return;
    }


    if (!isDirectory(obj)) {
        commands.echo.run(obj.contents);
    }
    else {
        commands.echo.run(`error: '${obj.name}' is a directory`);
    }
}

export function tree(args) {
    commands.echo.run(JSON.stringify(fs, null, "    "));
}

