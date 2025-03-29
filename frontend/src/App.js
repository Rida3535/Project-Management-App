import "./App.css";
import React, { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "https://project-management-app-production-ef9d.up.railway.app";

function App() {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState("");
    const [error, setError] = useState("");
    const [refreshMessage, setRefreshMessage] = useState(false);

    // ✅ Load projects from localStorage
    useEffect(() => {
        const storedProjects = localStorage.getItem("projects");
        if (storedProjects) {
            setProjects(JSON.parse(storedProjects));
        }
        fetchProjects();
    }, []);

    // ✅ Fetch projects from backend and save to localStorage
    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_URL}/api/projects`);
            const data = await response.json();
            setProjects(data.projects);
            localStorage.setItem("projects", JSON.stringify(data.projects)); // ✅ Save to localStorage
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

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
                setProjects(updatedProjects);
                localStorage.setItem("projects", JSON.stringify(updatedProjects)); // ✅ Save new project to localStorage
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

    const deleteProject = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/projects/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();
            if (data.status === "success") {
                const updatedProjects = projects.filter((proj) => proj.id !== id);
                setProjects(updatedProjects);
                localStorage.setItem("projects", JSON.stringify(updatedProjects)); // ✅ Update localStorage
            }
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

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

                {/* Input text box */}
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Enter project name..."
                        value={newProject}
                        onChange={(e) => setNewProject(e.target.value)}
                        onKeyDown={handleKeyPress} // Pressing Enter adds project
                        className="project-input"
                    />
                </div>

                {/* Buttons (Add Project & Refresh Projects) */}
                <div className="button-container">
                    <button onClick={addProject} className="add-btn">Add Project</button>
                    <button onClick={refreshProjects} className="refresh-btn">Refresh Projects</button>
                </div>

                {error && <p className="error">{error}</p>}
                {refreshMessage && <p className="refresh-message">Projects list refreshed</p>} {/* Added success message */}

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
