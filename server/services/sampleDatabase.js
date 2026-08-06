/**
 * Realistic In-Memory Sample Database Service using SQL.js (WebAssembly SQLite)
 * Provides pre-seeded multi-table schemas for live SQL execution & schema introspection.
 */

import initSqlJs from 'sql.js';

let dbInstance = null;
let SQL = null;

export async function getDatabase() {
  if (dbInstance) return dbInstance;

  if (!SQL) {
    SQL = await initSqlJs();
  }

  dbInstance = new SQL.Database();
  seedDatabase(dbInstance);
  return dbInstance;
}

function seedDatabase(db) {
  // 1. Company HR Schema
  db.run(`
    CREATE TABLE departments (
      dept_id INTEGER PRIMARY KEY,
      dept_name TEXT NOT NULL,
      location TEXT NOT NULL,
      budget REAL NOT NULL
    );

    INSERT INTO departments (dept_id, dept_name, location, budget) VALUES
      (1, 'Engineering', 'San Francisco', 500000),
      (2, 'Data Science', 'New York', 420000),
      (3, 'Marketing', 'Chicago', 250000),
      (4, 'Human Resources', 'Austin', 180000),
      (5, 'Product Design', 'Seattle', 310000);

    CREATE TABLE employees (
      emp_id INTEGER PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      hire_date TEXT NOT NULL,
      salary REAL NOT NULL,
      dept_id INTEGER,
      manager_id INTEGER,
      FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
    );

    INSERT INTO employees (emp_id, first_name, last_name, email, hire_date, salary, dept_id, manager_id) VALUES
      (101, 'Alex', 'Rivera', 'alex.r@company.com', '2021-03-15', 125000, 1, NULL),
      (102, 'Sara', 'Chen', 'sara.c@company.com', '2020-07-01', 140000, 1, 101),
      (103, 'Marcus', 'Johnson', 'marcus.j@company.com', '2022-01-10', 95000, 1, 101),
      (104, 'Elena', 'Rostova', 'elena.r@company.com', '2019-11-20', 155000, 2, NULL),
      (105, 'David', 'Kim', 'david.k@company.com', '2022-05-18', 110000, 2, 104),
      (106, 'Priya', 'Patel', 'priya.p@company.com', '2021-09-01', 88000, 3, NULL),
      (107, 'Lucas', 'Silva', 'lucas.s@company.com', '2023-02-14', 72000, 3, 106),
      (108, 'Hannah', 'Schmidt', 'hannah.s@company.com', '2020-04-30', 82000, 4, NULL),
      (109, 'Tariq', 'Al-Mansoor', 'tariq.a@company.com', '2022-08-22', 105000, 5, NULL);

    CREATE TABLE projects (
      project_id INTEGER PRIMARY KEY,
      project_name TEXT NOT NULL,
      dept_id INTEGER,
      start_date TEXT,
      budget REAL,
      FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
    );

    INSERT INTO projects (project_id, project_name, dept_id, start_date, budget) VALUES
      (501, 'AI Code Assistant', 2, '2024-01-15', 150000),
      (502, 'Cloud Infrastructure Migration', 1, '2023-09-01', 220000),
      (503, 'Brand Reimagining Campaign', 3, '2024-03-01', 85000),
      (504, 'Design System 2.0', 5, '2024-02-10', 95000);

    CREATE TABLE employee_projects (
      emp_id INTEGER,
      project_id INTEGER,
      role TEXT,
      hours_logged INTEGER,
      PRIMARY KEY (emp_id, project_id),
      FOREIGN KEY (emp_id) REFERENCES employees(emp_id),
      FOREIGN KEY (project_id) REFERENCES projects(project_id)
    );

    INSERT INTO employee_projects (emp_id, project_id, role, hours_logged) VALUES
      (101, 502, 'Tech Lead', 140),
      (102, 502, 'Senior Backend Dev', 160),
      (104, 501, 'Lead Scientist', 180),
      (105, 501, 'ML Engineer', 150),
      (106, 503, 'Marketing Manager', 110),
      (109, 504, 'Lead UI Designer', 130);
  `);

  // 2. E-Commerce Schema
  db.run(`
    CREATE TABLE categories (
      category_id INTEGER PRIMARY KEY,
      category_name TEXT NOT NULL
    );

    INSERT INTO categories (category_id, category_name) VALUES
      (1, 'Electronics'),
      (2, 'Computers & Accessories'),
      (3, 'Audio & Sound'),
      (4, 'Wearables');

    CREATE TABLE products (
      product_id INTEGER PRIMARY KEY,
      product_name TEXT NOT NULL,
      category_id INTEGER,
      price REAL NOT NULL,
      stock_quantity INTEGER NOT NULL,
      rating REAL,
      FOREIGN KEY (category_id) REFERENCES categories(category_id)
    );

    INSERT INTO products (product_id, product_name, category_id, price, stock_quantity, rating) VALUES
      (201, 'UltraBook Pro 15', 2, 1299.99, 45, 4.8),
      (202, 'Wireless Noise-Canceling Headphones', 3, 249.99, 120, 4.7),
      (203, 'Mechanical RGB Keyboard', 2, 119.50, 85, 4.6),
      (204, 'Smart Fitness Watch X', 4, 199.99, 60, 4.4),
      (205, '4K Ultra Gaming Monitor 27"', 1, 450.00, 30, 4.9),
      (206, 'Ergonomic Vertical Mouse', 2, 59.99, 150, 4.3);

    CREATE TABLE customers (
      customer_id INTEGER PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      city TEXT,
      country TEXT
    );

    INSERT INTO customers (customer_id, full_name, email, city, country) VALUES
      (301, 'John Doe', 'john.doe@email.com', 'Seattle', 'USA'),
      (302, 'Amina Yusuf', 'amina.y@email.com', 'London', 'UK'),
      (303, 'Kenji Sato', 'kenji.s@email.com', 'Tokyo', 'Japan'),
      (304, 'Carlos Mendez', 'carlos.m@email.com', 'Madrid', 'Spain'),
      (305, 'Sophie Martin', 'sophie.m@email.com', 'Paris', 'France');

    CREATE TABLE orders (
      order_id INTEGER PRIMARY KEY,
      customer_id INTEGER,
      order_date TEXT NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    );

    INSERT INTO orders (order_id, customer_id, order_date, total_amount, status) VALUES
      (1001, 301, '2024-04-01', 1549.98, 'Delivered'),
      (1002, 302, '2024-04-05', 249.99, 'Delivered'),
      (1003, 303, '2024-04-10', 509.99, 'Processing'),
      (1004, 301, '2024-04-18', 119.50, 'Shipped'),
      (1005, 305, '2024-04-20', 1299.99, 'Delivered');
  `);

  // 3. University / Students Schema
  db.run(`
    CREATE TABLE students (
      student_id INTEGER PRIMARY KEY,
      full_name TEXT NOT NULL,
      major TEXT NOT NULL,
      gpa REAL NOT NULL,
      enrollment_year INTEGER NOT NULL
    );

    INSERT INTO students (student_id, full_name, major, gpa, enrollment_year) VALUES
      (1, 'Alice Walker', 'Computer Science', 3.92, 2022),
      (2, 'Bob Sterling', 'Data Analytics', 3.65, 2021),
      (3, 'Chloe Bennett', 'Computer Science', 3.88, 2023),
      (4, 'Daniel Thorne', 'Electrical Engineering', 3.42, 2022),
      (5, 'Emily Zhao', 'Information Systems', 3.75, 2021);

    CREATE TABLE courses (
      course_id TEXT PRIMARY KEY,
      course_title TEXT NOT NULL,
      credits INTEGER NOT NULL,
      instructor TEXT NOT NULL
    );

    INSERT INTO courses (course_id, course_title, credits, instructor) VALUES
      ('CS101', 'Intro to Data Structures & C++', 4, 'Dr. Alan Turing'),
      ('CS202', 'Relational Databases & SQL', 3, 'Dr. Edgar Codd'),
      ('CS303', 'Algorithms & Complexity', 4, 'Dr. Donald Knuth'),
      ('DS201', 'Statistical Machine Learning', 3, 'Dr. Judea Pearl');

    CREATE TABLE enrollments (
      enrollment_id INTEGER PRIMARY KEY,
      student_id INTEGER,
      course_id TEXT,
      semester TEXT,
      grade TEXT,
      FOREIGN KEY (student_id) REFERENCES students(student_id),
      FOREIGN KEY (course_id) REFERENCES courses(course_id)
    );

    INSERT INTO enrollments (enrollment_id, student_id, course_id, semester, grade) VALUES
      (1, 1, 'CS101', 'Fall 2023', 'A'),
      (2, 1, 'CS202', 'Spring 2024', 'A'),
      (3, 2, 'CS202', 'Spring 2024', 'B+'),
      (4, 3, 'CS101', 'Fall 2023', 'A-'),
      (5, 4, 'CS303', 'Spring 2024', 'B'),
      (6, 5, 'DS201', 'Spring 2024', 'A');
  `);
}

