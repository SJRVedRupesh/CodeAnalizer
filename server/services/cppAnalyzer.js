/**
 * C++ DSA Code Analyzer Service
 * Performs deep lexical, structural, algorithmic pattern analysis,
 * calculates Big-O Time/Space Complexity, and generates beginner-friendly explanations.
 */

// Helper to strip comments and strings for structural parsing
function cleanCode(code) {
  let cleaned = code.replace(/\/\*[\s\S]*?\*\//g, '');
  cleaned = cleaned.replace(/\/\/.*$/gm, '');
  return cleaned;
}

export function analyzeCpp(code) {
  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    throw new Error('Please provide valid C++ code to analyze.');
  }

  const rawCode = code;
  const cleaned = cleanCode(rawCode);
  const lines = rawCode.split('\n');

  // 1. Extract Include Headers & Libraries
  const includes = [];
  const includeRegex = /#include\s*<([a-zA-Z0-9_./]+)>/g;
  let match;
  while ((match = includeRegex.exec(rawCode)) !== null) {
    includes.push(match[1]);
  }

  // 2. Extract STL Containers & Utilities
  const stlUsed = [];
  const stlPatterns = [
    { name: 'vector', regex: /\bvector\s*<[^>]+>/g, category: 'Dynamic Array' },
    { name: 'unordered_map', regex: /\bunordered_map\s*<[^>]+>/g, category: 'Hash Map (O(1) average lookup)' },
    { name: 'map', regex: /\bmap\s*<[^>]+>/g, category: 'Ordered Map (Red-Black Tree, O(log n))' },
    { name: 'unordered_set', regex: /\bunordered_set\s*<[^>]+>/g, category: 'Hash Set (O(1) average lookup)' },
    { name: 'set', regex: /\bset\s*<[^>]+>/g, category: 'Ordered Set (Red-Black Tree, O(log n))' },
    { name: 'stack', regex: /\bstack\s*<[^>]+>/g, category: 'LIFO Container Adapter' },
    { name: 'queue', regex: /\bqueue\s*<[^>]+>/g, category: 'FIFO Container Adapter' },
    { name: 'priority_queue', regex: /\bpriority_queue\s*<[^>]+>/g, category: 'Heap / Priority Queue' },
    { name: 'deque', regex: /\bdeque\s*<[^>]+>/g, category: 'Double-Ended Queue' },
    { name: 'list', regex: /\blist\s*<[^>]+>/g, category: 'Doubly Linked List' },
    { name: 'pair', regex: /\bpair\s*<[^>]+>/g, category: 'Pair Utility' },
    { name: 'bitset', regex: /\bbitset\s*<[^>]+>/g, category: 'Bit Array' },
    { name: 'string', regex: /\bstring\b/g, category: 'Text Sequence' }
  ];

  stlPatterns.forEach(item => {
    if (item.regex.test(cleaned)) {
      stlUsed.push({ name: item.name, category: item.category });
    }
  });

  // Check STL Algorithms
  const stlAlgorithms = [];
  const algoPatterns = [
    { name: 'sort', regex: /\bsort\s*\(/g, note: 'Introsort O(n log n)' },
    { name: 'reverse', regex: /\breverse\s*\(/g, note: 'Reverses sequence O(n)' },
    { name: 'binary_search', regex: /\bbinary_search\s*\(/g, note: 'Logarithmic search O(log n)' },
    { name: 'lower_bound', regex: /\blower_bound\s*\(/g, note: 'Binary search lower bound O(log n)' },
    { name: 'upper_bound', regex: /\bupper_bound\s*\(/g, note: 'Binary search upper bound O(log n)' },
    { name: 'max_element', regex: /\bmax_element\s*\(/g, note: 'Finds maximum element O(n)' },
    { name: 'min_element', regex: /\bmin_element\s*\(/g, note: 'Finds minimum element O(n)' },
    { name: 'accumulate', regex: /\baccumulate\s*\(/g, note: 'Sum of elements O(n)' },
    { name: 'next_permutation', regex: /\bnext_permutation\s*\(/g, note: 'Lexicographical next permutation' },
    { name: '__builtin_popcount', regex: /\b__builtin_popcount(ll)?\s*\(/g, note: 'Counts set bits (O(1))' }
  ];

  algoPatterns.forEach(item => {
    if (item.regex.test(cleaned)) {
      stlAlgorithms.push({ name: item.name, note: item.note });
    }
  });

  // 3. Extract Functions
  const functions = [];
  const funcRegex = /\b([a-zA-Z_][a-zA-Z0-9_<>,:\s*&]+?)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*\{/g;
  let funcMatch;
  while ((funcMatch = funcRegex.exec(cleaned)) !== null) {
    const returnType = funcMatch[1].trim();
    const name = funcMatch[2].trim();
    const params = funcMatch[3].trim();

    if (['if', 'for', 'while', 'switch', 'catch'].includes(name)) continue;

    functions.push({
      name,
      returnType,
      parameters: params ? params.split(',').map(p => p.trim()) : [],
      isMain: name === 'main',
      isRecursive: false
    });
  }

  // Check recursive calls
  const recursiveCalls = [];
  functions.forEach(fn => {
    if (!fn.isMain) {
      const escapedName = fn.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const bodyRegex = new RegExp(`\\b${escapedName}\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?)\\}`, 'g');
      let bodyMatch = bodyRegex.exec(cleaned);
      if (bodyMatch && bodyMatch[1]) {
        const callRegex = new RegExp(`\\b${escapedName}\\s*\\(`, 'g');
        if (callRegex.test(bodyMatch[1])) {
          fn.isRecursive = true;
          recursiveCalls.push(fn.name);
        }
      }
    }
  });

  // 4. Extract Variables & Data Types
  const variables = [];
  const typePatterns = [
    { type: 'int', regex: /\bint\s+([a-zA-Z_][a-zA-Z0-9_,\s=]*);/g },
    { type: 'long long', regex: /\blong\s+long\s+([a-zA-Z_][a-zA-Z0-9_,\s=]*);/g },
    { type: 'double', regex: /\bdouble\s+([a-zA-Z_][a-zA-Z0-9_,\s=]*);/g },
    { type: 'float', regex: /\bfloat\s+([a-zA-Z_][a-zA-Z0-9_,\s=]*);/g },
    { type: 'char', regex: /\bchar\s+([a-zA-Z_][a-zA-Z0-9_,\s=]*);/g },
    { type: 'bool', regex: /\bbool\s+([a-zA-Z_][a-zA-Z0-9_,\s=]*);/g },
    { type: 'string', regex: /\bstring\s+([a-zA-Z_][a-zA-Z0-9_,\s=]*);/g },
    { type: 'auto', regex: /\bauto\s+([a-zA-Z_][a-zA-Z0-9_,\s=]*);/g },
    { type: 'vector', regex: /\bvector\s*<[^>]+>\s+([a-zA-Z_][a-zA-Z0-9_,\s=()]*);/g },
    { type: 'map', regex: /\b(?:unordered_)?map\s*<[^>]+>\s+([a-zA-Z_][a-zA-Z0-9_,\s=]*);/g },
    { type: 'set', regex: /\b(?:unordered_)?set\s*<[^>]+>\s+([a-zA-Z_][a-zA-Z0-9_,\s=]*);/g }
  ];

  typePatterns.forEach(({ type, regex }) => {
    let vMatch;
    while ((vMatch = regex.exec(cleaned)) !== null) {
      const varsDecl = vMatch[1].split(',');
      varsDecl.forEach(v => {
        const vName = v.split('=')[0].trim().replace(/[()0-9\s]/g, '');
        if (vName && !variables.some(item => item.name === vName)) {
          variables.push({ name: vName, type });
        }
      });
    }
  });

  // 5. Input & Output Variables
  const inputVariables = [];
  const cinRegex = />>\s*([a-zA-Z_][a-zA-Z0-9_]*(\[[^\]]+\])?)/g;
  let inMatch;
  while ((inMatch = cinRegex.exec(cleaned)) !== null) {
    const varName = inMatch[1].trim();
    if (!inputVariables.includes(varName)) {
      inputVariables.push(varName);
    }
  }

  const outputVariables = [];
  const coutRegex = /<<\s*([a-zA-Z_][a-zA-Z0-9_]*(\[[^\]]+\])?|"[^"]*"|'[^']*'|endl|\n)/g;
  let outMatch;
  while ((outMatch = coutRegex.exec(cleaned)) !== null) {
    const outVal = outMatch[1].trim();
    if (outVal !== 'endl' && !outVal.startsWith('"') && !outVal.startsWith("'") && !outputVariables.includes(outVal)) {
      outputVariables.push(outVal);
    }
  }

  // 6. Loops and Conditionals Count
  const forLoops = (cleaned.match(/\bfor\s*\(/g) || []).length;
  const whileLoops = (cleaned.match(/\bwhile\s*\(/g) || []).length;
  const doWhileLoops = (cleaned.match(/\bdo\s*\{/g) || []).length;
  const totalLoops = forLoops + whileLoops + doWhileLoops;

  const ifConditions = (cleaned.match(/\bif\s*\(/g) || []).length;
  const switchStatements = (cleaned.match(/\bswitch\s*\(/g) || []).length;

  // Calculate Loop Nesting Depth
  let maxLoopDepth = 0;
  let currentDepth = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/\b(for|while|do)\b/.test(line) && !line.includes(';')) {
      currentDepth++;
      if (currentDepth > maxLoopDepth) maxLoopDepth = currentDepth;
    }
    if (line.includes('}') && currentDepth > 0) {
      currentDepth--;
    }
  }
  if (totalLoops > 0 && maxLoopDepth === 0) maxLoopDepth = 1;

  // 7. Algorithmic Paradigms & DSA Pattern Detection
  const conceptsDetected = [];
  const paradigms = [];

  // Binary Search Pattern
  const hasBinarySearchKeywords = /binary_?search|lower_bound|upper_bound/i.test(cleaned);
  const hasBinarySearchLogic = (
    /mid\s*=/.test(cleaned) &&
    (/low\s*<=?\s*high|l\s*<=?\s*r/.test(cleaned)) &&
    (/low\s*=\s*mid|high\s*=\s*mid|l\s*=\s*mid|r\s*=\s*mid/.test(cleaned))
  );

  if (hasBinarySearchKeywords || hasBinarySearchLogic) {
    conceptsDetected.push('Binary Search');
    paradigms.push('Divide and Conquer / Logarithmic Search');
  }

  // Two Pointer Technique
  const hasTwoPointers = (
    (/left\s*<\s*right|l\s*<\s*r|i\s*<\s*j/.test(cleaned)) &&
    (/left\+\+|l\+\+|i\+\+/.test(cleaned)) &&
    (/right--|r--|j--/.test(cleaned))
  );
  if (hasTwoPointers || /two_?pointers?/i.test(cleaned)) {
    conceptsDetected.push('Two Pointer Technique');
    paradigms.push('Two Pointers');
  }

  // Sliding Window Pattern
  const hasSlidingWindow = (
    /while\s*\([^)]*\)\s*\{[^}]*(left\+\+|l\+\+|i\+\+|start\+\+)/.test(cleaned) &&
    /(right\+\+|r\+\+|j\+\+|end\+\+)/.test(cleaned)
  );
  if (hasSlidingWindow || /sliding_?window/i.test(cleaned)) {
    conceptsDetected.push('Sliding Window');
    paradigms.push('Sliding Window Optimization');
  }

  // Dynamic Programming Pattern
  const hasDP = (
    /dp\s*\[[^\]]+\]/.test(cleaned) ||
    /memo\s*\[[^\]]+\]/.test(cleaned) ||
    /vector\s*<\s*vector\s*<int>\s*>\s*dp/.test(cleaned) ||
    /memset\s*\(\s*dp/.test(cleaned)
  );
  if (hasDP || /dynamic_?programming|\bdp\b/i.test(cleaned)) {
    conceptsDetected.push('Dynamic Programming');
    paradigms.push('Dynamic Programming (Memoization / Tabulation)');
  }

  // Graph / Tree Traversals
  const hasTree = /(TreeNode|Node|left|right|root)/.test(cleaned) && /->\s*(left|right)/.test(cleaned);
  if (hasTree) {
    conceptsDetected.push('Binary Tree / BST');
  }

  const hasLinkedList = /(ListNode|Node|head|next|prev)/.test(cleaned) && /->\s*next/.test(cleaned);
  if (hasLinkedList) {
    conceptsDetected.push('Linked List');
  }

  const hasBFS = (
    /queue\s*<[^>]+>\s*q/.test(cleaned) &&
    /q\.push\(/.test(cleaned) &&
    /q\.pop\(/.test(cleaned)
  ) || /bfs\s*\(/i.test(cleaned);
  if (hasBFS) {
    conceptsDetected.push('Breadth-First Search (BFS)');
    paradigms.push('Graph / Level-Order Traversal');
  }

  const hasDFS = (
    recursiveCalls.length > 0 &&
    (/(visited|adj|graph|dfs)/i.test(cleaned) || hasTree)
  ) || /dfs\s*\(/i.test(cleaned);
  if (hasDFS) {
    conceptsDetected.push('Depth-First Search (DFS)');
    paradigms.push('Recursion / Depth-First Traversal');
  }

  const hasDijkstra = (
    /priority_queue/.test(cleaned) &&
    /(dist|distance)/.test(cleaned) &&
    (/greater|pair/.test(cleaned))
  ) || /dijkstra/i.test(cleaned);
  if (hasDijkstra) {
    conceptsDetected.push('Dijkstra Shortest Path');
    paradigms.push('Greedy Algorithm (Shortest Path)');
  }

  // Bit Manipulation
  const hasBitwise = (
    /(n\s*&\s*\(n\s*-\s*1\)|\(1\s*<<\s*[a-zA-Z0-9_]+\)|__builtin_popcount)/.test(cleaned)
  );
  if (hasBitwise || /bit_?manipulation/i.test(cleaned)) {
    conceptsDetected.push('Bit Manipulation');
  }

  // Backtracking
  const hasBacktracking = (
    recursiveCalls.length > 0 &&
    (/push_back\([^)]*\)[\s\S]*?pop_back\(\)/.test(cleaned) ||
     /visited\[[^\]]+\]\s*=\s*true[\s\S]*?visited\[[^\]]+\]\s*=\s*false/.test(cleaned))
  );
  if (hasBacktracking || /backtrack/i.test(cleaned)) {
    conceptsDetected.push('Backtracking');
    paradigms.push('Exhaustive Search & Backtracking');
  }

  // Sorting
  if (/merge\s*\(|mergeSort/i.test(cleaned)) {
    conceptsDetected.push('Merge Sort (O(n log n))');
    paradigms.push('Divide and Conquer');
  } else if (/partition\s*\(|quickSort/i.test(cleaned)) {
    conceptsDetected.push('Quick Sort (O(n log n) average)');
    paradigms.push('Divide and Conquer');
  }

  if (functions.length > 0 && !conceptsDetected.includes('Functions')) conceptsDetected.push('Functions');
  if (totalLoops > 0 && !conceptsDetected.includes('Loops / Iteration')) conceptsDetected.push('Loops / Iteration');
  if (ifConditions > 0 && !conceptsDetected.includes('Conditional Branching')) conceptsDetected.push('Conditional Branching');
  if (recursiveCalls.length > 0 && !conceptsDetected.includes('Recursion')) conceptsDetected.push('Recursion');
  stlUsed.forEach(s => {
    if (!conceptsDetected.includes(`STL ${s.name}`)) conceptsDetected.push(`STL ${s.name}`);
  });

  // 8. Time and Space Complexity Inference
  let timeComplexity = 'O(1)';
  let timeComplexityReason = 'Constant number of operations without loops or recursion.';
  let spaceComplexity = 'O(1)';
  let spaceComplexityReason = 'Executes in constant memory without auxiliary arrays, vectors, or deep call stack.';

  if (hasBinarySearchKeywords || hasBinarySearchLogic) {
    timeComplexity = 'O(log n)';
    timeComplexityReason = 'Search interval is halved in each iteration (divide and conquer).';
  } else if (hasDijkstra) {
    timeComplexity = 'O((V + E) log V)';
    timeComplexityReason = 'Each vertex and edge is processed using a min-heap priority queue.';
    spaceComplexity = 'O(V + E)';
    spaceComplexityReason = 'Adjacency list graph representation and distance array.';
  } else if (hasBFS || hasDFS) {
    timeComplexity = 'O(V + E)';
    timeComplexityReason = 'Traverses every vertex and edge of the graph/tree once.';
    spaceComplexity = 'O(V)';
    spaceComplexityReason = 'Visited array / queue / recursive call stack stores graph vertices.';
  } else if (hasDP) {
    if (maxLoopDepth >= 2 || /dp\[i\]\[j\]/.test(cleaned)) {
      timeComplexity = 'O(n * m)';
      timeComplexityReason = 'Nested loops fill an n x m DP state matrix.';
      spaceComplexity = 'O(n * m)';
      spaceComplexityReason = '2D DP table memoizes subproblem solutions.';
    } else {
      timeComplexity = 'O(n)';
      timeComplexityReason = 'Single linear scan computes 1D DP transitions in O(1) per state.';
      spaceComplexity = 'O(n)';
      spaceComplexityReason = '1D DP array stores subproblem values.';
    }
  } else if (hasBacktracking) {
    timeComplexity = 'O(2^n) or O(n!)';
    timeComplexityReason = 'Explores exponential combinatorial decision tree branches.';
    spaceComplexity = 'O(n)';
    spaceComplexityReason = 'Recursion call stack depth bounded by search depth.';
  } else if (recursiveCalls.length > 0) {
    if (cleaned.includes('fib(') || (recursiveCalls.length >= 1 && (cleaned.match(/return\s+[a-zA-Z0-9_]+\([^)]*\)\s*\+\s*[a-zA-Z0-9_]+\(/g) || []).length > 0)) {
      timeComplexity = 'O(2^n)';
      timeComplexityReason = 'Binary recursion tree doubles function calls at each depth without memoization.';
      spaceComplexity = 'O(n)';
      spaceComplexityReason = 'Maximum recursion stack call depth is O(n).';
    } else if (hasBinarySearchKeywords || hasBinarySearchLogic) {
      timeComplexity = 'O(log n)';
      timeComplexityReason = 'Recursive binary search divides problem size by 2 at each step.';
      spaceComplexity = 'O(log n)';
      spaceComplexityReason = 'Recursion call stack depth of logarithmic levels.';
    } else {
      timeComplexity = 'O(n)';
      timeComplexityReason = 'Linear recursion with n levels of function calls.';
      spaceComplexity = 'O(n)';
      spaceComplexityReason = 'Recursion call stack depth requires O(n) memory.';
    }
  } else if (stlAlgorithms.some(a => a.name === 'sort')) {
    timeComplexity = 'O(n log n)';
    timeComplexityReason = 'std::sort performs O(n log n) comparisons using Introsort.';
  } else if (maxLoopDepth >= 3) {
    timeComplexity = 'O(n^3)';
    timeComplexityReason = `Contains ${maxLoopDepth} levels of nested loops iterating up to n times each.`;
  } else if (maxLoopDepth === 2) {
    timeComplexity = 'O(n^2)';
    timeComplexityReason = 'Nested outer and inner loops iterate through the elements.';
  } else if (maxLoopDepth === 1 || hasTwoPointers || hasSlidingWindow) {
    timeComplexity = 'O(n)';
    timeComplexityReason = 'Iterates through the data set with a single linear pass.';
  }

  // Space Complexity Check
  if (spaceComplexity === 'O(1)') {
    if (stlUsed.some(s => ['vector', 'unordered_map', 'map', 'set', 'unordered_set', 'queue', 'stack', 'priority_queue'].includes(s.name))) {
      spaceComplexity = 'O(n)';
      spaceComplexityReason = 'Stores dynamic data elements in STL containers proportionally to input size.';
    } else if (variables.some(v => v.name.includes('[') || /int\s+[a-zA-Z0-9_]+\s*\[\s*\d+\s*\]/.test(cleaned))) {
      spaceComplexity = 'O(n)';
      spaceComplexityReason = 'Allocates fixed or dynamically sized array buffer.';
    }
  }

  // 9. Generate Beginner-Friendly Step-by-Step Explanation
  const explanationSteps = [];

  let primaryGoal = 'computes the required logic';
  if (hasBinarySearchKeywords || hasBinarySearchLogic) primaryGoal = 'efficiently searches for a target element in a sorted collection using Binary Search';
  else if (hasTwoPointers) primaryGoal = 'processes elements from both ends or multiple positions simultaneously using Two Pointers';
  else if (hasSlidingWindow) primaryGoal = 'finds a contiguous subarray or substring matching a condition using a dynamic Sliding Window';
  else if (hasDP) primaryGoal = 'solves an optimization problem by breaking it into overlapping subproblems and storing results (Dynamic Programming)';
  else if (hasBFS) primaryGoal = 'explores all nodes level-by-level starting from the source (Breadth-First Search)';
  else if (hasDFS) primaryGoal = 'explores as deep as possible along each branch before backtracking (Depth-First Search)';
  else if (hasDijkstra) primaryGoal = 'calculates the shortest path from a starting node to all other nodes in a weighted graph (Dijkstra algorithm)';
  else if (stlAlgorithms.some(a => a.name === 'sort')) primaryGoal = 'sorts the input elements in ascending/descending order';
  else if (totalLoops > 0) primaryGoal = 'iterates through data to perform calculations and updates';

  explanationSteps.push({
    title: '1. Program Objective & Overview',
    content: `This C++ program ${primaryGoal}. It is structured with ${functions.length} function(s) and uses ${stlUsed.length > 0 ? stlUsed.map(s => s.name).join(', ') : 'standard primitive types'}.`
  });

  if (inputVariables.length > 0 || variables.length > 0) {
    explanationSteps.push({
      title: '2. Input & Variable Initialization',
      content: `The code declares ${variables.slice(0, 6).map(v => `\`${v.name}\` (${v.type})`).join(', ') || 'essential variables'}${inputVariables.length > 0 ? ` and takes input for: ${inputVariables.map(i => `\`${i}\``).join(', ')}` : ''}.`
    });
  }

  let logicDesc = '';
  if (hasBinarySearchKeywords || hasBinarySearchLogic) {
    logicDesc = 'The search space is defined between `low` and `high`. In each iteration, it calculates `mid` and compares `arr[mid]` with the target. If target is smaller, `high` shifts left; if greater, `low` shifts right, halving search space every step.';
  } else if (hasTwoPointers) {
    logicDesc = 'Two indices (`left` and `right`) start from designated positions and move inward based on conditions, checking pairs or boundaries in a single linear pass without nested loops.';
  } else if (hasSlidingWindow) {
    logicDesc = 'The `right` pointer expands the window to include new elements while maintaining state. When a constraint is violated, the `left` pointer advances to shrink the window until valid again.';
  } else if (hasDP) {
    logicDesc = 'Subproblem solutions are computed and stored in a DP table or memoization array. Each state builds upon previously computed states, eliminating redundant re-computations.';
  } else if (recursiveCalls.length > 0) {
    logicDesc = `The function \`${recursiveCalls[0] || 'helper'}\` executes recursively. It checks base cases to prevent infinite calls, performs a partial calculation, and invokes itself with smaller subproblem inputs.`;
  } else if (totalLoops > 0) {
    logicDesc = `The program runs ${totalLoops} loop(s) (nesting depth: ${maxLoopDepth}) to process the elements sequentially, update accumulators, and evaluate conditions.`;
  } else {
    logicDesc = 'The program executes straight-line operations sequentially and returns the evaluated result directly.';
  }

  explanationSteps.push({
    title: '3. Core Algorithmic Logic',
    content: logicDesc
  });

  explanationSteps.push({
    title: '4. Output & Termination',
    content: `Finally, the program generates output${outputVariables.length > 0 ? ` (${outputVariables.map(o => `\`${o}\``).join(', ')})` : ''} via \`cout\` or returns the final computed value from the main function.`
  });

  // 10. Suggestions, Optimizations & Best Practices
  const suggestions = [];
  const edgeCases = [];
  const bestPractices = [];

  if (!rawCode.includes('ios_base::sync_with_stdio') && (rawCode.includes('cin') || rawCode.includes('cout'))) {
    suggestions.push({
      category: 'Performance',
      title: 'Fast I/O for Competitive Programming',
      description: 'Add `ios_base::sync_with_stdio(false); cin.tie(NULL);` at the start of `main()` to speed up input/output operations during large test cases.'
    });
  }

  if (rawCode.includes('vector<') && !rawCode.includes('&') && functions.some(f => !f.isMain)) {
    suggestions.push({
      category: 'Memory & Speed',
      title: 'Pass STL Containers by Reference',
      description: 'Pass large containers like `vector` or `string` by `const vector<int>&` in function parameters instead of by value to avoid expensive deep copies.'
    });
  }

  if (maxLoopDepth >= 2 && !hasDP && !hasTwoPointers && (rawCode.includes('target') || rawCode.includes('sum'))) {
    suggestions.push({
      category: 'Optimization',
      title: 'Optimize Nested Loops with Hash Map / Two Pointers',
      description: 'Consider using an `unordered_map` or sorting with Two Pointers to reduce O(n²) nested loop lookups down to O(n) or O(n log n).'
    });
  }

  if (stlUsed.some(s => s.name === 'map') && !rawCode.includes('lower_bound') && !rawCode.includes('upper_bound')) {
    suggestions.push({
      category: 'Performance',
      title: 'Prefer unordered_map for O(1) Average Lookup',
      description: 'If keys do not need to be stored in sorted order, switch from `std::map` (O(log n) tree) to `std::unordered_map` (O(1) hash table).'
    });
  }

  if (rawCode.includes('/') || rawCode.includes('%')) {
    edgeCases.push('Check for Division by Zero when dividing by dynamic variables.');
  }
  if (rawCode.includes('int') && (rawCode.includes('*') || rawCode.includes('+'))) {
    edgeCases.push('Watch out for Integer Overflow when calculating large products or sums (use `long long` if numbers exceed 2 x 10^9).');
  }
  if (stlUsed.some(s => ['stack', 'queue', 'priority_queue'].includes(s.name))) {
    edgeCases.push('Always check `!container.empty()` before calling `.top()`, `.front()`, or `.pop()` to prevent segmentation faults.');
  }
  if (rawCode.includes('[') && rawCode.includes(']')) {
    edgeCases.push('Ensure array indices stay strictly within 0 to size-1 bounds to avoid Out-Of-Bounds memory errors.');
  }

  bestPractices.push('Use meaningful variable names instead of single characters for complex logic.');
  bestPractices.push('Declare variables with `const` when their values are not intended to change.');
  bestPractices.push('Break large functions into modular helper functions with single responsibilities.');

  return {
    language: 'cpp',
    summary: {
      functionsCount: functions.length,
      loopsCount: totalLoops,
      loopDepth: maxLoopDepth,
      conditionalsCount: ifConditions,
      recursiveCallsCount: recursiveCalls.length,
      stlCount: stlUsed.length
    },
    functions,
    stlUsed,
    stlAlgorithms,
    variables,
    inputVariables,
    outputVariables,
    conceptsUsed: conceptsDetected,
    paradigms,
    complexity: {
      time: timeComplexity,
      timeReason: timeComplexityReason,
      space: spaceComplexity,
      spaceReason: spaceComplexityReason,
      rating: getComplexityRating(timeComplexity)
    },
    explanationSteps,
    suggestions,
    edgeCases,
    bestPractices,
    codeStats: {
      totalLines: lines.length,
      codeLines: cleaned.split('\n').filter(l => l.trim().length > 0).length,
      includes
    }
  };
}

function getComplexityRating(timeComplexity) {
  if (timeComplexity === 'O(1)') return { level: 'Excellent', color: 'emerald', score: 100 };
  if (timeComplexity.includes('log n') && !timeComplexity.includes('n log n')) return { level: 'Very Fast', color: 'teal', score: 90 };
  if (timeComplexity === 'O(n)') return { level: 'Linear (Good)', color: 'blue', score: 80 };
  if (timeComplexity.includes('n log n')) return { level: 'Optimal (Good)', color: 'indigo', score: 70 };
  if (timeComplexity.includes('n^2')) return { level: 'Quadratic (Moderate)', color: 'amber', score: 50 };
  if (timeComplexity.includes('n^3')) return { level: 'Cubic (Slow)', color: 'orange', score: 30 };
  if (timeComplexity.includes('2^n') || timeComplexity.includes('n!')) return { level: 'Exponential (Very Slow)', color: 'rose', score: 15 };
  return { level: 'Fair', color: 'slate', score: 60 };
}
