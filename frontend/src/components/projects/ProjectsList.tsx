import { useState, useEffect } from "react";
import { getProjects } from "../../services/projects/ProjectService";
import { PaginatedResponse } from "../../types/paginated";
import { Project } from "../../types/project";
import { ProjectCard } from "./ProjectCard"; // Import ProjectCard

export function ProjectsList() {
  const [projectsData, setProjectsData] =
    useState<PaginatedResponse<Project> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async (url?: string) => {
      try {
        setLoading(true);
        const data = await getProjects(url);
        setProjectsData(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setProjectsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handlePageChange = async (url: string | null) => {
    if (!url || loading) return;
    setLoading(true);
    try {
      const data = await getProjects(url);
      setProjectsData(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div role="alert" className="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Error! {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {loading ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <div className="skeleton h-6 w-3/4 mb-2"></div>
                  <div className="skeleton h-4 w-full mb-1"></div>
                  <div className="skeleton h-4 w-5/6 mb-4"></div>
                  <div className="skeleton h-8 w-1/3 self-end"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="join">
              <div className="skeleton btn join-item h-12 w-24"></div>
              <div className="skeleton btn join-item h-12 w-24"></div>
            </div>
          </div>
        </div>
      ) : projectsData && projectsData.data.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            {projectsData.data.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {projectsData.last_page > 1 && (
            <div className="flex justify-center mt-4">
              <div className="join">
                <button
                  className="join-item btn"
                  onClick={() => handlePageChange(projectsData.prev_page_url)}
                  disabled={!projectsData.prev_page_url || loading}
                >
                  « Previous
                </button>
                <button className="join-item btn btn-disabled" tabIndex={-1}>
                  Page {projectsData.current_page} of {projectsData.last_page}
                </button>
                <button
                  className="join-item btn"
                  onClick={() => handlePageChange(projectsData.next_page_url)}
                  disabled={!projectsData.next_page_url || loading}
                >
                  Next »
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-lg text-base-content/70 py-8">No projects found.</p>
      )}
    </div>
  );
}
