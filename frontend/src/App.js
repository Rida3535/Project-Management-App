import "./App.css";
import React, { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "https://project-management-app-production-ef9d.up.railway.app";

function App() {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState("");
    const [error, setError] = useState("");
    const [refreshMessage, setRefreshMessage] = useState(false);

    // ✅ Load projects from localStorage (No Backend)
    useEffect(() => {
        const storedProjects = localStorage.getItem("projects");
        if (storedProjects) {
            setProjects(JSON.parse(storedProjects));
        }
    }, []);

    // ✅ Save projects to localStorage
    const updateLocalStorage = (updatedProjects) => {
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
        setProjects(updatedProjects);
    };

    // ✅ Add project (No Backend, Only Local Storage)
    const addProject = () => {
        if (newProject.trim().length < 3) {
            setError("Project name must be at least 3 characters");
            return;
        }

        const newProj = { id: Date.now(), name: newProject.trim() }; // Unique ID using timestamp
        const updatedProjects = [...projects, newProj];

        updateLocalStorage(updatedProjects); // ✅ Local Storage Update
        setNewProject("");
        setError("");
    };

    // ✅ Delete project (No Backend, Only Local Storage)
    const deleteProject = (id) => {
        const updatedProjects = projects.filter((proj) => proj.id !== id);
        updateLocalStorage(updatedProjects); // ✅ Local Storage Update
    };

    // ✅ Refresh Projects (No Backend, Only Reset from Local Storage)
    const refreshProjects = () => {
        const storedProjects = localStorage.getItem("projects");
        if (storedProjects) {
            setProjects(JSON.parse(storedProjects));
        }
        setError("");
        setNewProject("");
        setRefreshMessage(true);
        setTimeout(() => setRefreshMessage(false), 3000);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            addProject();
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>
                    <span className="icon">⚙️</span> Project Manager
                </h1>

                <h2>Total Projects: <span className="count">{projects.length}</span></h2>

                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Enter project name..."
                        value={newProject}
                        onChange={(e) => setNewProject(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="project-input"
                    />
                </div>

                <div className="button-container">
                    <button onClick={addProject} className="add-btn">Add Project</button>
                    <button onClick={refreshProjects} className="refresh-btn">Refresh Projects</button>
                </div>

                {error && <p className="error">{error}</p>}
                {refreshMessage && <p className="refresh-message">Projects list refreshed</p>}

                <div className="project-list">
                    {projects.length === 0 ? (
                        <p>No projects found.</p>
                    ) : (
                        projects.map((project) => (
                            <div key={project.id} className="project-card">
                                <span>{project.name}</span>
                                <button onClick={() => deleteProject(project.id)} className="delete-btn">🗑</button>
                            </div>
                        ))
                    )}
                </div>
            </header>
        </div>
    );
}

export default App;
