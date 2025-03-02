// DOM Elements
const notesArea = document.getElementById('notes-area');
const saveBtn = document.getElementById('save-btn');
const downloadBtn = document.getElementById('download-btn');
const improveBtn = document.getElementById('improve-btn');
const resetBtn = document.getElementById('reset-btn');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const statusEl = document.getElementById('status');
const loadingOverlay = document.getElementById('loading-overlay');

// Constants
const STORAGE_KEY = 'smartNotes';
// Ensure this endpoint points to your backend server
const AI_ENDPOINT = 'http://localhost:3000/ai-improve';

// Global variable to store the original text before improvement
let originalText = '';

document.addEventListener('DOMContentLoaded', loadNotes);

// Event Listeners
saveBtn.addEventListener('click', saveNotes);
downloadBtn.addEventListener('click', downloadNotes);
improveBtn.addEventListener('click', improveNotes);
resetBtn.addEventListener('click', resetNotes);
clearBtn.addEventListener('click', clearNotes);
copyBtn.addEventListener('click', copyNotes);

/**
 * Load notes from Chrome storage
 */
function loadNotes() {
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    if (result[STORAGE_KEY]) {
      notesArea.value = result[STORAGE_KEY];
      // Also store it as originalText if not set yet
      if (!originalText) {
        originalText = result[STORAGE_KEY];
      }
    }
  });
}

/**
 * Save notes to Chrome storage
 */
function saveNotes() {
  const notes = notesArea.value;
  chrome.storage.local.set({ [STORAGE_KEY]: notes }, () => {
    showStatus('Notes saved successfully!', 'success');
  });
}

/**
 * Download notes as a text file
 */
function downloadNotes() {
  const notes = notesArea.value;
  if (!notes.trim()) {
    showStatus('Nothing to download!', 'error');
    return;
  }
  const blob = new Blob([notes], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `smart-notes-${timestamp}.txt`;
  a.click();
  
  URL.revokeObjectURL(url);
  showStatus('Notes downloaded!', 'success');
}

/**
 * Improve notes using Gemini API via backend.
 * Before improvement, store the current text as originalText.
 */
async function improveNotes() {
  const notes = notesArea.value;
  if (!notes.trim()) {
    showStatus('Please enter some notes to improve!', 'error');
    return;
  }
  
  // Always update originalText with the current text before sending it for improvement.
  originalText = notes;
  
  loadingOverlay.classList.remove('hidden');

  try {
    const prompt = 'Improve these study notes by expanding bullet points into detailed, clear sentences, organizing them into logical sections, and adding any missing context:';
    
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: prompt, notes: notes })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error calling AI API');
    }

    const data = await response.json();
    // Replace the text area content with improved notes (do not auto-save)
    notesArea.value = data.improvedNotes;
    showStatus('Notes improved successfully!', 'success');
  } catch (error) {
    console.error('Error improving notes:', error);
    showStatus(error.message, 'error');
  } finally {
    loadingOverlay.classList.add('hidden');
  }
}

/**
 * Reset the notes to the original text (before AI improvement)
 */
function resetNotes() {
  if (originalText) {
    notesArea.value = originalText;
    showStatus('Notes reset to original.', 'success');
  } else {
    showStatus('No original notes available to reset.', 'error');
  }
}

/**
 * Clear the text area and original text
 */
function clearNotes() {
  notesArea.value = '';
  originalText = ''; // Clear stored original text
  showStatus('Notes cleared.', 'success');
}

/**
 * Copy the current notes to clipboard
 */
function copyNotes() {
  const notes = notesArea.value;
  navigator.clipboard.writeText(notes).then(() => {
    showStatus('Notes copied to clipboard!', 'success');
  }).catch((error) => {
    console.error('Copy failed:', error);
    showStatus('Failed to copy notes.', 'error');
  });
}

/**
 * Display a status message
 * @param {string} message - The message to display
 * @param {string} type - The type ('success' or 'error')
 */
function showStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = 'status show ' + type;
  setTimeout(() => {
    statusEl.className = 'status';
  }, 3000);
}
