const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }

    updateTask(taskId, updatedTask) {
        const index = this.tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            this.tasks[index] = updatedTask;
        }
    }

    removeTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
    }

    getTask(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }

    getAllTasks() {
        return this.tasks;
    }
}

const app = express();
app.use(cors());
const taskManager = new TaskManager();

app.use(bodyParser.json());

// Create
app.post('/tasks', (req, res) => {
    const task = req.body;
    taskManager.addTask(task);
    res.status(201).send(task);
});

// Read all 
app.get('/tasks', (req, res) => {
    res.send(taskManager.getAllTasks());
});

// Read single by ID
app.get('/tasks/:id', (req, res) => {
    const task = taskManager.getTask(req.params.id);
    if (task) {
        res.send(task);
    } else {
        res.status(404).send({ error: 'Task not found' });
    }
});

// Update by ID
app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const updatedTask = req.body;
    if (taskManager.getTask(taskId)) {
        updatedTask.id = taskId;  
        taskManager.updateTask(taskId, updatedTask);
        res.send(updatedTask);
    } else {
        res.status(404).send({ error: 'Task not found' });
    }
});

// Delete by ID
app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    if (taskManager.getTask(taskId)) {
        taskManager.removeTask(taskId);
        res.status(204).send();
    } else {
        res.status(404).send({ error: 'Task not found' });
    }
});

const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
