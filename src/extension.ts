import * as vscode from 'vscode';
import { getConfig } from './config';
import { SpeechNoteService } from './speechNoteService';
import { TextInjector } from './textInjector';

// These will hold our service instances
let speechNoteService: SpeechNoteService | null = null;
let textInjector: TextInjector | null = null;

// Global version information
const VERSION = '0.1.0';

export function activate(context: vscode.ExtensionContext) {
  console.log(`🎤 Speech Note extension activating v${VERSION}`);
  
  try {
    // Get configuration
    const config = getConfig();

    // Initialize services
    speechNoteService = new SpeechNoteService(config);
    textInjector = new TextInjector(config);

    // Start the clipboard watcher
    textInjector.startWatching();

    // Create status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(unmute) Speech Note";
    statusBarItem.tooltip = "Click to start/stop speech recognition";
    statusBarItem.command = "speech-note.toggleListening";
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Register the command to start listening
    const startListeningCmd = vscode.commands.registerCommand('speech-note.startListening', () => {
      if (speechNoteService) {
        speechNoteService.startListening();
        updateStatusBar(statusBarItem);
      }
    });

    // Register the command to stop listening
    const stopListeningCmd = vscode.commands.registerCommand('speech-note.stopListening', () => {
      if (speechNoteService) {
        speechNoteService.stopListening();
        updateStatusBar(statusBarItem);
      }
    });

    // Register toggle command
    const toggleListeningCmd = vscode.commands.registerCommand('speech-note.toggleListening', () => {
      if (speechNoteService) {
        if (speechNoteService.isCurrentlyListening()) {
          speechNoteService.stopListening();
        } else {
          speechNoteService.startListening();
        }
        updateStatusBar(statusBarItem);
      }
    });

    // Initial status bar update
    updateStatusBar(statusBarItem);

    // Add our commands to the context subscriptions
    context.subscriptions.push(startListeningCmd);
    context.subscriptions.push(stopListeningCmd);
    context.subscriptions.push(toggleListeningCmd);

    // Add our services to be properly disposed when extension is deactivated
    context.subscriptions.push({
      dispose: () => {
        if (speechNoteService) {
          speechNoteService.dispose();
          speechNoteService = null;
        }
        if (textInjector) {
          textInjector.dispose();
          textInjector = null;
        }
      }
    });

    // Show successful activation notification
    vscode.window.showInformationMessage('Speech Note extension is ready (v' + VERSION + ')');
    console.log('🎤 Speech Note extension activated successfully');
  } catch (error) {
    console.error('🎤 Speech Note extension activation failed:', error);
    vscode.window.showErrorMessage(`Speech Note extension failed to activate: ${error}`);
  }
}

function updateStatusBar(statusBarItem: vscode.StatusBarItem): void {
  if (speechNoteService?.isCurrentlyListening()) {
    statusBarItem.text = "$(mute) Speech Note (active)";
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
  } else {
    statusBarItem.text = "$(unmute) Speech Note";
    statusBarItem.backgroundColor = undefined;
  }
}

export function deactivate() {
  console.log('🎤 Speech Note extension deactivated');
} 