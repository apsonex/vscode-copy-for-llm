const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

// Recursive helper
function getAllFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFiles(filePath));
        } else {
            results.push(filePath);
        }
    }
    return results;
}

function getAllFilesRecursivelyFromPaths(filePaths) {
    const allFiles = [];
    const processedPaths = new Set();

    if (!Array.isArray(filePaths)) return allFiles;

    for (const index in filePaths) {
        const _path = filePaths[index];
        const stats = fs.statSync(_path);
        if (stats.isDirectory()) {
            for (const file of getAllFiles(_path)) {
                if (!processedPaths.has(file)) {
                    allFiles.push(file);
                    processedPaths.add(file);
                }
            }
        } else if (stats.isFile()) {
            if (!processedPaths.has(_path)) {
                allFiles.push(_path);
                processedPaths.add(_path);
            }
        }
    }

    return allFiles;
}

async function getFilesFromClipboardApi() {
    try {
        await vscode.commands.executeCommand('copyFilePath');
        await new Promise(resolve => setTimeout(resolve, 50));
        const clipboardText = await vscode.env.clipboard.readText();

        if (!clipboardText) return [];

        const filePaths = clipboardText.split(/\r?\n/).filter(line => line.trim() !== '');

        return getAllFilesRecursivelyFromPaths(filePaths);
    } catch (error) {
        console.log(error);
        return [];
    }
}


function showMessage(msg, timeout = 3000) {
    const disposable = vscode.window.showInformationMessage(msg);

    setTimeout(() => {
        console.log(disposable?.dispose);
        disposable?.dispose();
    }, timeout); // 3 seconds
}

module.exports = {
    getFilesFromClipboardApi,
    showMessage,
}
