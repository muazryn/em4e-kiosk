import React, { useState } from "react";
import { Copy, Check, FileCode, Code, HelpCircle } from "lucide-react";
import { QuizQuestion } from "../types";

interface CodeExporterProps {
  questions: QuizQuestion[];
}

export default function CodeExporter({ questions }: CodeExporterProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"manager" | "model" | "json">("manager");

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const jsonCode = JSON.stringify(
    questions.map((q) => ({
      id: q.id,
      category: q.category,
      question: q.question,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      childHint: q.childHint,
      adultDetail: q.adultDetail
    })),
    null,
    2
  );

  const modelCode = `using System;
using UnityEngine;

[CreateAssetMenu(fileName = "NewQuestion", modelName = "Numismatics/Quiz Question")]
public class QuestionData : ScriptableObject
{
    [Header("Question Category")]
    public string category;

    [TextArea(3, 10)]
    public string questionText;

    [Header("Answers (Exactly 4 choices)")]
    public string[] options = new string[4];

    [Tooltip("Index of correct option (0 to 3)")]
    public int correctAnswerIndex;

    [Header("Museum Guided Audio / Hints")]
    [TextArea(2, 5)]
    public string childFriendlyHint;

    [TextArea(3, 8)]
    public string educationalAdultDetail;
}`;

  const managerCode = `using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

/// <summary>
/// KioskQuizManager handles the museum kiosk economics quiz inside Unity.
/// Connect this script to your canvas workspace and map your UI elements below.
/// </summary>
public class KioskQuizManager : MonoBehaviour
{
    [Header("Quiz Data Source")]
    [Tooltip("Assign your list of QuestionData ScriptableObjects here.")]
    public List<QuestionData> questionList;

    [Header("Welcome Screen Panels")]
    public GameObject welcomePanel;
    public GameObject quizPanel;
    public GameObject resultsPanel;

    [Header("Quiz UI Elements")]
    public TextMeshProUGUI categoryText;
    public TextMeshProUGUI questionLabel;
    public TextMeshProUGUI progressText;
    public Slider progressBar;

    [Header("Answer Option Buttons")]
    [Tooltip("Assign exactly 4 buttons for multiple choices.")]
    public Button[] optionButtons;
    public TextMeshProUGUI[] optionTexts;

    [Header("Interactive Feedback Panels")]
    public GameObject explanationModal;
    public TextMeshProUGUI explanationTitle;
    public TextMeshProUGUI explanationBodyText;
    public Button nextQuestionButton;

    [Header("Result UI Elements")]
    public TextMeshProUGUI finalScoreText;
    public TextMeshProUGUI rewardRankLabel;
    public Button restartButton;

    [Header("Audio Feedback Triggers")]
    public AudioSource audioSource;
    public AudioClip clickSound;
    public AudioClip correctChime;
    public AudioClip incorrectBuzzer;
    public AudioClip victoryFanfare;

    private int currentQuestionIndex = 0;
    private int score = 0;
    private bool hasAnsweredCurrent = false;

    void Start()
    {
        ShowWelcomeScreen();
        SetupButtonListeners();
    }

    public void ShowWelcomeScreen()
    {
        welcomePanel.SetActive(true);
        quizPanel.SetActive(false);
        resultsPanel.SetActive(false);
        explanationModal.SetActive(false);
    }

    public void StartQuiz()
    {
        PlaySound(clickSound);
        currentQuestionIndex = 0;
        score = 0;

        welcomePanel.SetActive(false);
        quizPanel.SetActive(true);
        resultsPanel.SetActive(false);

        LoadQuestion(currentQuestionIndex);
    }

    private void LoadQuestion(int index)
    {
        if (index >= questionList.Count)
        {
            ShowResults();
            return;
        }

        hasAnsweredCurrent = false;
        explanationModal.SetActive(false);
        nextQuestionButton.gameObject.SetActive(false);

        QuestionData currentData = questionList[index];

        categoryText.text = currentData.category.ToUpper();
        questionLabel.text = currentData.questionText;

        // Display progress
        progressText.text = $"Question {index + 1} of {questionList.Count}";
        progressBar.value = (float)(index + 1) / questionList.Count;

        // Render option buttons
        for (int i = 0; i < optionButtons.Length; i++)
        {
            if (i < currentData.options.Length)
            {
                optionTexts[i].text = currentData.options[i];
                optionButtons[i].gameObject.SetActive(true);
                
                // Reset button visual state
                optionButtons[i].image.color = Color.white;
                optionButtons[i].interactable = true;
            }
            else
            {
                optionButtons[i].gameObject.SetActive(false);
            }
        }
    }

    public void OnAnswerSelected(int selectedIndex)
    {
        if (hasAnsweredCurrent) return;
        hasAnsweredCurrent = true;

        QuestionData currentData = questionList[currentQuestionIndex];
        bool isCorrect = (selectedIndex == currentData.correctAnswerIndex);

        // Disable options to prevent multiple clicking
        for (int i = 0; i < optionButtons.Length; i++)
        {
            optionButtons[i].interactable = false;
            // Highlight the true answer in green, wrong answer in red
            if (i == currentData.correctAnswerIndex)
            {
                optionButtons[i].image.color = new Color(0.18f, 0.8f, 0.44f); // Green
            }
            else if (i == selectedIndex)
            {
                optionButtons[i].image.color = new Color(0.9f, 0.3f, 0.25f); // Red
            }
        }

        if (isCorrect)
        {
            score++;
            PlaySound(correctChime);
            explanationTitle.text = "🏆 CORRECT!";
            explanationTitle.color = new Color(0.18f, 0.8f, 0.44f);
        }
        else
        {
            PlaySound(incorrectBuzzer);
            explanationTitle.text = "💡 ALMOST THERE!";
            explanationTitle.color = new Color(0.95f, 0.6f, 0.1f);
        }

        // Display pedagogical details (geared for both youngsters and adults)
        explanationBodyText.text = $"<b>Fun Fact (Adult Detail):</b>\\n{currentData.educationalAdultDetail}\\n\\n<i>💡 Child-friendly Tip:</i> {currentData.childFriendlyHint}";
        
        explanationModal.SetActive(true);
        nextQuestionButton.gameObject.SetActive(true);
    }

    public void OnNextBtnClicked()
    {
        PlaySound(clickSound);
        currentQuestionIndex++;
        LoadQuestion(currentQuestionIndex);
    }

    private void ShowResults()
    {
        PlaySound(victoryFanfare);
        quizPanel.SetActive(false);
        resultsPanel.SetActive(true);

        finalScoreText.text = $"{score} / {questionList.Count} Correct!";

        // Rank determination perfect for museum engagement rewards
        if (score == questionList.Count)
        {
            rewardRankLabel.text = "🥇 MASTER COIN MINT MASTER";
        }
        else if (score >= 3)
        {
            rewardRankLabel.text = "🥈 ECONOMY APPRENTICE";
        }
        else
        {
            rewardRankLabel.text = "🥉 CURIOUS HISTORIAN";
        }
    }

    private void SetupButtonListeners()
    {
        // Add hook actions for buttons dynamically if required in inspector
        for (int i = 0; i < optionButtons.Length; i++)
        {
            int index = i; // Cache callback index
            optionButtons[i].onClick.RemoveAllListeners();
            optionButtons[i].onClick.AddListener(() => OnAnswerSelected(index));
        }

        nextQuestionButton.onClick.RemoveAllListeners();
        nextQuestionButton.onClick.AddListener(OnNextBtnClicked);

        restartButton.onClick.RemoveAllListeners();
        restartButton.onClick.AddListener(StartQuiz);
    }

    private void PlaySound(AudioClip clip)
    {
        if (audioSource != null && clip != null)
        {
            audioSource.PlayOneShot(clip);
        }
    }
}`;

  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl">
      {/* File Exporter Header */}
      <div className="bg-slate-950 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/15 text-indigo-400 rounded-lg">
            <Code className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-sans font-semibold text-slate-100 flex items-center gap-2">
              Unity Direct C# Exporter
            </h3>
            <p className="text-xs text-slate-400">
              Drop these fully documented files into your target Unity Kiosk scene!
            </p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-center">
          <button
            onClick={() => setActiveTab("manager")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
              activeTab === "manager"
                ? "bg-indigo-600 text-slate-105"
                : "text-slate-400 hover:text-slate-100"
            }`}
          >
            KioskQuizManager.cs
          </button>
          <button
            onClick={() => setActiveTab("model")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
              activeTab === "model"
                ? "bg-indigo-600 text-slate-105"
                : "text-slate-400 hover:text-slate-100"
            }`}
          >
            QuestionData.cs
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
              activeTab === "json"
                ? "bg-indigo-600 text-slate-105"
                : "text-slate-400 hover:text-slate-100"
            }`}
          >
            QuizData.json
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="relative">
          {/* Active Tab Panel */}
          {activeTab === "manager" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-950 px-4 py-2 rounded-t-lg border-t border-x border-slate-800">
                <span className="text-xs text-slate-400 font-mono">Assets / Scripts / KioskQuizManager.cs</span>
                <button
                  id="btn_copy_manager"
                  onClick={() => copyToClipboard(managerCode, 1)}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer bg-slate-900 py-1 px-2.5 rounded border border-slate-850"
                >
                  {copiedIndex === 1 ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96 rounded-b-lg border-b border-x border-slate-800 select-all scrollbar-thin scrollbar-thumb-slate-800">
                <code>{managerCode}</code>
              </pre>
            </div>
          )}

          {activeTab === "model" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-950 px-4 py-2 rounded-t-lg border-t border-x border-slate-800">
                <span className="text-xs text-slate-400 font-mono">Assets / Scripts / QuestionData.cs</span>
                <button
                  id="btn_copy_model"
                  onClick={() => copyToClipboard(modelCode, 2)}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer bg-slate-900 py-1 px-2.5 rounded border border-slate-850"
                >
                  {copiedIndex === 2 ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 text-purple-400 font-mono text-xs overflow-x-auto max-h-96 rounded-b-lg border-b border-x border-slate-800 select-all scrollbar-thin scrollbar-thumb-slate-800">
                <code>{modelCode}</code>
              </pre>
            </div>
          )}

          {activeTab === "json" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-950 px-4 py-2 rounded-t-lg border-t border-x border-slate-800">
                <span className="text-xs text-slate-400 font-mono">StreamingAssets / QuizData.json</span>
                <button
                  id="btn_copy_json"
                  onClick={() => copyToClipboard(jsonCode, 3)}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer bg-slate-900 py-1 px-2.5 rounded border border-slate-850"
                >
                  {copiedIndex === 3 ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy JSON
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 text-cyan-400 font-mono text-xs overflow-x-auto max-h-96 rounded-b-lg border-b border-x border-slate-800 select-all scrollbar-thin scrollbar-thumb-slate-800">
                <code>{jsonCode}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Integration tips */}
        <div className="mt-5 p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex gap-3 text-sm">
          <HelpCircle className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-sans font-medium text-slate-200 text-xs">Unity Touchscreen Optimization Tips:</h4>
            <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1.5 mt-2 leading-relaxed">
              <li>
                <strong className="text-slate-300">Scale factor setup:</strong> In Unity, configure your Canvas Scaler Component to <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-350 font-mono text-[10px]">Scale With Screen Size</code> (Reference Resolution: 1920x1080) for fluid fullscreen scaling.
              </li>
              <li>
                <strong className="text-slate-300">Disable focus highlights:</strong> Set Button navigation to <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-350 font-mono text-[10px]">None</code> to prevent selected borders from sticking permanently on touchscreen fingers.
              </li>
              <li>
                <strong className="text-slate-300">TextMeshPro markup:</strong> The custom manager binds HTML-style bold and italic markers (<code className="font-mono text-[10px] text-slate-300">&lt;b&gt;</code> & <code className="font-mono text-[10px] text-slate-300">&lt;i&gt;</code>) directly supported inside TMPro to format children and adult instructions.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
