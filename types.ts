export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface UserStatus {
  cp: number;
  level: number;
  abilities: string[];
  statusText: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  userStatus: UserStatus;
}