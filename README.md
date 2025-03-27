# Speech Note Extension for VS Code/Cursor

A VS Code/Cursor extension that integrates with Speech Note to provide speech-to-text capabilities directly in your editor.

## Prerequisites

- Linux-based OS
- [Speech Note](https://mpr.makedeb.org/packages/speechnote) installed via flatpak: `flatpak install net.mkiol.SpeechNote`
- VS Code or Cursor IDE

## Installation

### From VSIX File (Recommended)

1. Download the `.vsix` file from the latest release
2. In VS Code/Cursor, open the Extensions view (`Ctrl+Shift+X`)
3. Click the "..." menu (top-right of Extensions view)
4. Select "Install from VSIX..."
5. Choose the downloaded `.vsix` file

### From Source

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Copy the extension folder to your VS Code/Cursor extensions directory

## Usage

### Starting Speech Recognition

There are multiple ways to start speech recognition:

- **Status Bar**: Click the "Speech Note" icon in the status bar (bottom right)
- **Keyboard Shortcut**: Press `Alt+T` to toggle speech recognition on/off
- **Command Palette**: Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) and use any of these commands:
  - `Start Speech Note Listening` (Alt+L)
  - `Stop Speech Note Listening` (Alt+S)
  - `Toggle Speech Note Listening` (Alt+T)

When active, the status bar item will change to "Speech Note (active)" with a warning background color.

### Dictation

1. Position your cursor where you want the text to appear
2. Start speaking clearly
3. The recognized text will be automatically inserted at your cursor position
4. Continue speaking and the text will keep appearing

### Stopping Speech Recognition

To stop dictation:
- Click the status bar item again
- Press `Alt+T` again
- Use the Command Palette and select "Stop Speech Note Listening"

## Configuration

In Settings (`Ctrl+,`), you can customize:

- `speechNote.executablePath`: Path to Speech Note executable (default: `flatpak run net.mkiol.SpeechNote`)
- `speechNote.clipboardPollingInterval`: Interval to check clipboard (in milliseconds, default: 500)

## How It Works

1. The extension runs Speech Note in clipboard mode via flatpak
2. Speech is recognized and automatically added to your clipboard
3. The extension monitors your clipboard for changes
4. New text is detected and inserted at your cursor position

## Troubleshooting

If you encounter issues:

1. **No text appearing?** Check:
   - Is the status bar showing "Speech Note (active)"?
   - Do you have Speech Note installed via flatpak?
   - Is your microphone working?
   - Do you have an editor window open with focus?

2. **Commands not working?** Try:
   - Running `flatpak run net.mkiol.SpeechNote --app-standalone --action start-listening-clipboard` in terminal

3. **Text appears in wrong place?** Make sure:
   - Your cursor is positioned correctly before speaking
   - The editor window has focus

## License

This extension is licensed under the MIT License. See the LICENSE.md file for details. 