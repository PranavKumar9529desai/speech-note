import * as clipboardy from "clipboardy";
import * as vscode from "vscode";
import type { SpeechNoteConfig } from "./config";

export class TextInjector {
  private config: SpeechNoteConfig;
  private pollingInterval: NodeJS.Timeout | null = null;
  private lastContent = "";

  constructor(config: SpeechNoteConfig) {
    this.config = config;
  }

  public startWatching(): void {
    if (this.pollingInterval) {
      return;
    }

    try {
      // Start polling the clipboard
      this.pollingInterval = setInterval(async () => {
        try {
          // Read from clipboard using clipboardy v2
          const clipboardText = clipboardy.readSync();
          
          // Only process if there's new content
          if (clipboardText && clipboardText !== this.lastContent) {
            const result = await this.injectTextAtCursor(clipboardText);
            
            // Save this content to avoid duplicate injections
            this.lastContent = clipboardText;
          }
        } catch (error) {
          console.error(`Error reading clipboard: ${error}`);
        }
      }, this.config.clipboardPollingInterval);
    } catch (error) {
      console.error(`Error setting up clipboard polling: ${error}`);
      vscode.window.showErrorMessage(`Failed to set up clipboard polling: ${error}`);
    }
  }

  public stopWatching(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  private async injectTextAtCursor(text: string): Promise<boolean> {
    // Get the active text editor
    const editor = vscode.window.activeTextEditor;
    
    if (editor) {
      // If we have an active text editor, use it to insert text
      try {
        // Insert text at cursor position
        await editor.edit((editBuilder) => {
          // Get all selections (usually just one)
          for (const selection of editor.selections) {
            // If there's a selection, replace it; otherwise insert at cursor
            if (!selection.isEmpty) {
              editBuilder.replace(selection, text);
            } else {
              editBuilder.insert(selection.active, text);
            }
          }
        });
        return true;
      } catch (error) {
        console.error(`Failed to inject text in editor: ${error}`);
        vscode.window.showErrorMessage(`Failed to inject text: ${error}`);
        return false;
      }
    } else {
      // If no active text editor, we might be in Cursor's chat or composer panel
      // Use keyboard simulation to paste the text
      try {
        // First, set the clipboard content to our text
        await clipboardy.write(text);
        
        // Execute paste command - this should work in Cursor's chat/composer panels
        await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
        return true;
      } catch (error) {
        console.error(`Failed to inject text via paste: ${error}`);
        vscode.window.showErrorMessage(`Failed to inject text: ${error}`);
        return false;
      }
    }
  }

  public dispose(): void {
    this.stopWatching();
  }
}
