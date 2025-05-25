import { useState, useEffect, useRef } from "react";
import { getProjects } from "../../services/projects/ProjectService";
import { PaginatedResponse } from "../../types/paginated";
import { Project } from "../../types/project";
import { ProjectCard } from "./ProjectCard";
import { FaPlus, FaTimesCircle, FaChevronDown } from "react-icons/fa";
import { transferApiQueryParams } from "../../utils/api";
import { getPaginationInfo } from "../../utils/pagination";
import { useAuth } from "../../providers/AuthProvider";

export function ProjectsList() {
  const [projectsData, setProjectsData] =
    useState<PaginatedResponse<Project> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getUserId } = useAuth();
  const [activeOwnerFilter, setActiveOwnerFilter] = useState<string>("Anyone");
  const [userSearchInput, setUserSearchInput] = useState<string>("");
  const [filteredUserOptions, setFilteredUserOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userOptions = [
    { value: "User 1", label: "User 1" },
    { value: "User 2", label: "User 2" },
    { value: "Another User", label: "Another User" },
  ];

  useEffect(() => {
    const queryParams = window.location.search || "?page=0";

    handlePageChange(queryParams);
  }, [activeOwnerFilter]);

  const handleUserSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setUserSearchInput(searchTerm);
    if (searchTerm.trim() === "") {
      setFilteredUserOptions([]);
    } else {
      setFilteredUserOptions(
        userOptions.filter((user) =>
          user.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  const handleFilterSelect = (filterValue: string) => {
    if (activeOwnerFilter === filterValue) {
      setActiveOwnerFilter("Anyone");
    } else {
      setActiveOwnerFilter(filterValue);
    }
    setUserSearchInput("");
    setFilteredUserOptions([]);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handlePageChange = async (url: string) => {
    const userId = getUserId();
    if (!userId) {
      setError("User not authenticated");
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const newUrl = transferApiQueryParams(url, window.location.href);
      if (newUrl !== window.location.href) {
        window.history.replaceState({}, "", newUrl);
      }

      const data = await getProjects(userId, url /*, activeOwnerFilter */);
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
        <FaTimesCircle className="shrink-0 h-6 w-6" />
        <span>Error! {error}</span>
      </div>
    );
  }

  const pagination = projectsData ? getPaginationInfo(projectsData) : null;

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search projects..."
            className="input input-bordered w-full max-w-xs"
          />
          <div className="dropdown" ref={dropdownRef}>
            <button
              tabIndex={0}
              role="button"
              className={`btn text-nowrap ${
                activeOwnerFilter !== "Anyone"
                  ? "btn-soft border-accent border-1 btn-accent"
                  : ""
              }`}
            >
              {userOptions.find((u) => u.value === activeOwnerFilter)?.label ||
                activeOwnerFilter}
              <FaChevronDown className="w-4 h-4 ml-2" />
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-60 z-50"
            >
              {userOptions.some((u) => u.value === activeOwnerFilter) ? (
                <li key="active-user-filter">
                  <button
                    className={`w-full justify-start btn btn-sm ${
                      activeOwnerFilter !== "Anyone"
                        ? "btn-soft border-accent border-1 btn-accent"
                        : "btn-ghost"
                    }`}
                    onClick={() => handleFilterSelect(activeOwnerFilter)}
                  >
                    {userOptions.find((u) => u.value === activeOwnerFilter)
                      ?.label || activeOwnerFilter}
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <div className="p-1">
                      <input
                        type="text"
                        placeholder="Filter by user..."
                        className="input input-bordered input-sm w-full"
                        value={userSearchInput}
                        onChange={handleUserSearchChange}
                      />
                    </div>
                  </li>
                  {userSearchInput && filteredUserOptions.length === 0 && (
                    <li className="menu-title px-4 py-2 text-sm">
                      <span>No users found</span>
                    </li>
                  )}
                  {filteredUserOptions.map((user) => (
                    <li key={user.value}>
                      <button
                        className={`w-full text-left py-2 px-3 rounded justify-start btn btn-ghost btn-sm`}
                        onClick={() => handleFilterSelect(user.value)}
                      >
                        {user.label}
                      </button>
                    </li>
                  ))}
                </>
              )}

              {!userOptions.some((u) => u.value === activeOwnerFilter) &&
                userSearchInput &&
                filteredUserOptions.length > 0 && (
                  <li className="menu-title px-1 pt-2">
                    <span className="border-t border-base-300 block"></span>
                  </li>
                )}

              <li>
                <button
                  className={`w-full justify-start btn btn-sm ${
                    activeOwnerFilter === "Shared with me"
                      ? "btn-soft border-accent border-1 btn-accent"
                      : "btn-ghost"
                  }`}
                  onClick={() => handleFilterSelect("Shared with me")}
                >
                  Shared with me
                </button>
              </li>
              <li>
                <button
                  className={`w-full justify-start btn btn-sm ${
                    activeOwnerFilter === "My own projects"
                      ? "btn-soft border-accent border-1 btn-accent"
                      : "btn-ghost"
                  }`}
                  onClick={() => handleFilterSelect("My own projects")}
                >
                  My own projects
                </button>
              </li>
            </ul>
          </div>
        </div>
        <button className="btn btn-success w-full sm:w-auto">
          <FaPlus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : projectsData && projectsData.content.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            {projectsData.content.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <div className="join">
                <button
                  className="join-item btn"
                  onClick={() => handlePageChange(pagination.prevPageQuery)}
                  disabled={!pagination.hasPrevious || loading}
                >
                  « Previous
                </button>
                <button className="join-item btn btn-disabled" tabIndex={-1}>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </button>
                <button
                  className="join-item btn"
                  onClick={() => handlePageChange(pagination.nextPageQuery)}
                  disabled={!pagination.hasNext || loading}
                >
                  Next »
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-lg text-base-content/70 py-8">
          No projects found.
        </p>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
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
  );
}
