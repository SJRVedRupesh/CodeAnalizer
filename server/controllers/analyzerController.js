/**
 * Analyzer Controller
 * Handles analysis and execution endpoints for C++ and SQL
 */

import { analyzeCpp } from '../services/cppAnalyzer.js';
import { analyzeSql } from '../services/sqlAnalyzer.js';
import { executeCpp, executeSql } from '../services/codeExecutor.js';
import { getSchemaOverview } from '../services/sampleDatabase.js';

// Pre-built algorithm and SQL templates
const CODE_TEMPLATES = {
  cpp: [
    {
      id: 'binary_search',
      title: 'Binary Search Algorithm',
      paradigm: 'Divide and Conquer',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      code: `#include <iostream>
#include <vector>

using namespace std;

// Function to perform Binary Search on a sorted vector
int binarySearch(const vector<int>& arr, int target) {
    int low = 0;
    int high = arr.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;

        if (arr[mid] == target) {
            return mid; // Target found at index mid
        }
        else if (arr[mid] < target) {
            low = mid + 1; // Search right half
        }
        else {
            high = mid - 1; // Search left half
        }
    }
    return -1; // Target not found
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<int> numbers = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int target = 23;

    int result = binarySearch(numbers, target);

    if (result != -1) {
        cout << "Element found at index: " << result << endl;
    } else {
        cout << "Element not found in array" << endl;
    }

    return 0;
}`
    },
    {
      id: 'two_sum',
      title: 'Two Sum (Hash Map Approach)',
      paradigm: 'Hashing / Linear Scan',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

// Finds two indices whose values sum to target
pair<int, int> twoSum(const vector<int>& nums, int target) {
    unordered_map<int, int> seen; // value -> index

    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (seen.find(complement) != seen.end()) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {-1, -1};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;

    pair<int, int> result = twoSum(nums, target);
    cout << "Indices: [" << result.first << ", " << result.second << "]" << endl;

    return 0;
}`
    },
    {
      id: 'merge_sort',
      title: 'Merge Sort Algorithm',
      paradigm: 'Divide and Conquer / Recursion',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      code: `#include <iostream>
#include <vector>

using namespace std;

void merge(vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    vector<int> L(n1), R(n2);
    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

int main() {
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    mergeSort(arr, 0, arr.size() - 1);

    cout << "Sorted array: ";
    for (int x : arr) cout << x << " ";
    cout << endl;

    return 0;
}`
    },
    {
      id: 'bfs_traversal',
      title: 'Graph BFS Level Order Traversal',
      paradigm: 'Graph Traversal / Queue',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      code: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

void bfs(int startNode, int V, const vector<vector<int>>& adj) {
    vector<bool> visited(V, false);
    queue<int> q;

    visited[startNode] = true;
    q.push(startNode);

    cout << "BFS Order: ";
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        cout << node << " ";

        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
    cout << endl;
}

int main() {
    int V = 5;
    vector<vector<int>> adj(V);

    // Graph Edges
    adj[0] = {1, 2};
    adj[1] = {0, 3, 4};
    adj[2] = {0};
    adj[3] = {1};
    adj[4] = {1};

    bfs(0, V, adj);
    return 0;
}`
    },
    {
      id: 'knapsack_dp',
      title: '0/1 Knapsack (Dynamic Programming)',
      paradigm: 'Dynamic Programming / Memoization',
      timeComplexity: 'O(n * W)',
      spaceComplexity: 'O(n * W)',
      code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int knapSack(int W, const vector<int>& wt, const vector<int>& val, int n) {
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w) {
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}

int main() {
    vector<int> val = {60, 100, 120};
    vector<int> wt = {10, 20, 30};
    int W = 50;
    int n = val.size();

    cout << "Maximum Knapsack Value: " << knapSack(W, wt, val, n) << endl;
    return 0;
}`
    }
  ],
  sql: [
    {
      id: 'employee_dept_join',
      title: 'Department Salary Join & Aggregation',
      paradigm: 'INNER JOIN & GROUP BY',
      code: `SELECT 
    d.dept_name,
    COUNT(e.emp_id) AS total_employees,
    ROUND(AVG(e.salary), 2) AS average_salary,
    MAX(e.salary) AS highest_salary
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id
WHERE e.salary >= 80000
GROUP BY d.dept_name
HAVING COUNT(e.emp_id) >= 1
ORDER BY average_salary DESC;`
    },
    {
      id: 'ecommerce_top_customers',
      title: 'Top High-Value E-Commerce Customers',
      paradigm: 'LEFT JOIN & Filtering',
      code: `SELECT 
    c.full_name,
    c.city,
    c.country,
    COUNT(o.order_id) AS order_count,
    COALESCE(SUM(o.total_amount), 0) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.full_name, c.city, c.country
ORDER BY total_spent DESC
LIMIT 5;`
    },
    {
      id: 'project_allocation',
      title: 'Project Staffing & Role Breakdown',
      paradigm: 'Multiple Table JOIN',
      code: `SELECT 
    p.project_name,
    d.dept_name,
    e.first_name || ' ' || e.last_name AS employee_name,
    ep.role,
    ep.hours_logged
FROM projects p
INNER JOIN departments d ON p.dept_id = d.dept_id
INNER JOIN employee_projects ep ON p.project_id = ep.project_id
INNER JOIN employees e ON ep.emp_id = e.emp_id
ORDER BY p.project_name ASC, ep.hours_logged DESC;`
    },
    {
      id: 'student_gpa_ranking',
      title: 'Student Performance & Course Enrollment',
      paradigm: 'Multi-table Join with Aggregate Filter',
      code: `SELECT 
    s.student_id,
    s.full_name,
    s.major,
    s.gpa,
    COUNT(en.enrollment_id) AS enrolled_courses
FROM students s
INNER JOIN enrollments en ON s.student_id = en.student_id
WHERE s.gpa >= 3.7
GROUP BY s.student_id, s.full_name, s.major, s.gpa
ORDER BY s.gpa DESC;`
    }
  ]
};

export const analyzeCppCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Code is required for analysis.' });
    }
    const analysis = analyzeCpp(code);
    return res.status(200).json({ success: true, analysis });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const analyzeSqlCode = async (req, res) => {
  try {
    const { sql } = req.body;
    if (!sql) {
      return res.status(400).json({ success: false, error: 'SQL query is required for analysis.' });
    }
    const analysis = analyzeSql(sql);
    return res.status(200).json({ success: true, analysis });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const runCppCode = async (req, res) => {
  try {
    const { code, input } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Code is required to run.' });
    }
    const result = await executeCpp(code, input || '');
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const runSqlCode = async (req, res) => {
  try {
    const { sql } = req.body;
    if (!sql) {
      return res.status(400).json({ success: false, error: 'SQL query is required to run.' });
    }
    const result = await executeSql(sql);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getSchemas = async (req, res) => {
  try {
    const schemaData = await getSchemaOverview();
    return res.status(200).json(schemaData);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getTemplates = (req, res) => {
  return res.status(200).json({ success: true, templates: CODE_TEMPLATES });
};
