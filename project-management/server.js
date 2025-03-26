const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

// ✅ CORS Configuration (Optimized)
app.use(cors({
    origin: "*",
    methods: "GET, POST, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
}));

// ✅ Middleware for CORS Preflight Requests
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

// ✅ In-memory projects array
let projects = [];

// ✅ Homepage Route
app.get('/', (req, res) => {
    res.send("Welcome to the Project Management API!");
});

// ✅ Get Total Projects Count
app.get('/api/projects/count', (req, res) => {
    res.json({ total: projects.length });
});

// ✅ Get All Projects
app.get('/api/projects', (req, res) => {
    res.json({ status: "success", projects });
});

// ✅ Add a New Project (with Validation)
app.post('/api/projects', (req, res) => {
    const { name } = req.body;

    if (!name || name.length < 3) {
        return res.status(400).json({ status: "error", message: "Project name must be at least 3 characters" });
    }

    if (projects.some(proj => proj.name.toLowerCase() === name.toLowerCase())) {
        return res.status(400).json({ status: "error", message: "Project name must be unique" });
    }

    // ✅ Generate unique ID
    const newProject = { id: Date.now(), name };
    projects.push(newProject);
    
    res.status(201).json({ status: "success", project: newProject });
});

// ✅ Delete a Project (Improved)
app.delete('/api/projects/:id', (req, res) => {
    const projectId = parseInt(req.params.id);
    const index = projects.findIndex(proj => proj.id === projectId);

    if (index === -1) {
        return res.status(404).json({ status: "error", message: "Project not found" });
    }

    const deletedProject = projects.splice(index, 1)[0];
    res.json({ status: "success", deleted: deletedProject });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