/**
 * Execute SQL Query and return column names, row values, and execution metrics
 */
export async function executeSqlQuery(sql) {
  const db = await getDatabase();
  const startTime = process.hrtime.bigint();

  try {
    const results = db.exec(sql);
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1e6;

    if (results.length === 0) {
      return {
        success: true,
        message: 'Query executed successfully with 0 result sets (DML/DDL command applied).',
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: durationMs.toFixed(2)
      };
    }

    const firstResult = results[0];
    const columns = firstResult.columns;
    const rows = firstResult.values;

    return {
      success: true,
      columns,
      rows,
      rowCount: rows.length,
      executionTimeMs: durationMs.toFixed(2)
    };
  } catch (err) {
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1e6;

    return {
      success: false,
      error: err.message,
      executionTimeMs: durationMs.toFixed(2)
    };
  }
}

/**
 * Return schema introspection for the UI Schema Explorer
 */
export async function getSchemaOverview() {
  const db = await getDatabase();
  const tablesRes = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
  
  if (tablesRes.length === 0) return { schemas: [] };

  const tableNames = tablesRes[0].values.map(r => r[0]);
  const schemaDetails = [];

  for (const tableName of tableNames) {
    const infoRes = db.exec(`PRAGMA table_info(${tableName});`);
    const columns = infoRes.length > 0 ? infoRes[0].values.map(col => ({
      cid: col[0],
      name: col[1],
      type: col[2],
      notnull: col[3] === 1,
      defaultValue: col[4],
      isPk: col[5] === 1
    })) : [];

    const sampleRes = db.exec(`SELECT * FROM ${tableName} LIMIT 4;`);
    const sampleRows = sampleRes.length > 0 ? {
      columns: sampleRes[0].columns,
      rows: sampleRes[0].values
    } : { columns: [], rows: [] };

    schemaDetails.push({
      tableName,
      columns,
      sampleRows
    });
  }

  return {
    success: true,
    tables: schemaDetails
  };
}
