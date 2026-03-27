const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
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
}

function deactivate() {
    //
}

module.exports = { activate, deactivate };
