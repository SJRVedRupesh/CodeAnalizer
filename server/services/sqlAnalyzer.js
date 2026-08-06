/**
 * SQL Code Analyzer Service
 * Performs deep SQL query parsing, clause detection, join classification,
 * logical execution order breakdown, indexing suggestions, and normalization tips.
 */

export function analyzeSql(sql) {
  if (!sql || typeof sql !== 'string' || sql.trim().length === 0) {
    throw new Error('Please provide a valid SQL query to analyze.');
  }

  const rawQuery = sql.trim();
  // Remove comments
  const cleaned = rawQuery
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim();

  // Normalize single spaces
  const normalized = cleaned.replace(/\s+/g, ' ');

  // 1. Detect Query Type
  let queryType = 'UNKNOWN';
  if (/^\s*SELECT\b/i.test(normalized)) queryType = 'SELECT (Data Retrieval / DQL)';
  else if (/^\s*INSERT\s+INTO\b/i.test(normalized)) queryType = 'INSERT (Data Insertion / DML)';
  else if (/^\s*UPDATE\b/i.test(normalized)) queryType = 'UPDATE (Data Modification / DML)';
  else if (/^\s*DELETE\s+FROM\b|^\s*DELETE\b/i.test(normalized)) queryType = 'DELETE (Data Deletion / DML)';
  else if (/^\s*CREATE\s+TABLE\b/i.test(normalized)) queryType = 'CREATE TABLE (Schema Definition / DDL)';
  else if (/^\s*ALTER\s+TABLE\b/i.test(normalized)) queryType = 'ALTER TABLE (Schema Alteration / DDL)';
  else if (/^\s*DROP\s+TABLE\b/i.test(normalized)) queryType = 'DROP TABLE (Schema Removal / DDL)';
  else if (/^\s*WITH\b/i.test(normalized)) queryType = 'CTE / SELECT (Common Table Expression)';

  // 2. Extract Tables
  const tables = [];
  const fromMatch = normalized.match(/\bFROM\s+([a-zA-Z0-9_]+(?:\s+(?:AS\s+)?[a-zA-Z0-9_]+)?(?:\s*,\s*[a-zA-Z0-9_]+(?:\s+(?:AS\s+)?[a-zA-Z0-9_]+)?)*)/i);
  if (fromMatch) {
    const rawTables = fromMatch[1].split(',');
    rawTables.forEach(t => {
      const parts = t.trim().split(/\s+/);
      const tableName = parts[0];
      const alias = parts.length > 1 ? (parts[1].toUpperCase() === 'AS' ? parts[2] : parts[1]) : null;
      if (tableName && !tables.some(item => item.name === tableName)) {
        tables.push({ name: tableName, alias });
      }
    });
  }

  // Extract JOIN tables
  const joinTableRegex = /\b(?:INNER|LEFT|RIGHT|FULL|CROSS)?\s*JOIN\s+([a-zA-Z0-9_]+)(?:\s+(?:AS\s+)?([a-zA-Z0-9_]+))?/gi;
  let joinTMatch;
  while ((joinTMatch = joinTableRegex.exec(normalized)) !== null) {
    const tableName = joinTMatch[1];
    const alias = joinTMatch[2] || null;
    if (tableName && !tables.some(item => item.name === tableName)) {
      tables.push({ name: tableName, alias });
    }
  }

  // Extract INSERT / UPDATE / DELETE tables
  if (queryType.startsWith('INSERT')) {
    const insMatch = normalized.match(/\bINSERT\s+INTO\s+([a-zA-Z0-9_]+)/i);
    if (insMatch && !tables.some(t => t.name === insMatch[1])) {
      tables.push({ name: insMatch[1], alias: null });
    }
  }
  if (queryType.startsWith('UPDATE')) {
    const updMatch = normalized.match(/\bUPDATE\s+([a-zA-Z0-9_]+)/i);
    if (updMatch && !tables.some(t => t.name === updMatch[1])) {
      tables.push({ name: updMatch[1], alias: null });
    }
  }
  if (queryType.startsWith('DELETE')) {
    const delMatch = normalized.match(/\bDELETE\s+FROM\s+([a-zA-Z0-9_]+)/i);
    if (delMatch && !tables.some(t => t.name === delMatch[1])) {
      tables.push({ name: delMatch[1], alias: null });
    }
  }

  // 3. Extract Columns in SELECT
  const columns = [];
  const selectMatch = normalized.match(/\bSELECT\s+(DISTINCT\s+)?([\s\S]+?)\s+\bFROM\b/i);
  const isSelectAll = /\bSELECT\s+(DISTINCT\s+)?\*/i.test(normalized);

  if (isSelectAll) {
    columns.push('* (All Columns)');
  } else if (selectMatch && selectMatch[2]) {
    const rawCols = selectMatch[2].split(/,(?![^(]*\))/);
    rawCols.forEach(col => {
      const trimmed = col.trim();
      if (trimmed) columns.push(trimmed);
    });
  }

  // 4. Extract Joins & Join Types
  const joins = [];
  const joinRegex = /\b(INNER|LEFT\s+OUTER|LEFT|RIGHT\s+OUTER|RIGHT|FULL\s+OUTER|FULL|CROSS)?\s*JOIN\s+([a-zA-Z0-9_]+)(?:\s+(?:AS\s+)?([a-zA-Z0-9_]+))?\s+(?:ON\s+([\s\S]+?)(?=\b(JOIN|LEFT|RIGHT|FULL|INNER|WHERE|GROUP|HAVING|ORDER|LIMIT|;|$)))?/gi;
  let jMatch;
  while ((jMatch = joinRegex.exec(normalized)) !== null) {
    const joinType = (jMatch[1] || 'INNER').toUpperCase() + ' JOIN';
    const targetTable = jMatch[2];
    const condition = jMatch[4] ? jMatch[4].trim() : 'Implied / Cartesian';
    joins.push({
      type: joinType,
      table: targetTable,
      condition
    });
  }

  // 5. Clauses Detection
  const hasWhere = /\bWHERE\b/i.test(normalized);
  const whereMatch = normalized.match(/\bWHERE\s+([\s\S]+?)(?=\b(GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT|;|$))/i);
  const whereClause = whereMatch ? whereMatch[1].trim() : null;

  const hasGroupBy = /\bGROUP\s+BY\b/i.test(normalized);
  const groupByMatch = normalized.match(/\bGROUP\s+BY\s+([\s\S]+?)(?=\b(HAVING|ORDER\s+BY|LIMIT|;|$))/i);
  const groupByClause = groupByMatch ? groupByMatch[1].trim() : null;

  const hasHaving = /\bHAVING\b/i.test(normalized);
  const havingMatch = normalized.match(/\bHAVING\s+([\s\S]+?)(?=\b(ORDER\s+BY|LIMIT|;|$))/i);
  const havingClause = havingMatch ? havingMatch[1].trim() : null;

  const hasOrderBy = /\bORDER\s+BY\b/i.test(normalized);
  const orderByMatch = normalized.match(/\bORDER\s+BY\s+([\s\S]+?)(?=\b(LIMIT|;|$))/i);
  const orderByClause = orderByMatch ? orderByMatch[1].trim() : null;

  const hasLimit = /\bLIMIT\b/i.test(normalized);
  const limitMatch = normalized.match(/\bLIMIT\s+([0-9]+)(\s+OFFSET\s+[0-9]+)?/i);
  const limitClause = limitMatch ? limitMatch[0].trim() : null;

  const hasDistinct = /\bDISTINCT\b/i.test(normalized);
  const hasSubquery = /\(\s*SELECT\b/i.test(normalized);
  const hasCTE = /\bWITH\s+[a-zA-Z0-9_]+\s+AS\s*\(/i.test(normalized);

  // 6. Aggregate & Window Functions Extraction
  const aggregatesUsed = [];
  const aggPatterns = [
    { name: 'COUNT', regex: /\bCOUNT\s*\([^)]*\)/gi },
    { name: 'SUM', regex: /\bSUM\s*\([^)]*\)/gi },
    { name: 'AVG', regex: /\bAVG\s*\([^)]*\)/gi },
    { name: 'MIN', regex: /\bMIN\s*\([^)]*\)/gi },
    { name: 'MAX', regex: /\bMAX\s*\([^)]*\)/gi },
    { name: 'GROUP_CONCAT', regex: /\bGROUP_CONCAT\s*\([^)]*\)/gi },
    { name: 'ROW_NUMBER', regex: /\bROW_NUMBER\s*\(\)\s*OVER\b/gi },
    { name: 'RANK', regex: /\bRANK\s*\(\)\s*OVER\b/gi },
    { name: 'DENSE_RANK', regex: /\bDENSE_RANK\s*\(\)\s*OVER\b/gi }
  ];

  aggPatterns.forEach(agg => {
    const matches = normalized.match(agg.regex);
    if (matches) {
      aggregatesUsed.push({ function: agg.name, count: matches.length, usages: matches });
    }
  });

  // 7. Logical Execution Order Steps (The Standard SQL Order of Operations)
  const executionOrder = [];
  let stepIdx = 1;

  // Step 1: FROM & JOIN
  executionOrder.push({
    step: stepIdx++,
    phase: 'FROM & JOIN',
    title: '1. Resolve Source Tables & Join Combinations',
    description: `Database accesses table(s): ${tables.map(t => `\`${t.name}\``).join(', ') || 'target data source'}${joins.length > 0 ? ` and performs ${joins.map(j => `\`${j.type}\` on \`${j.table}\``).join(', ')}` : ''} to create the virtual working dataset.`
  });

  // Step 2: WHERE
  if (hasWhere) {
    executionOrder.push({
      step: stepIdx++,
      phase: 'WHERE',
      title: '2. Row-Level Filtering',
      description: `Filters candidate rows against condition: \`${whereClause}\`. Rows evaluating to FALSE or NULL are discarded before grouping.`
    });
  }

  // Step 3: GROUP BY
  if (hasGroupBy) {
    executionOrder.push({
      step: stepIdx++,
      phase: 'GROUP BY',
      title: '3. Data Aggregation & Partitioning',
      description: `Groups remaining rows by column(s): \`${groupByClause}\`. Each group is treated as a single output entity for aggregate calculations.`
    });
  }

  // Step 4: HAVING
  if (hasHaving) {
    executionOrder.push({
      step: stepIdx++,
      phase: 'HAVING',
      title: '4. Group-Level Filtering',
      description: `Evaluates aggregate condition \`${havingClause}\` against grouped data. Groups not satisfying the condition are filtered out.`
    });
  }

  // Step 5: SELECT & Window Functions
  executionOrder.push({
    step: stepIdx++,
    phase: 'SELECT',
    title: `${stepIdx - 1}. Project Columns & Evaluate Expressions`,
    description: `Computes requested expressions and columns: ${columns.slice(0, 5).map(c => `\`${c}\``).join(', ')}${columns.length > 5 ? '...' : ''}. Column aliases are assigned at this point.`
  });

  // Step 6: DISTINCT
  if (hasDistinct) {
    executionOrder.push({
      step: stepIdx++,
      phase: 'DISTINCT',
      title: `${stepIdx - 1}. Duplicate Row Elimination`,
      description: 'Scans the projected columns and discards identical duplicate rows.'
    });
  }

  // Step 7: ORDER BY
  if (hasOrderBy) {
    executionOrder.push({
      step: stepIdx++,
      phase: 'ORDER BY',
      title: `${stepIdx - 1}. Sort Result Set`,
      description: `Sorts the final rows according to criteria: \`${orderByClause}\`.`
    });
  }

  // Step 8: LIMIT / OFFSET
  if (hasLimit) {
    executionOrder.push({
      step: stepIdx++,
      phase: 'LIMIT / OFFSET',
      title: `${stepIdx - 1}. Pagination & Row Slicing`,
      description: `Restricts the final output to: \`${limitClause}\`.`
    });
  }

  // 8. Beginner-Friendly Explanation
  const explanationSteps = [];
  explanationSteps.push({
    title: 'Query Goal & Summary',
    content: generateSqlSummary(queryType, tables, columns, joins, hasWhere, hasGroupBy, hasOrderBy, hasLimit)
  });

  if (joins.length > 0) {
    explanationSteps.push({
      title: 'Table Relationships & Joins',
      content: `The query joins ${joins.length} additional table(s). ${joins.map(j => `It uses a **${j.type}** with \`${j.table}\` matching on condition \`${j.condition}\`.`).join(' ')}`
    });
  }

  if (hasWhere) {
    explanationSteps.push({
      title: 'Filtering Criteria (WHERE)',
      content: `Only records satisfying the condition \`${whereClause}\` are selected for processing.`
    });
  }

  if (hasGroupBy) {
    explanationSteps.push({
      title: 'Aggregation & Summarization (GROUP BY)',
      content: `Rows are grouped by \`${groupByClause}\`${aggregatesUsed.length > 0 ? ` to calculate aggregate values: ${aggregatesUsed.map(a => `\`${a.function}()\``).join(', ')}` : ''}.`
    });
  }

  if (hasOrderBy || hasLimit) {
    explanationSteps.push({
      title: 'Sorting & Pagination',
      content: `${hasOrderBy ? `Results are sorted by \`${orderByClause}\`. ` : ''}${hasLimit ? `Output is capped with \`${limitClause}\`.` : ''}`
    });
  }

  // 9. Optimization Tips & Indexing Suggestions
  const optimizationTips = [];
  const indexingSuggestions = [];
  const normalizationTips = [];

  if (isSelectAll) {
    optimizationTips.push({
      category: 'Query Performance',
      severity: 'Medium',
      title: 'Avoid SELECT * in Production Queries',
      description: 'Replace `SELECT *` with specific required column names (e.g. `SELECT id, name`). This prevents unnecessary I/O, minimizes memory usage, and enables covering index scans.'
    });
  }

  if (hasWhere) {
    indexingSuggestions.push({
      table: tables[0]?.name || 'Target Table',
      column: whereClause,
      recommendation: `Add a B-Tree index on columns used in WHERE clause (\`${whereClause.slice(0, 40)}\`) to replace full table scans (O(N)) with index range scans (O(log N)).`
    });
  }

  joins.forEach(j => {
    indexingSuggestions.push({
      table: j.table,
      column: j.condition,
      recommendation: `Ensure foreign key columns in JOIN condition \`${j.condition}\` have indexed lookups to allow fast Hash or Nested Loop Joins.`
    });
  });

  if (hasHaving && !hasGroupBy) {
    optimizationTips.push({
      category: 'SQL Standard',
      severity: 'High',
      title: 'HAVING used without GROUP BY',
      description: 'Use WHERE for filtering row values and reserve HAVING for filtering aggregate group results.'
    });
  }

  // Normalization Guidelines
  normalizationTips.push({
    level: '1NF (First Normal Form)',
    tip: 'Ensure each column contains atomic (indivisible) values and each row is uniquely identified by a primary key.'
  });
  normalizationTips.push({
    level: '2NF (Second Normal Form)',
    tip: 'Eliminate partial dependencies: all non-key columns must depend on the entire primary key.'
  });
  normalizationTips.push({
    level: '3NF (Third Normal Form)',
    tip: 'Eliminate transitive dependencies: non-key columns must not depend on other non-key columns (e.g., store Department_ID rather than duplicating Department_Name and Location in Employee table).'
  });

  // Estimated Complexity
  let estimatedComplexity = 'O(N)';
  let complexityReason = 'Linear scan over table records.';
  if (joins.length > 0) {
    estimatedComplexity = `O(${tables.map(() => 'N').join(' * ')}) without index, O(N log M) with index`;
    complexityReason = `Performs relational join operations across ${tables.length} tables.`;
  } else if (hasOrderBy && !hasLimit) {
    estimatedComplexity = 'O(N log N)';
    complexityReason = 'Requires in-memory sorting (quicksort/mergesort) for ORDER BY clause.';
  } else if (hasLimit && !hasOrderBy) {
    estimatedComplexity = 'O(K) early exit';
    complexityReason = 'Halts scanning once LIMIT row count is reached.';
  }

  return {
    language: 'sql',
    queryType,
    tables,
    columns,
    joins,
    clauses: {
      hasWhere,
      whereClause,
      hasGroupBy,
      groupByClause,
      hasHaving,
      havingClause,
      hasOrderBy,
      orderByClause,
      hasLimit,
      limitClause,
      hasDistinct,
      hasSubquery,
      hasCTE
    },
    aggregatesUsed,
    executionOrder,
    explanationSteps,
    estimatedComplexity,
    complexityReason,
    optimizationTips,
    indexingSuggestions,
    normalizationTips,
    queryStats: {
      totalLength: rawQuery.length,
      tablesCount: tables.length,
      joinsCount: joins.length,
      columnsCount: columns.length
    }
  };
}

function generateSqlSummary(queryType, tables, columns, joins, hasWhere, hasGroupBy, hasOrderBy, hasLimit) {
  const tableList = tables.map(t => `\`${t.name}\``).join(' and ');
  if (queryType.startsWith('SELECT')) {
    return `This query retrieves data from ${tableList || 'the database'}${joins.length > 0 ? ` by joining ${joins.length} related table(s)` : ''}${hasWhere ? ' matching specific search criteria' : ''}${hasGroupBy ? ' and groups summary statistics' : ''}${hasOrderBy ? ' sorted in ordered sequence' : ''}.`;
  }
  if (queryType.startsWith('INSERT')) {
    return `This query inserts new row record(s) into table ${tableList || 'the table'}.`;
  }
  if (queryType.startsWith('UPDATE')) {
    return `This query modifies existing records in table ${tableList || 'the table'}${hasWhere ? ' satisfying the WHERE condition' : ' (caution: updates all rows without WHERE)'}.`;
  }
  if (queryType.startsWith('DELETE')) {
    return `This query removes records from table ${tableList || 'the table'}${hasWhere ? ' matching the WHERE condition' : ' (caution: deletes all rows without WHERE)'}.`;
  }
  return `This query executes a ${queryType} command on the database.`;
}
