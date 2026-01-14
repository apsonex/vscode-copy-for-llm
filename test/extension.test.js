const assert = require('assert');
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const sinon = require('sinon');

suite('Copy-for-LLM Extension Test Suite', () => {

	// -------------------------
	// 1️⃣ Test the copyFiles command
	// -------------------------
	test('copyFiles command should copy file content to clipboard', async () => {
		// create a temporary file
		const tmpFilePath = path.join(__dirname, 'tmpTestFile.txt');
		const fileContent = 'console.log("hello world");';
		fs.writeFileSync(tmpFilePath, fileContent, 'utf8');

		// simulate the URI argument passed to the command
		const uri = vscode.Uri.file(tmpFilePath);

		// execute the command
		await vscode.commands.executeCommand('copy-for-llm.copyFiles', [uri]);

		// read clipboard content
		const clipboardText = await vscode.env.clipboard.readText();

		// it should include the file name and content
		assert.ok(clipboardText.includes('tmpTestFile.txt'));
		assert.ok(clipboardText.includes('console.log("hello world");'));

		// cleanup
		fs.unlinkSync(tmpFilePath);
	});

	// -------------------------
	// 2️⃣ Test the openSelection command
	// -------------------------
	test('openSelection command should copy selected code to clipboard', async () => {
		// create a new in-memory document
		const doc = await vscode.workspace.openTextDocument({ content: 'console.log("test");', language: 'javascript' });
		const editor = await vscode.window.showTextDocument(doc);

		// select all text
		editor.selection = new vscode.Selection(0, 0, doc.lineCount, 0);

		// mock openExternal so it doesn't actually try to open a browser
		const openExternalStub = sinon.stub(vscode.env, 'openExternal').resolves(true);

		// execute command
		await vscode.commands.executeCommand('copy-for-llm.openSelection');

		// check clipboard content
		const clipboardText = await vscode.env.clipboard.readText();
		assert.ok(clipboardText.includes('console.log("test");'));
		assert.ok(clipboardText.includes('```javascript')); // check Markdown block

		// restore stub
		openExternalStub.restore();

		// close the document after test
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	});
});
