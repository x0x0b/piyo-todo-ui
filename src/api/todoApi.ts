import { Todo, Attachment } from "../types/todo";

// バックエンドAPIとの通信を担当するクラス
export class TodoApi {
  private baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  // Todo一覧の取得
  async fetchTodos(): Promise<Todo[]> {
    return this.request<Todo[]>("/todo/getList");
  }

  // 新規Todo作成
  async createTodo(title: string, description: string): Promise<void> {
    await this.request<void>("/todo/add", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    });
    this.fetchTodos(); // 一覧を再取得
  }

  // Todo更新
  async updateTodo(id: number, updates: Partial<Todo>): Promise<void> {
    await this.request<void>(`/todo/set/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    this.fetchTodos(); // 一覧を再取得
  }

  // 添付ファイル追加
  async addAttachment(todoId: number, attachment: Attachment): Promise<void> {
    await this.request<void>(`/todo/${todoId}/attachments/s3`, {
      method: "POST",
      body: JSON.stringify(attachment),
    });
    this.fetchTodos(); // 一覧を再取得
  }
}
