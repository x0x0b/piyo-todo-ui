// Todo関連の型定義
export interface Attachment {
  type: 'link' | 'file';
  url: string;
  name: string;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  attachments: Attachment[];
  // バックエンド連携時に必要になる可能性のあるフィールド
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}