export interface BriefingMessage {
  role: 'assistant' | 'user';
  content: string;
}

export interface BriefingState {
  messages: BriefingMessage[];
  selectedOneThingId: string | null;
  isComplete: boolean;
}
