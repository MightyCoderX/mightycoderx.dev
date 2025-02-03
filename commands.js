import { fs, state, terminalElem, commands, echo } from "./main.js";

export function help(args) {
    let helpMessage = "";

    for (const command in commands) {
        helpMessage += `${command}\t${commands[command].usage}\n`;
    }

    terminalElem.append(helpMessage);
}

export function clear() {
    terminalElem.innerHTML = "";
}

export function isDirectory(obj) {
    return Array.isArray(obj.contents);
}

/***
 * @param {string} name
 * @returns {{ name: string, contents: [] | string} | null}
 */
function getFsObjectByName(name) {
    const match = state.workdir.contents.find(obj => obj.name === name);
    if (!match) {
        commands.echo.run(`error: '${name}' no such file or directory`);
        return null;
    }

    return match;
}

export function ls(args) {
    let contents = state.workdir.contents;

    if (args.length == 1) {
        const obj = getFsObjectByName(args[0]);
        if (!obj) return;

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
        state.workdir = "~";
        return;
    }
    const obj = getFsObjectByName(args[0]);
    if(!obj) return;

    if (isDirectory(obj)) {
        state.workdir = args[0];
    }
    else {
        commands.echo.run(`cd: cannot cd into a file`);
    }
}

export function cat(args) {
    if (args.length == 0) {
        commands.echo.run("usage: cat <filename>");
        return;
    }

    const obj = getFsObjectByName(args[0]);
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

