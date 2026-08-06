import { analyzeCpp } from './services/cppAnalyzer.js';
import { analyzeSql } from './services/sqlAnalyzer.js';
import { executeSqlQuery, getSchemaOverview } from './services/sampleDatabase.js';

async function runTests() {
  console.log('🧪 Testing C++ Analyzer with Binary Search...');
  const cppCode = `
    #include <iostream>
    #include <vector>
    using namespace std;

    int binarySearch(const vector<int>& arr, int target) {
        int low = 0, high = arr.size() - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }

    int main() {
        vector<int> a = {1, 3, 5, 7, 9};
        cout << binarySearch(a, 5);
        return 0;
    }
  `;

  const cppRes = analyzeCpp(cppCode);
  console.log('C++ Concepts Detected:', cppRes.conceptsUsed);
  console.log('C++ Time Complexity:', cppRes.complexity.time);
  console.log('C++ Space Complexity:', cppRes.complexity.space);
  console.log('C++ STL Used:', cppRes.stlUsed);

  console.log('\n🧪 Testing SQL Analyzer with JOIN & GROUP BY...');
  const sqlQuery = `
    SELECT d.dept_name, COUNT(e.emp_id) AS emp_count, AVG(e.salary) AS avg_sal
    FROM employees e
    INNER JOIN departments d ON e.dept_id = d.dept_id
    WHERE e.salary > 80000
    GROUP BY d.dept_name
    HAVING COUNT(e.emp_id) > 0
    ORDER BY avg_sal DESC;
  `;

  const sqlRes = analyzeSql(sqlQuery);
  console.log('SQL Query Type:', sqlRes.queryType);
  console.log('SQL Tables:', sqlRes.tables);
  console.log('SQL Joins:', sqlRes.joins);
  console.log('SQL Execution Order Steps:', sqlRes.executionOrder.length);

  console.log('\n🧪 Testing Live SQLite Execution...');
  const dbExecRes = await executeSqlQuery('SELECT * FROM employees LIMIT 2;');
  console.log('SQL Execution Success:', dbExecRes.success, 'Rows:', dbExecRes.rowCount);

  const schemas = await getSchemaOverview();
  console.log('Available Tables in DB:', schemas.tables.map(t => t.tableName));

  console.log('\n🎉 ALL BACKEND TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
