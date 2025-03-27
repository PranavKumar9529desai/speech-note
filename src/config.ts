import * as vscode from 'vscode';

export interface SpeechNoteConfig {
  executablePath: string;
  clipboardPollingInterval: number;
}

export function getConfig(): SpeechNoteConfig {
  const config = vscode.workspace.getConfiguration('speechNote');
  
  return {
    executablePath: config.get<string>('executablePath') || 'flatpak run net.mkiol.SpeechNote',
    clipboardPollingInterval: config.get<number>('clipboardPollingInterval') || 500
  };
} 