import { handleKeyDown, handleKeyUp } from "./os/readline.js";
import { fs } from "./os/fs.js";

export const terminalElem = document.getElementById("terminal");
const cliElem = document.getElementById("cli");
const promptElem = document.getElementById("prompt");

export const lineEditorElem = document.getElementById("lineEditor");
lineEditorElem.addEventListener("keydown", handleKeyDown);
lineEditorElem.addEventListener("keyup", handleKeyUp);

document.addEventListener("click", _ => lineEditorElem.focus());

export const state = {
    _workdir: {
        ...fs,
        path: "~"
    },
    _history: JSON.parse(localStorage.getItem("history")) ?? [],
    _historyIndex: -1,
    get workdir() {
        return this._workdir;
    },
    set workdir(dir) {
        this._workdir = dir;
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
        this.commandLine = this.history[index] || "";
        this._historyIndex = index;
    },
    set prompt(str) {
        promptElem.innerHTML = str;
    },
    get prompt() {
        return `${this.workdir.name} $ `
    }
};



