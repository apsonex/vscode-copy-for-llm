const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { defaultBinaryExtensions } = require('./constants')

const { copyFiles } = require('./commands/copy-llm');
const { copySelectedCodeToChatGPT } = require('./commands/copy-to-chat');

function activate(context) {

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'copy-code-for-llm.copyFiles',
            copyFiles,
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'copy-code-for-llm.copySelectedCodeToChatGPT',
            copySelectedCodeToChatGPT
        )
    );

    console.log('activated');
}

function deactivate() {
    //
}

module.exports = { activate, deactivate };
