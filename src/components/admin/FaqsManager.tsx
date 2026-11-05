'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, HelpCircle, X, Check } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
}

interface FaqsManagerProps {
  initialFaqs: FAQ[];
}

export default function FaqsManager({ initialFaqs }: FaqsManagerProps) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form Fields
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formPublished, setFormPublished] = useState(true);
  const [loading, setLoading] = useState(false);

  const categories = ['General', 'Booking', 'Payments', 'Outstation', 'Tour Package'];

  const resetForm = () => {
    setFormQuestion('');
    setFormAnswer('');
    setFormCategory('General');
    setFormPublished(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (f: FAQ) => {
    setEditingFaq(f);
    setFormQuestion(f.question);
    setFormAnswer(f.answer);
    setFormCategory(f.category);
    setFormPublished(f.isPublished);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion || !formAnswer) return;
    setLoading(true);

    try {
      const response = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: formQuestion,
          answer: formAnswer,
          category: formCategory,
          isPublished: formPublished,
        }),
      });

      if (!response.ok) throw new Error('Failed to create FAQ');

      const data = await response.json();
      setFaqs(prev => [data.faq, ...prev]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      alert('Error creating FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/faqs/${editingFaq.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: formQuestion,
          answer: formAnswer,
          category: formCategory,
          isPublished: formPublished,
        }),
      });

      if (!response.ok) throw new Error('Failed to edit FAQ');

      const data = await response.json();
      setFaqs(prev => prev.map(item => item.id === editingFaq.id ? data.faq : item));
      setEditingFaq(null);
    } catch (err) {
      alert('Error saving FAQ edits');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (faqId: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const response = await fetch(`/api/admin/faqs/${faqId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFaqs(prev => prev.filter(item => item.id !== faqId));
      }
    } catch (err) {
      alert('Error deleting FAQ');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action bar */}
      <div className="flex justify-end bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
        <button
          onClick={openAddModal}
          className="bg-secondary hover:bg-secondary-light text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* FAQs List categorized */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const catFaqs = faqs.filter(f => f.category === cat);
          if (catFaqs.length === 0) return null;
          return (
            <div key={cat} className="space-y-3">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider pl-1">{cat} Questions</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {catFaqs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-150 flex justify-between items-start gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${faq.isPublished ? 'bg-green-400' : 'bg-gray-300'}`} title={faq.isPublished ? 'Published' : 'Hidden'}></span>
                        <h4 className="text-sm font-bold text-primary font-display">Q: {faq.question}</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 pl-4 border-l-2 border-secondary leading-relaxed font-light">
                        {faq.answer}
                      </p>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => openEditModal(faq)}
                        className="p-1 text-slate-500 hover:text-primary hover:bg-slate-100 rounded"
                        title="Edit FAQ"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Delete FAQ"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Form Modal */}
      {(showAddModal || editingFaq) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md border border-gray-150 overflow-hidden shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="bg-primary text-white p-5 flex justify-between items-center">
              <h3 className="text-base font-bold font-display">
                {showAddModal ? 'Add FAQ' : 'Edit FAQ'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingFaq(null);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Question *</label>
                <input
                  type="text"
                  placeholder="e.g. Is driver allowance extra?"
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Answer *</label>
                <textarea
                  rows={4}
                  placeholder="Provide a clear, brief response..."
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-charcoal mb-2">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-charcoal mb-2">Publish Status</label>
                  <select
                    value={formPublished ? 'Yes' : 'No'}
                    onChange={(e) => setFormPublished(e.target.value === 'Yes')}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none"
                  >
                    <option value="Yes">Published / Active</option>
                    <option value="No">Draft / Hidden</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="border-t border-gray-100 pt-5 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingFaq(null);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-charcoal font-bold py-2 px-4 rounded-lg text-xs cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-secondary hover:bg-secondary-light text-white font-bold py-2 px-5 rounded-lg text-xs shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
              
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
