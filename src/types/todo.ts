export interface Attachment {
  type: 'URL' | 'S3';
  url: string;
  name: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}