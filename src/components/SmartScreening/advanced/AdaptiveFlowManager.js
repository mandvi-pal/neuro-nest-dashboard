// src/components/SmartScreening/AdaptiveFlowManager.js

// ✅ Fixed sequential flow of modules
export const baseFlow = ['emotion', 'story', 'sound', 'sensor', 'voice', 'quiz'];

/**
 * Decide next module based on completed ones
 * @param {Object} scores - current scores object
 * @param {Array} completed - list of completed modules
 * @returns {String|null} next module key or null if all done
 */
export const nextModule = (scores, completed) => {
  // Filter out completed modules
  const remaining = baseFlow.filter(m => !completed.includes(m));

  // ✅ Always return the next module in sequence
  return remaining.length > 0 ? remaining[0] : null;
};

/**
 * Difficulty logic consistent with 0–5 scoring scale
 * @param {String} moduleKey - current module
 * @param {Object} scores - scores object
 * @returns {String} difficulty level
 */
export const difficultyFor = (moduleKey, scores) => {
  const s = scores?.[moduleKey];
  if (s == null) return 'normal';

  // ✅ Easy if score is 0–2, Normal if 3, Hard if 4–5
  if (s <= 2) return 'easy';
  if (s >= 4) return 'hard';
  return 'normal';
};
