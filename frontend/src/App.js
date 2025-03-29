import "./App.css";
import React, { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "https://project-management-app-production-ef9d.up.railway.app";

function App() {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState("");
    const [error, setError] = useState("");
    const [refreshMessage, setRefreshMessage] = useState(false);

    // ✅ Load projects from localStorage (initially)
    useEffect(() => {
        const storedProjects = localStorage.getItem("projects");
        if (storedProjects) {
            setProjects(JSON.parse(storedProjects));
        }
    }, []);

    // ✅ Save to Local Storage
    const updateLocalStorage = (updatedProjects) => {
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
        setProjects(updatedProjects);
    };

    // ✅ Fetch projects from backend and store in localStorage (only when refreshed)
    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_URL}/api/projects`);
            const data = await response.json();

            updateLocalStorage(data.projects); // ✅ Sync with local storage
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    // ✅ Add project (updates both local storage & backend)
    const addProject = async () => {
        if (newProject.trim().length < 3) {
            setError("Project name must be at least 3 characters");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/projects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newProject.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                const updatedProjects = [...projects, data.project];
                updateLocalStorage(updatedProjects); // ✅ Update local storage
                setNewProject("");
                setError("");
            } else {
                setError(data.message || "Failed to add project");
            }
        } catch (error) {
            console.error("Failed to add project:", error);
            setError("Could not connect to the server");
        }
    };

    // ✅ Delete project (updates both local storage & backend)
    const deleteProject = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/projects/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();
            if (data.status === "success") {
                const updatedProjects = projects.filter((proj) => proj.id !== id);
                updateLocalStorage(updatedProjects); // ✅ Update local storage
            }
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    // ✅ Refresh projects (sync with backend)
    const refreshProjects = async () => {
        await fetchProjects();
        setError("");
        setNewProject("");
        setRefreshMessage(true);

        setTimeout(() => {
            setRefreshMessage(false);
        }, 3000);
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
