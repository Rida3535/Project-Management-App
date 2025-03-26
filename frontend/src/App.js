import "./App.css";
import React, { useState, useEffect } from "react";

const API_URL = "https://project-manager-eight-delta.vercel.app";

function App() {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState("");
    const [error, setError] = useState("");
    const [refreshMessage, setRefreshMessage] = useState(false); // Added missing state

    // Fetch projects from backend
    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_URL}/api/projects`);
            const data = await response.json();

            if (!Array.isArray(data.projects)) {
                console.error("Invalid response format:", data);
                setProjects([]);
                return;
            }
            setProjects(data.projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

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
            console.log("Server Response:", data);  // ✅ Debugging log

            if (response.ok) {  // ✅ Check if request was successful
                setNewProject("");
                setError("");
                fetchProjects();  // Fetch updated projects
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
                setProjects(projects.filter((proj) => proj.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    const refreshProjects = async () => {
        await fetchProjects();
        setError(""); setNewProject("");
        setRefreshMessage(true); // Show refresh message

        // Hide the message after 3 seconds
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
