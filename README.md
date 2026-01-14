# Copy-for-LLM

Copy-for-LLM is a VS Code extension that helps you quickly prepare code and files for use with Large Language Models (LLMs) like ChatGPT.
It can copy selected files/folders or code to the clipboard in a format ready for LLM input, and also open selected code directly in ChatGPT.

---

## Features

- **Copy Files for LLM** – Copy the content of selected files or folders to the clipboard, formatted as:

\`\`\`
<file-path>
<file-content>
\`\`\`

- **Open Selected Code in ChatGPT** – Select code in your editor and open it in ChatGPT with a Markdown code block prefilled in the prompt.

- Fully integrated into **Explorer context menu** and **Command Palette**.

---

## Installation

1. Open VS Code.
2. Go to the **Extensions** view (`Ctrl+Shift+X` / `Cmd+Shift+X`).
3. Search for `Copy-for-LLM` (publisher: `apsonex`) and install.

Or install from VSIX:

```bash
code --install-extension copy-for-llm-0.0.1.vsix
