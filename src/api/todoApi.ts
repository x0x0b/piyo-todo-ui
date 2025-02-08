import { Todo, Attachment } from '../types/todo';

// バックエンドAPIとの通信を担当するクラス
export class TodoApi {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  // Todo一覧の取得
  async fetchTodos(): Promise<Todo[]> {
    // TODO: 実際のAPIエンドポイントに置き換え
    return [];
  }

  // 新規Todo作成
  async createTodo(text: string): Promise<Todo> {
    // TODO: 実際のAPIエンドポイントに置き換え
    return {
      id: Date.now(),
      text,
      completed: false,
      attachments: []
    };
  }

  // Todo更新
  async updateTodo(id: number, updates: Partial<Todo>): Promise<Todo> {
    // TODO: 実際のAPIエンドポイントに置き換え
    return { id, ...updates } as Todo;
  }

  // Todo削除
  async deleteTodo(id: number): Promise<void> {
    // TODO: 実際のAPIエンドポイントに置き換え
  }

  // 添付ファイル追加
  async addAttachment(todoId: number, attachment: Attachment): Promise<Todo> {
    // TODO: 実際のAPIエンドポイントに置き換え
    return {} as Todo;
  }

  // 添付ファイル削除
  async removeAttachment(todoId: number, attachmentUrl: string): Promise<Todo> {
    // TODO: 実際のAPIエンドポイントに置き換え
    return {} as Todo;
  }
}