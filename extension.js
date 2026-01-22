const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
	// --------------------------
	// 1️⃣ Copy files/folders to clipboard in LLM format
	// --------------------------
	const disposableCopyFiles = vscode.commands.registerCommand('copy-code-for-llm.copyFiles', async (...args) => {
		// flatten the array of arrays
		let uris = args.flat(Infinity);

		// 🔁 Fallback for Command Palette
		if (!uris.length) {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				uris = [editor.document.uri];
			}
		}

		if (!uris.length) {
			vscode.window.showInformationMessage(
				'Select files/folders in Explorer or open a file before running this command.'
			);
			return;
		}

		const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
		if (!workspaceFolder) {
			vscode.window.showErrorMessage('Please open a workspace folder first.');
			return;
		}

		const allFiles = [];
		const processedPaths = new Set(); // <-- temp cache for processed file paths

		for (const uri of uris) {
			const stats = fs.statSync(uri.fsPath);
			if (stats.isDirectory()) {
				for (const file of getAllFiles(uri.fsPath)) {
					if (!processedPaths.has(file)) {
						allFiles.push(file);
						processedPaths.add(file);
					}
				}
			} else if (stats.isFile()) {
				if (!processedPaths.has(uri.fsPath)) {
					allFiles.push(uri.fsPath);
					processedPaths.add(uri.fsPath);
				}
			}
		}

		const formattedFiles = allFiles.map(filePath => {
			const content = fs.readFileSync(filePath, 'utf8');
			const relativePath = path.relative(workspaceFolder, filePath);
			return { path: relativePath, content };
		});

		const lmmInput = formattedFiles
			.map(f => `\`\`\`${f.path}\n${f.content}\n\`\`\``)
			.join('\n\n');

		await vscode.env.clipboard.writeText(lmmInput);
		showMessage('✅ Files copied!');
		// vscode.window.setStatusBarMessage('✅ Files copied!', 3000);
	});

	// --------------------------
	// 2️⃣ Open selected code in ChatGPT chat
	// --------------------------
	const disposableOpenChatGPT = vscode.commands.registerCommand('copy-code-for-llm.openSelection', async () => {
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
	});

	context.subscriptions.push(disposableCopyFiles, disposableOpenChatGPT);
}

function showMessage(msg, timeout = 3000) {
	const disposable = vscode.window.showInformationMessage(msg);

	setTimeout(() => {
		console.log(disposable?.dispose);
		disposable?.dispose();
	}, timeout); // 3 seconds
}

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

function deactivate() { }

module.exports = { activate, deactivate };
