const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

async function copySelectedCodeToChatGPT() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    let selectedText = editor.document.getText(editor.selection);
    if (!selectedText) {
        vscode.window.showInformationMessage('No code selected.');
        return;
    }

    // normalize line endings
    selectedText = selectedText.replace(/\r\n/g, '\n');

    // wrap in Markdown code block
    const languageId = editor.document.languageId || '';
    const mdCodeBlock = `\`\`\`${languageId}\n${selectedText}\n\`\`\``;

    // encode and open ChatGPT URL
    const chatURL = `https://chat.openai.com/?model=gpt-4&prompt=${encodeURIComponent(mdCodeBlock)}`;
    await vscode.env.openExternal(vscode.Uri.parse(chatURL));

    vscode.window.showInformationMessage('🌐 Selected code opened in ChatGPT (via prompt URL).');
}

module.exports = {
    copySelectedCodeToChatGPT,
}
