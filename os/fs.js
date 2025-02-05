export const fs =
{
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
                    name: "inner",
                    contents: [
                        {
                            name: "innerer",
                            contents: [
                                {
                                    name: "innerest",
                                    contents: []
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

export function isDirectory(obj) {
    return Array.isArray(obj.contents);
}

function getFsObjectInternal(fs, parts, depth) {
    let res;
    let part = parts[depth];

    if(part === "..") {
        depth--;
    }
    else if(part === ".") {
        depth++;
    }

    if(depth < 0) {
        return;
    }

    part = parts[depth];

    for (const obj of fs.contents) {
        if (part === obj.name) {
            if (part === parts.at(-1)) {
                res = obj;
                break;
            }

            if (Array.isArray(obj.contents)) {
                res = getFsObjectInternal(obj, parts, depth+1);
            }
        }
    }

    return res;
}

export function getFsObject(path) {
    if (path.startsWith("~")) {
        if(path.replace("/", "") === "~") {
            return {
                ...fs,
                path: path.replace("/", "")
            };
        }
        path = path.slice(2);
    }
    const parts = path.split("/");

    return {
        ...getFsObjectInternal(fs, parts, 0),
        path
    };
}

