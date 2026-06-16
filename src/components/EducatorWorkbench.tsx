import React, { useState } from "react";
import { 
  Settings, Edit, BookOpen, Sparkles, Map, Save, Undo, Check, Layers, Lightbulb, GraduationCap 
} from "lucide-react";
import { QuizQuestion } from "../types";

interface EducatorWorkbenchProps {
  questions: QuizQuestion[];
  onUpdateQuestion: (updatedQuestion: QuizQuestion) => void;
  onResetQuestions: () => void;
}

export default function EducatorWorkbench({ 
  questions, 
  onUpdateQuestion, 
  onResetQuestions 
}: EducatorWorkbenchProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(questions[0].id);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion>({ ...questions[0] });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Sync state if selected question modifications change
  const handleSelectQuestion = (id: number) => {
    setSelectedQuestionId(id);
    const target = questions.find(q => q.id === id);
    if (target) {
      setEditingQuestion({ ...target });
      setSaveSuccess(false);
    }
  };

  const handleInputChange = (field: keyof QuizQuestion, value: any) => {
    setEditingQuestion({
      ...editingQuestion,
      [field]: value
    });
    setSaveSuccess(false);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...editingQuestion.options];
    updatedOptions[index] = value;
    setEditingQuestion({
      ...editingQuestion,
      options: updatedOptions
    });
    setSaveSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateQuestion(editingQuestion);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const currentActiveData = questions.find(q => q.id === selectedQuestionId) || questions[0];

  return (
    <div className="space-y-6">
      
      {/* SECTION 1: INTERACTIVE CONTENT EDITOR */}
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <Edit className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-sans font-semibold text-slate-100 text-sm">Interactive Quiz Customizer</h3>
              <p className="text-[11px] text-slate-400">Modify the kiosk scripts. Changes affect simulator & C# classes instantly!</p>
            </div>
          </div>
          
          <button
            id="btn_reset_educator"
            onClick={() => {
              onResetQuestions();
              // Reset current form to matches
              const initial = questions[0];
              setSelectedQuestionId(initial.id);
              setEditingQuestion({ ...initial });
              setSaveSuccess(false);
            }}
            className="text-[10px] bg-slate-900 hover:bg-slate-850 px-2.5 py-1 rounded text-slate-350 border border-slate-800 hover:text-white cursor-pointer transition-colors"
          >
            Reset Curated Data
          </button>
        </div>

        <div className="p-6">
          {/* Question selector badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {questions.map((q) => (
              <button
                id={`btn_badge_q_${q.id}`}
                key={q.id}
                onClick={() => handleSelectQuestion(q.id)}
                className={`py-1.5 px-3 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                  selectedQuestionId === q.id
                    ? "bg-indigo-650 text-slate-100 border border-indigo-500 shadow-md shadow-indigo-950"
                    : "bg-slate-950/80 text-slate-400 border border-slate-850 hover:bg-slate-900 hover:text-slate-300"
                }`}
              >
                Question {q.id} ({q.category})
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Category and Question Text */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Kiosk Category Tag
                </label>
                <select
                  id="select_category"
                  value={editingQuestion.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-550"
                >
                  <option value="Security">Security edges</option>
                  <option value="Commodity">Commodity Money</option>
                  <option value="Paper Money">Representative Note</option>
                  <option value="Inflation">Inflation Curve</option>
                  <option value="Exchange Rates">Exchange Rates</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Question Text (Accessible standard)
                </label>
                <input
                  id="input_question"
                  type="text"
                  value={editingQuestion.question}
                  onChange={(e) => handleInputChange("question", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-indigo-550"
                  required
                />
              </div>
            </div>

            {/* Options container */}
            <div className="space-y-2 border-t border-slate-850 pt-4">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                Multiple-Choice Options (Exactly 4) & Define Winner
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {editingQuestion.options.map((opt, val_idx) => (
                  <div key={val_idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono">Option {val_idx + 1}</span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-400 select-none">
                        <input
                          id={`radio_correct_idx_${val_idx}`}
                          type="radio"
                          name="correct_choice_radio"
                          checked={editingQuestion.correctAnswerIndex === val_idx}
                          onChange={() => handleInputChange("correctAnswerIndex", val_idx)}
                          className="rounded text-indigo-600 focus:ring-0 cursor-pointer h-3 w-3"
                        />
                        <span>Correct Solution</span>
                      </label>
                    </div>
                    <input
                      id={`input_option_${val_idx}`}
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(val_idx, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Child and Adult splits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-850 pt-4">
              <div>
                <label className="flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  <Sparkles className="h-3 w-3 text-indigo-400" />
                  Primary School Tip / Hint
                </label>
                <textarea
                  id="textarea_child"
                  value={editingQuestion.childHint}
                  onChange={(e) => handleInputChange("childHint", e.target.value)}
                  className="w-full h-20 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed"
                  placeholder="Draft visual cues for younger audiences..."
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  <GraduationCap className="h-3.5 w-3.5 text-amber-500" />
                  Adult Economic explanation Detail
                </label>
                <textarea
                  id="textarea_adult"
                  value={editingQuestion.adultDetail}
                  onChange={(e) => handleInputChange("adultDetail", e.target.value)}
                  className="w-full h-20 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed"
                  placeholder="Include historical terms or technical context..."
                  required
                />
              </div>
            </div>

            {/* Gallery Exhibit Coordinates */}
            <div className="border-t border-slate-850/80 pt-4">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                <Map className="h-3 w-3 text-indigo-400" />
                Linked Physical Gallery Display Pointer
              </label>
              <input
                id="input_suggestion"
                type="text"
                value={editingQuestion.galleryItemSuggestion}
                onChange={(e) => handleInputChange("galleryItemSuggestion", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-250 outline-none focus:border-indigo-500"
                placeholder="Example: Case No. 4, Early Commodity Money of the Americas"
                required
              />
            </div>

            {/* Save trigger */}
            <button
              id="btn_save_question"
              type="submit"
              className="w-full mt-4 bg-indigo-650 hover:bg-indigo-550 text-slate-100 font-semibold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98]"
            >
              {saveSuccess ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" /> Live Prototype Updated!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Apply Modifications to Kiosk
                </>
              )}
            </button>
            
          </form>
        </div>
      </div>

      {/* SECTION 2: PEDAGOGICAL EDUCATOR BLUEPRINTS */}
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-950 px-6 py-4 flex items-center gap-2 border-b border-slate-800">
          <BookOpen className="h-4 w-4 text-emerald-400" />
          <h3 className="font-sans font-semibold text-slate-100 text-sm">Museum Educator's Pedagogy Ledger</h3>
        </div>

        <div className="p-6 space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Curricular structure details */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                <Layers className="h-4 w-4 text-indigo-400" />
                <span className="font-sans text-xs font-bold text-slate-200">Curriculum Strategy Breakdown</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                A successful gallery touchscreen should satisfy the **Dual-Audience standard**. Since families visit museums together, screens must capture children with visual anchors while allowing parents to learn secondary layers of academic nuance.
              </p>
              <div className="space-y-2 pt-1 text-[11px]">
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-400 font-medium">Child Motivation:</span>
                  <span className="text-indigo-300 font-semibold">Animal mascots, tactile pizza slots, visual cues</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Adult Motivation:</span>
                  <span className="text-indigo-300 font-semibold">Etymological stems, official terms, print dates</span>
                </div>
              </div>
            </div>

            {/* Interactive display map rules */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span className="font-sans text-xs font-bold text-slate-200">Active Learning - Live Display Mapping</span>
              </div>
              <p className="text-[11px] text-slate-405 leading-relaxed">
                <strong>Pedagogical Goal:</strong> {currentActiveData.pedagogicalGoal}
              </p>
              
              <div className="bg-indigo-500/5 p-2 rounded-lg border border-indigo-500/10 text-[11px] text-slate-350">
                <span className="font-bold text-[10px] text-indigo-300 uppercase block font-mono">Curator Exhibit Match:</span>
                "{currentActiveData.galleryItemSuggestion}"
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
