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
    _history: JSON.parse(localStorage.getItem("history")) ?? [],
    _historyIndex: -1,
    get workdir() {
        return this._workdir;
    },
    set workdir(dir) {
        if (dir == "~") {
            this._workdir = fs;
        }
        this._workdir = this._workdir.contents.find(obj => obj.name === dir && isDirectory(obj)) ?? this._workdir;
    },
    get commandLine() {
        return lineEditorElem.textContent;
    },
    set commandLine(cli) {
        lineEditorElem.innerText = cli;
    },
    get history() {
        return this._history;
    },
    set history(array) {
        this._history = array;
    },
    appendHistory(commandLine) {
        this.history.push(commandLine);
    },
    get historyIndex() {
        return this._historyIndex != -1 ? this._historyIndex : this._history.length;
    },
    set historyIndex(index) {
        this.commandLine = this.history[this.historyIndex] || "";
        this._historyIndex = index;
    },
    set prompt(str) {
        promptElem.innerHTML = str;
    },
    get prompt() {
        return `${this.workdir.name} $ `
    }
};

/***
 * @type {{[key]: {name: string, usage: string}}}
 */
export const commands = {
    "help": {
        usage: "[command]",
        run: help
    },
    "echo": {
        usage: "[args...]",
        run(...args) {
            if(Array.isArray(args[0])) args = args[0];
            echo(args.join(" ") + "\n");
        }
    },
    "clear": {
        usage: "",
        run: clear
    },
    "history": {
        usage: "",
        run(args) {
            if (args[0] == "-c") {
                state.history = [];
            }
            else {
                echo(JSON.stringify(state.history) + "\n");
            }
        }
    },
    "cd": {
        usage: "[path]",
        run: cd
    },
    "ls": {
        usage: "[path]",
        run: ls
    },
    "cat": {
        usage: "<filename>",
        run: cat
    },
    "tree": {
        usage: "[path]",
        run: tree
    }
};

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
    const cmdName = args.shift(); //Remove command name and save

    terminalElem.append(state.prompt + line + "\n");

    if (line === "") return;

    state.appendHistory(line);

    if (commands[cmdName]) {
        try {
            commands[cmdName].run(args);
        }
        catch(e) {
            console.error(e);
            echo(`shell: error while running command: ${e}\n`);
        }

    }
    else {
        echo(`error: command '${cmdName}' not found\n`);
    }

    state.prompt = state.prompt;
    state.historyIndex = history.length;
    localStorage.setItem("history", JSON.stringify(state.history));
    state.commandLine = "";
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
            runCommand(state.commandLine);
            break;
        case "ArrowUp":
            e.preventDefault();
            if (state.historyIndex > 0) {
                state.historyIndex--;
                focusAndMoveCursorToTheEnd();
            }
            break;
        case "ArrowDown":
            e.preventDefault();
            if (state.historyIndex < history.length) {
                state.historyIndex++;
                focusAndMoveCursorToTheEnd();
            }
            break;
        case "Tab":
            e.preventDefault();
            tabComplete(state.commandLine, document.getSelection().anchorOffset);
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

