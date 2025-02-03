import { fs, state, terminalElem, commands, echo } from "./main.js";

export function help(args) {
    let helpMessage = "";

    for (const command in commands) {
        helpMessage += escape(`${command}\t${commands[command].usage}\n`);
    }

    echo(helpMessage);
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
        echo(`error: '${name}' no such file or directory\n`);
        return null;
    }

    return match;
}

export function ls(args) {
    let contents = state.workdir.contents;

    if (args.length == 1) {
        const obj = getFsObjectByName(args[0]);
        if(!obj) return;
        
        if(!isDirectory(obj)) {
            echo(`${obj.name}\n`);
            return;
        }

        contents = obj.contents;
    }

    for (const obj of contents) {
        echo(`${obj.name}${isDirectory(obj) ? '/' : ''}\n`);
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
        echo(`cd: cannot cd into a file\n`);
    }
}

export function cat(args) {
    if (args.length == 0) {
        echo("usage: cat <filename>\n");
        return;
    }

    const obj = getFsObjectByName(args[0]);
    if (!isDirectory(obj)) {
        echo(obj.contents + "\n");
    }
    else {
        echo(`error: '${obj.name}' is a directory\n`);
    }
}

export function tree(args) {
    echo(JSON.stringify(fs, null, "    ") + "\n");
}

