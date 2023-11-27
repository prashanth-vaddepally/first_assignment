const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbpath = path.join(__dirname, "todoApplication.db");
const app = express();
app.use(express.json());

const db = null;

const intialiazerDBSaver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("server running at http://localhost:3000/")
    );
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
intialiazerDBSaver();

const onefunction = (requestQuery) => {
  return requestQuery.status !== undefined;
};
const twofunction = (requestQuery) => {
  return requestQuery.priority !== undefined;
};
const threefunction = (requestQuery) => {
  return (
    requestQuery.status !== undefined && requestQuery.priority !== undefined
  );
};
const fourfunction = (requestQuery) => {
  return requestQuery.category !== undefined;
};
const fivefunction = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  );
};
const sixfunction = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  );
};

app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodoQuery = "";
  const { search_q = "", status, priority, category } = request.query;
  switch (true) {
    case onefunction(request.query):
      getTodoQuery = `
         SELECT * FROM todo 
         WHERE todo LIKE '%${search_q}%'
         AND status = '${status}';`;
      break;
    case twofunction(request.query):
      getTodoQuery = `
            SELECT * FROM todo
            WHERE todo LIKE '%${search_q}%'
            AND priority = '${priority}';`;
      break;
    case threefunction(request.query):
      getTodoQuery = `
            SELECT * FROM todo
            WHERE todo LIKE '%${search_q}%'
            AND priority = '${priority}'
            AND status = '${status}';`;
      break;
    case fourfunction(request.query):
      getTodoQuery = `
            SELECT * FROM todo
            WHERE todo LIKE '%${search_q}%'
            AND category = '${category}';`;
      break;
    case fivefunction(request.query):
      getTodoQuery = `
            SELECT * FROM todo
            WHERE todo LIKE '%${search_q}%'
            AND category = '${category}'
            AND status = '${status}';`;
      break;
    case sixfunction(request.query):
      getTodoQuery = `
            SELECT * FROM todo
            WHERE todo LIKE '%${search_q}%'
            AND category = '${category}'
            AND priority = '${priority}';`;
      break;
    default:
      getTodoQuery = `
                SELECT * FROM todo 
                WHERE todo LIKE '%${search_q}%';`;
  }
  data = await db.all(getTodoQuery);
  response.send(data);
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `
    SELECT * FROM todo
    WHERE id = ${todoId};`;
  const todo = await db.get(getTodoQuery);
  response.send(todo);
});

app.get("/agenda/", async (request, response) => {
  const { dueDate } = request.query;
  const getTodoQuery = `
    SELECT * FROM todo
    WHERE due_date = ${dueDate};`;
  const todo = await db.get(getTodoQuery);
  response.send(todo);
});

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  const getQuery = `
    INSERT INTO todo
    VALUES (id, todo, priority, status, category, due_date)
    VALUES(
        id = ${id},
        todo = '${todo}',
        priority = '${priority}',
        status = '${status}',
        category = '${category}',
        due_date = ${dueDate}
        );`;
  await db.run(getQuery);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let updateColumn = "";
  const requestBody = request.body;
  switch (true) {
    case requestBody.status !== undefined:
      updateColumn = "Status";
      break;
    case requestBody.priority !== undefined:
      updateColumn = "Priority";
      break;
    case requestBody.todo !== undefined:
      updateColumn = "Todo";
      break;
    case requestBody.category !== undefined:
      updateColumn = "Category";
      break;
    case requestBody.dueDate !== undefined:
      updateColumn = "Due Date";
      break;
  }
  const previousTodoQuery = `
    SELECT
      *
    FROM
      todo
    WHERE 
      id = ${todoId};`;
  const previousTodo = await database.get(previousTodoQuery);

  const {
    todo = previousTodo.todo,
    status = previousTodo.status,
    priority = previousTodo.priority,
    category = previousTodo.category,
    dueDate = previousTodo.dueDate,
  } = request.body;

  const updateQuery = `
UPDATE todo
SET todo = '${todo}',
status = '${status}',
priority = '${priority}',
category = '${category}',
due_date = ${dueDate}
WHERE 
id = ${todoId};`;
  await db.run(updateQuery);
  response.send(`${updateColumn} updated`);
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getQuery = `
    DELETE FROM todo
    WHERE id = ${todoId};`;
  await db.run(getQuery);
  response.send("Todo Deleted");
});

module.exports = app;
