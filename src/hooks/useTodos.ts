import { useState, useCallback, useEffect } from 'react';
import { Todo, Attachment } from '../types/todo';
import { TodoApi } from '../api/todoApi';

// Todoの状態管理とAPIとの通信を担当するカスタムフック
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // APIクライアントのインスタンス
  const api = new TodoApi();

  // 初期データの読み込み
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        const data = await api.fetchTodos();
        setTodos(data);
      } catch (err) {
        setError('Todoの読み込みに失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  // Todo追加
  const addTodo = useCallback(async (title: string, description: string) => {
    try {
      const updatedTodos = await api.createTodo(title, description);
      setTodos(updatedTodos);
    } catch (err) {
      setError('Todoの追加に失敗しました');
      console.error(err);
    }
  }, []);

  // Todo完了状態の切り替え
  const toggleTodo = useCallback(async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updatedTodos = await api.updateTodo(id, {
        completed: !todo.completed
      });
      setTodos(updatedTodos);
    } catch (err) {
      setError('Todoの更新に失敗しました');
      console.error(err);
    }
  }, [todos]);

  // Todo削除
  const deleteTodo = useCallback(async (id: number) => {
    try {
      // 削除機能は現在無効化されています
      console.warn('Delete functionality is currently disabled');
    } catch (err) {
      setError('Todoの削除に失敗しました');
      console.error(err);
    }
  }, []);

  // Todo更新
  const updateTodo = useCallback(async (id: number, updates: Partial<Todo>) => {
    try {
      const updatedTodos = await api.updateTodo(id, updates);
      setTodos(updatedTodos);
    } catch (err) {
      setError('Todoの更新に失敗しました');
      console.error(err);
    }
  }, []);

  // 添付ファイル追加
  const addAttachment = useCallback(async (todoId: number, attachment: Attachment) => {
    try {
      const updatedTodos = await api.addAttachment(todoId, attachment);
      setTodos(updatedTodos);
    } catch (err) {
      setError('添付ファイルの追加に失敗しました');
      console.error(err);
    }
  }, []);

  // 添付ファイル削除
  const removeAttachment = useCallback(async (todoId: number, attachmentUrl: string) => {
    try {
      // 添付ファイル削除機能は現在無効化されています
      console.warn('Remove attachment functionality is currently disabled');
    } catch (err) {
      setError('添付ファイルの削除に失敗しました');
      console.error(err);
    }
  }, []);

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    addAttachment,
    removeAttachment
  };
}