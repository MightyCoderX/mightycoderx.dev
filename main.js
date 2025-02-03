import { help, clear, ls, cd, cat, tree, isDirectory } from "./commands.js";

export const terminalElem = document.getElementById("terminal");
const cliElem = document.getElementById("cli");
const promptElem = document.getElementById("prompt");
const lineEditorElem = document.getElementById("lineEditor");

/***
 * @param {string} text 
 */
export function echo(text) {
    terminalElem.innerHTML += text;
}

document.addEventListener("click", e => lineEditorElem.focus());
export const fs = {
    name: "~",
    contents: [
        {
            name: "projects",
            contents: [
                {
                    name: "MightyOS",
                    contents: "A simple desktop environment <a href='https://os.mightycoderx.dev' target='_blank'>https://os.mightycoderx.dev</a>"
                }
            ]
        },
        {
            name: "skills",
            contents: [
                {
                    name: "",
                    contents: ""
                }
            ]
        }
    ]
};

export const state = {
    _workdir: fs,
    get workdir() {
        return this._workdir;
    },
    set workdir(dir) {
        if (dir == "~") {
            this._workdir = fs;
        }
        this._workdir = this._workdir.contents.find(obj => obj.name === dir && isDirectory(obj)) ?? this._workdir;
    },
    get prompt() {
        return `${this.workdir.name} $ `
    },
};

/***
 * @type {[{name: string, usage: string}]}
 */
export const commands = {
    "help": {
        usage: "[command]"
    },
    "echo": {
        usage: "[args...]"
    },
    "clear": {
        usage: ""
    },
    "history": {
        usage: ""
    },
    "cd": {
        usage: "[path]"
    },
    "ls": {
        usage: "[path]"
    },
    "cat": {
        usage: "<filename>"
    },
    "tree": {
        usage: "[path]"
    }
};

export let history = JSON.parse(localStorage.getItem("history")) ?? [];
export let history_index = history.length;

/***
 * @param {string} line
 */
function parseLine(line, trim = false) {
    line = trim ? line.trim() : line;
    const args = line.split(" ");

    return args;
}
/***
 * @param {string} line 
 */
function runCommand(line) {
    const args = parseLine(line, true);

    terminalElem.append(state.prompt + line + "\n");

    if (line === "") return;

    history.push(line);

    if (commands[args[0]]) {
        switch (args[0]) {
            case "help":
                help(commands, args.shift());
                break;
            case "echo":
                args.shift();
                echo(args.join(" ") + "\n");
                break;
            case "clear":
                clear(args.shift());
                break;
            case "history":
                if (args[1] == "-c") {
                    history = [];
                    break;
                }
                echo(JSON.stringify(history) + "\n");
                break;
            case "ls":
                ls(args.slice(1));
                break;
            case "cd":
                cd(args.slice(1));
                break;
            case "cat":
                cat(args.slice(1));
                break;
            case "tree":
                tree(args.slice());
                break;
        }
    }
    else {
        echo(`error: command '${args[0]}' not found\n`);
    }

    history_index = history.length;
    localStorage.setItem("history", JSON.stringify(history));

    lineEditorElem.innerHTML = "";
    promptElem.innerHTML = state.prompt;
}

function focusAndMoveCursorToTheEnd() {
    lineEditorElem.focus();

    const range = document.createRange();
    const selection = window.getSelection();
    const { childNodes } = lineEditorElem;
    const lastChildNode = childNodes && childNodes.length - 1;

    range.selectNodeContents(lastChildNode === -1 ? lineEditorElem : childNodes[lastChildNode]);
    range.collapse(false);

    selection.removeAllRanges();
    selection.addRange(range);
}

/**
 * @param {string} line
 */
function tabComplete(line, cursorPos) {
    console.log(line);
    const args = parseLine(line);
    let argIndex = 0;

    if (args.length <= 1) {
        argIndex = 0;
    }
    else {
        for (let i = 0; i < cursorPos; i++) {
            console.log(line.charAt(i), cursorPos);
            if (line.charAt(i) == " ") {
                argIndex++;
            }
        }
    }

    let arg = args[argIndex].trim();
    let options = [];

    if (argIndex == 0) {
        options = Object.keys(commands).filter(command => command.startsWith(arg));
        console.log("Completing command");
    }
    else {
        options = state.workdir.contents.map(obj => obj.name).filter(obj => obj.startsWith(args[argIndex]));
        console.log("Completing arg", arg);
    }
    if (options.len == 0) return;

    if (options.length == 1) {
        document.execCommand("insertText", false, options[0].slice(arg.length) + " ");
    }
    else {
        echo(JSON.stringify(options) + "\n")
    }

    focusAndMoveCursorToTheEnd();
}

lineEditorElem.addEventListener("keydown", e => {
    switch (e.key) {
        case "Enter":
            e.preventDefault();
            runCommand(lineEditorElem.textContent);
            break;
        case "ArrowUp":
            e.preventDefault();
            if (history_index > 0) {
                history_index--;
                lineEditorElem.innerText = history[history_index];
                focusAndMoveCursorToTheEnd();
            }
            break;
        case "ArrowDown":
            e.preventDefault();
            if (history_index < history.length) {
                history_index++;
                lineEditorElem.innerText = history[history_index] || "";
                focusAndMoveCursorToTheEnd();
            }
            break;
        case "Tab":
            e.preventDefault();
            tabComplete(lineEditorElem.textContent, document.getSelection().anchorOffset);
            break;
    }

    if (e.ctrlKey) {
        switch (e.key) {
            case "l":
                e.preventDefault();
                clear();
                break;
            case "a":
                e.preventDefault();
                break;
            case "e":
                e.preventDefault();
                break;
        }
    }

});

lineEditorElem.addEventListener("keyup", e => {
    if (e.key == "Enter") {
        e.preventDefault();
    }

    if (e.key == "Tab") {
        e.preventDefault();
    }
});

