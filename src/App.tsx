import React, { useState } from 'react';
import { PlusCircle, CheckCircle, XCircle, Trash2, Egg, Pencil, Link, X, Paperclip } from 'lucide-react';
import { useTodos } from './hooks/useTodos';
import type { Attachment } from './types/todo';

function App() {
  const {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodoText,
    addAttachment,
    removeAttachment
  } = useTodos();

  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [attachmentInput, setAttachmentInput] = useState('');
  const [showAttachmentInput, setShowAttachmentInput] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await addTodo(input.trim());
      setInput('');
    }
  };

  const handleEdit = async (id: number) => {
    if (editText.trim()) {
      await updateTodoText(id, editText.trim());
      setEditingId(null);
      setEditText('');
    }
  };

  const handleAddAttachment = async (todoId: number) => {
    if (attachmentInput.trim()) {
      const attachment: Attachment = {
        type: attachmentInput.startsWith('http') ? 'link' : 'file',
        url: attachmentInput,
        name: attachmentInput.split('/').pop() || attachmentInput
      };
      await addAttachment(todoId, attachment);
      setAttachmentInput('');
      setShowAttachmentInput(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
        <div className="text-yellow-800">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-yellow-800 mb-8 flex items-center justify-center">
            <Egg className="w-8 h-8 text-yellow-500 mr-2" />
            ひよこTodo
          </h1>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="新しいタスクを追加..."
                className="flex-1 px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center"
              >
                <PlusCircle className="w-5 h-5 mr-1" />
                追加
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {todos.map(todo => (
              <div
                key={todo.id}
                className={`flex flex-col p-4 rounded-lg ${
                  todo.completed ? 'bg-yellow-50' : 'bg-white'
                } border border-yellow-200 hover:shadow-md transition-shadow duration-200`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="focus:outline-none"
                    >
                      {todo.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={() => handleEdit(todo.id)}
                        onKeyPress={(e) => e.key === 'Enter' && handleEdit(todo.id)}
                        className="ml-3 flex-1 px-2 py-1 border border-yellow-300 rounded"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={`ml-3 ${
                          todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(todo.id);
                        setEditText(todo.text);
                      }}
                      className="text-yellow-600 hover:text-yellow-700 focus:outline-none"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowAttachmentInput(todo.id)}
                      className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {showAttachmentInput === todo.id && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={attachmentInput}
                      onChange={(e) => setAttachmentInput(e.target.value)}
                      placeholder="URLまたはファイルパスを入力..."
                      className="flex-1 px-2 py-1 border border-yellow-300 rounded"
                    />
                    <button
                      onClick={() => handleAddAttachment(todo.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      追加
                    </button>
                  </div>
                )}

                {todo.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {todo.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {attachment.type === 'link' ? (
                          <Link className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Paperclip className="w-4 h-4 text-gray-500" />
                        )}
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {attachment.name}
                        </a>
                        <button
                          onClick={() => removeAttachment(todo.id, attachment.url)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {todos.length === 0 && (
            <div className="text-center text-yellow-700 mt-8">
              タスクがまだありません。上から追加してください！
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;