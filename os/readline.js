import { state, lineEditorElem } from "../index.js";
import { clear } from "./commands.js";
import * as shell from "./shell.js";

/***
 * @param {string} line
 */
export function tabComplete(line, cursorPos) {
    console.log(line);
    const args = shell.parseLine(line);
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
        options = Object.keys(shell.commands).filter(command => command.startsWith(arg));
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
    else if (options.length > 1) {
        shell.commands.echo.run(options);
    }

    focusAndMoveCursorToTheEnd();
}

/***
 * @param {KeyboardEvent} e
 */
export function handleKeyDown(e) {
    switch (e.key) {
        case "Enter":
            e.preventDefault();
            shell.runCommand(state.commandLine);
            break;
        case "ArrowUp":
            e.preventDefault();
            if (state.historyIndex > 0) {
                state.historyIndex--;
                console.log(state.historyIndex, state.history);
                focusAndMoveCursorToTheEnd();
            }
            break;
        case "ArrowDown":
            e.preventDefault();
            if (state.historyIndex < state.history.length) {
                state.historyIndex++;
                console.log(state.historyIndex, state.history);
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
}

/***
 * @param {KeyboardEvent} e
 */
export function handleKeyUp(e) {
    
    if (e.key == "Enter") {
        e.preventDefault();
    }
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


