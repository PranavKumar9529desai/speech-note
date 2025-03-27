# Speech Note VS Code Extension Architecture

## Overview

This extension integrates VS Code with Speech Note (a Linux speech-to-text utility) to enable voice dictation directly into the editor. When activated via the "Alt+l" shortcut, the extension will trigger Speech Note to start listening, capture the transcribed text, and inject it at the current cursor position in the VS Code editor.

## System Architecture

```
┌─────────────────┐      ┌────────────────┐     ┌───────────────┐
│                 │      │                │     │               │
│  VS Code        │      │  Speech Note   │     │  Temp File    │
│  Extension      │<---->│  CLI Process   │<--->│  Buffer       │
│                 │      │                │     │               │
└─────────────────┘      └────────────────┘     └───────────────┘
        │                                             ▲
        │                                             │
        ▼                                             │
┌─────────────────┐                           ┌───────────────┐
│                 │                           │               │
│  VS Code        │                           │  File         │
│  Text Editor    │                           │  Watcher      │
│                 │                           │               │
└─────────────────┘                           └───────────────┘
```

## Components

1. **VS Code Extension**:
   - Main extension module
   - Command registration
   - Keybinding configuration
   - Editor integration

2. **Speech Note Integration**:
   - Process spawning and management
   - Command-line argument handling
   - Output capture

3. **Text Injection**:
   - File monitoring
   - Editor text insertion

## Required Files

1. **`package.json`**
   - Extension metadata
   - Command definitions
   - Keybinding configurations
   - Dependencies

2. **`extension.ts`** (Main extension file)
   - Extension activation logic
   - Command registration
   - Speech Note process management
   - Text injection logic

3. **`speechNoteService.ts`**
   - Interface with Speech Note CLI
   - Process spawning and management
   - Output handling

4. **`textInjector.ts`**
   - File watching logic
   - Text processing
   - VS Code editor integration

5. **`config.ts`**
   - Extension configuration
   - Path to Speech Note executable
   - Temporary file location

## Tools & Dependencies

1. **Required Tools**:
   - Node.js & npm (for extension development)
   - VS Code Extension API
   - Speech Note installed on the system
   - TypeScript (for development)

2. **NPM Dependencies**:
   - `@types/vscode` - TypeScript definitions for VS Code API
   - `@types/node` - TypeScript definitions for Node.js
   - `chokidar` - File watching library
   - `child_process` - For spawning Speech Note process

## Workflow

1. **Extension Activation**:
   - Register the command `speech-note.startListening`
   - Set up file watcher for temporary output file

2. **Keyboard Shortcut Trigger**:
   - User presses "Alt+l"
   - VS Code triggers the registered command

3. **Speech Note Invocation**:
   - Extension spawns a child process running Speech Note
   - Command: `dsnote --action start-listening --app-standalone`
   - Configure Speech Note to output transcribed text to a temporary file

4. **Text Capture**:
   - Speech Note captures audio and transcribes it
   - Transcribed text is written to a predefined temporary file

5. **File Monitoring**:
   - Extension watches the temporary file for changes
   - When new content is detected, it reads the file

6. **Text Injection**:
   - Extension retrieves current editor and cursor position
   - Inserts the captured text at the cursor position
   - Clears or marks the temporary file as processed

7. **Stop Listening**:
   - Implement a command to stop listening (optional)
   - This would invoke `dsnote --action stop-listening`

## Technical Implementation Details

### Speech Note Integration

The extension will use Node.js `child_process` to spawn Speech Note:

```typescript
const speechNoteProcess = spawn('dsnote', ['--action', 'start-listening', '--app-standalone']);
```

To capture output, we'll configure Speech Note to write to a temporary file:

```
const tempFilePath = '/tmp/vscode-speech-note-output.txt';
```

### Text Injection

For text injection, we'll use VS Code's editor API:

```typescript
vscode.window.activeTextEditor.edit((editBuilder) => {
  const position = vscode.window.activeTextEditor.selection.active;
  editBuilder.insert(position, capturedText);
});
```

### File Monitoring

We'll use a file watcher to detect when the temporary file is updated:

```typescript
const watcher = chokidar.watch(tempFilePath, {
  persistent: true,
  awaitWriteFinish: true
});

watcher.on('change', (path) => {
  const text = fs.readFileSync(path, 'utf8');
  injectTextAtCursor(text);
});
```

## Configuration Options

The extension will provide settings for customization:

1. Path to Speech Note executable
2. Temporary file location
3. Custom arguments for Speech Note
4. Auto-clear behavior for the temporary file

## Error Handling

1. Check if Speech Note is installed
2. Monitor process for crashes
3. Handle file access errors
4. Provide user feedback for common issues

## Future Enhancements

1. Status bar indicator for listening state
2. Support for additional Speech Note actions (translation, etc.)
3. User-configurable keyboard shortcuts
4. Language model selection via VS Code UI
5. Text formatting options for injected text

## Setup Instructions

For developers contributing to this extension:

1. Clone the repository
2. Run `npm install` to install dependencies
3. Ensure Speech Note is installed on your system
4. Run `npm run compile` to build the extension
5. Press F5 in VS Code to launch with the extension
