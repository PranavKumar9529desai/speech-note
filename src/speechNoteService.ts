import { spawn } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import * as vscode from 'vscode';
import type { SpeechNoteConfig } from './config';

export class SpeechNoteService {
  private process: ChildProcess | null = null;
  private config: SpeechNoteConfig;
  private isListening = false;

  constructor(config: SpeechNoteConfig) {
    this.config = config;
  }

  public startListening(): boolean {
    if (this.isListening) {
      vscode.window.showInformationMessage('Speech Note is already listening');
      return false;
    }

    try {
      // Start Speech Note process with clipboard functionality
      const args = ['--app-standalone', '--action', 'start-listening-clipboard'];
      
      // Split command and args if the executablePath contains spaces
      const execParts = this.config.executablePath.split(' ');
      const command = execParts[0];
      const commandArgs = [...execParts.slice(1), ...args];
      
      this.process = spawn(command, commandArgs);

      this.isListening = true;
      vscode.window.showInformationMessage('Speech Note started listening');

      // Handle process exit
      this.process.on('exit', (code) => {
        this.isListening = false;
        if (code !== 0) {
          vscode.window.showErrorMessage(`Speech Note exited with code ${code}`);
        }
      });

      // Handle process errors
      this.process.on('error', (error) => {
        this.isListening = false;
        
        const errorMessage = `Failed to start Speech Note: ${error.message}\n
        Please make sure Speech Note is installed and correctly configured:\n
        1. Install Speech Note if you haven't already\n
        2. Make sure flatpak is installed and SpeechNote is available\n
        3. Try running 'flatpak run net.mkiol.SpeechNote --app-standalone --action start-listening-clipboard' in your terminal to test`;
        
        vscode.window.showErrorMessage(errorMessage, 'Open Settings').then(selection => {
          if (selection === 'Open Settings') {
            vscode.commands.executeCommand('workbench.action.openSettings', 'speechNote.executablePath');
          }
        });
      });

      return true;
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to start Speech Note: ${error}`);
      return false;
    }
  }

  public stopListening(): boolean {
    if (!this.isListening) {
      vscode.window.showInformationMessage('Speech Note is not currently listening');
      return false;
    }

    try {
      // Split command and args if the executablePath contains spaces
      const execParts = this.config.executablePath.split(' ');
      const command = execParts[0];
      const commandArgs = [...execParts.slice(1), '--app-standalone', '--action', 'stop-listening'];
      
      // Spawn a new process to stop listening
      const stopProcess = spawn(command, commandArgs);

      // Terminate the original process if it's still running
      if (this.process) {
        this.process.kill();
        this.process = null;
      }

      this.isListening = false;
      vscode.window.showInformationMessage('Speech Note stopped listening');
      
      return true;
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to stop Speech Note: ${error}`);
      return false;
    }
  }

  public dispose(): void {
    if (this.process) {
      this.stopListening();
      this.process = null;
    }
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }
} 