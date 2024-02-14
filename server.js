const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let taskId = 0;
const tasks = [];

// Crear una nueva tarea
app.post('/tasks', (req, res) => {
    const { title, description, completed = false } = req.body;
    const newTask = { id: ++taskId, title, description, completed, createdAt: new Date() };
    tasks.push(newTask);
    res.status(201).send(newTask);
});

// Leer todas las tareas
app.get('/tasks', (req, res) => {
    res.send(tasks);
});

// Leer una tarea específica por su ID
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('Task not found.');
    res.send(task);
});

// Actualizar una tarea existente
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('Task not found.');

    const { title, description, completed } = req.body;
    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed !== undefined ? completed : task.completed;

    res.send(task);
});

// Eliminar una tarea por su ID
app.delete('/tasks/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('Task not found.');

    const deletedTask = tasks.splice(index, 1);
    res.send(deletedTask);
});

// Estadísticas de las tareas
app.get('/tasks/stats', (req, res) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const mostRecentTask = tasks.reduce((a, b) => (new Date(a.createdAt) > new Date(b.createdAt) ? a : b), {});
    const oldestTask = tasks.reduce((a, b) => (new Date(a.createdAt) < new Date(b.createdAt) ? a : b), {});

    res.send({
        totalTasks,
        completedTasks,
        pendingTasks,
        mostRecentTask: mostRecentTask.createdAt ? mostRecentTask : 'No tasks found',
        oldestTask: oldestTask.createdAt ? oldestTask : 'No tasks found',
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});