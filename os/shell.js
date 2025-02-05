import { state, terminalElem, lineEditorElem } from "../index.js";
import { help, clear, cd, ls, cat, tree } from "./commands.js";

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
            if (Array.isArray(args[0])) args = args[0];
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
            else if (args[0] == "-r") {
                let index = parseInt(args[1]);

                if (isNaN(index)) {
                    commands.echo.run(`error: '${index}' is not a valid number`);
                }
                else {
                    state.history.splice(index, 1);
                }
            }
            else {
                commands.echo.run(state.history.map((line, index) => `${index}\t${line}`).join("\n"));
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
 * @param {string} text 
 */
export function echo(text) {
    terminalElem.innerHTML += text;
}

/***
 * @param {string} line
 */
export function parseLine(line, trim = false) {
    line = trim ? line.trim() : line;
    const args = line.split(" ");

    return args;
}

/***
 * @param {string} line 
 */
export function runCommand(line) {
    const args = parseLine(line, true);
    const cmdName = args.shift(); //Remove command name and save

    terminalElem.append(state.prompt + line + "\n");

    if (line === "") return;

    state.appendHistory(line);

    if (commands[cmdName]) {
        try {
            commands[cmdName].run(args);
        }
        catch (e) {
            console.error(e);
            echo(`shell: error while running command: ${e}\n`);
        }

    }
    else {
        echo(`error: command '${cmdName}' not found\n`);
    }

    lineEditorElem.scrollIntoView(false);
    state.prompt = state.prompt;
    localStorage.setItem("history", JSON.stringify(state.history));
    state.commandLine = "";
}


