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
    updateTodo,
    addAttachment,
    removeAttachment
  } = useTodos();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [attachmentInput, setAttachmentInput] = useState('');
  const [showAttachmentInput, setShowAttachmentInput] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      await addTodo(title.trim(), description.trim());
      setTitle('');
      setDescription('');
    }
  };

  const handleEdit = async (id: number) => {
    if (editTitle.trim()) {
      await updateTodo(id, {
        title: editTitle.trim(),
        description: editDescription.trim()
      });
      setEditingId(null);
      setEditTitle('');
      setEditDescription('');
    }
  };

  const handleAddAttachment = async (todoId: number) => {
    if (attachmentInput.trim()) {
      const attachment: Attachment = {
        type: attachmentInput.startsWith('s3://') ? 'S3' : 'URL',
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

          <form onSubmit={handleSubmit} className="mb-6 space-y-4">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="タイトルを入力..."
                className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="説明を入力..."
                className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div className="flex justify-end">
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
                      <div className="ml-3 flex-1 space-y-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-2 py-1 border border-yellow-300 rounded"
                          autoFocus
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-2 py-1 border border-yellow-300 rounded"
                          rows={2}
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(todo.id)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                          >
                            保存
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="ml-3 flex-1">
                        <h3 className={`font-medium ${
                          todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                        }`}>
                          {todo.title}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          todo.completed ? 'text-gray-400 line-through' : 'text-gray-600'
                        }`}>
                          {todo.description}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(todo.id);
                        setEditTitle(todo.title);
                        setEditDescription(todo.description);
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
                      placeholder="URLまたはS3パスを入力..."
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
                        {attachment.type === 'URL' ? (
                          <Link className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Paperclip className="w-4 h-4 text-gray-500" />
                        )}
                        <a
                          href={attachment.url}
                          download={attachment.name}
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

                <div className="mt-2 text-xs text-gray-500">
                  作成: {new Date(todo.createdAt).toLocaleString()}
                  {todo.updatedAt !== todo.createdAt && (
                    <> | 更新: {new Date(todo.updatedAt).toLocaleString()}</>
                  )}
                </div>
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
