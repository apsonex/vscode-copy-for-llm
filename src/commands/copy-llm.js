const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const {
    showMessage,
    getFilesFromClipboardApi,
} = require('./vscode-utils');
const { defaultBinaryExtensions } = require('../constants')

async function formatFilesAndCopyToClipboard(allFiles) {
    const config = vscode.workspace.getConfiguration('copyCodeForLLM');
    const userBinaryExts = config.get('binaryExtensions', []);

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

    if (!workspaceFolder) {
        vscode.window.showErrorMessage('Please open a workspace folder first.');
        return [];
    }

    const formattedFiles = [];

    for (const filePath of allFiles) {
        const relativePath = path.relative(workspaceFolder, filePath);
        const ext = path.extname(filePath).toLowerCase();

        // Blacklist common binary/media extensions
        // Merge: use user-defined if provided, otherwise fall back to defaults
        const binaryExtensions = userBinaryExts.length > 0
            ? new Set(userBinaryExts.map(ext => ext.toLowerCase()))
            : new Set(defaultBinaryExtensions.map(ext => ext.toLowerCase()));

        if (binaryExtensions.has(ext)) {
            formattedFiles.push({
                path: relativePath,
                binary: true,
                parsed: true,
                size: fs.statSync(filePath).size,
            });
        } else {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                formattedFiles.push({
                    path: relativePath,
                    parsed: true,
                    content
                });
            } catch (err) {
                // Fallback if UTF-8 fails (e.g. weird encoding or actually binary)
                formattedFiles.push({
                    path: relativePath,
                    parsed: false,
                });
            }
        }
    }

    const lmmInput = formattedFiles
        .map(f => {
            if (!f.parsed) {
                return `File not readable: ${f.path}`;
            }

            if (f.binary === true) {
                return `Binary / Media File: ${f.path} - ${f.size} bytes`;
            }

            return `\`\`\`${f.path}\n${f.content}\n\`\`\``;
        })
        .join('\n\n');

    await vscode.env.clipboard.writeText(lmmInput);
    showMessage('✅ Files copied!');
}

async function copyViaCommandPallet() {
    const files = await getFilesFromClipboardApi();
    await formatFilesAndCopyToClipboard(files);
}

async function pickFilesFromActiveTabs() {
    const tabGroups = vscode.window.tabGroups;

    const items = tabGroups.activeTabGroup.tabs.map(item => ({
        uri: item.input.uri,
        label: item.label,
        description: item.input.uri.fsPath,
        path: item.input.uri.fsPath
    }));

    const picked = await vscode.window.showQuickPick(items, { canPickMany: true });

    if (!Array.isArray(picked)) return [];

    return picked.map(item => item.path);
}

async function copyFiles(...args) {
    if (Array.isArray(args?.[1])) {
        const files = args[1].map(item => item.fsPath);
        await formatFilesAndCopyToClipboard(files);
        return;
    }

    const files = await getFilesFromClipboardApi();

    if (files.length > 1) {
        await formatFilesAndCopyToClipboard(files);
    } else {
        const pickedFiles = await pickFilesFromActiveTabs();
        if (pickedFiles.length > 0) {
            await formatFilesAndCopyToClipboard(pickedFiles);
        }
    }
}


module.exports = {
    copyFiles,
}
