import { useState, useRef, useEffect } from "react";
import { inviteToProject } from "../../services/projects/ProjectService";
import { getUserByUsername } from "../../services/users/UserService";
import { debounce } from "../../utils/debounce";
import {
  FaUserPlus,
  FaSearch,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { ProjectRole } from "../../types/projectRole.enum";

interface InviteUserFormProps {
  projectId: number;
  onInviteSuccess?: () => void;
}

export function InviteUserForm({
  projectId,
  onInviteSuccess,
}: InviteUserFormProps) {
  const [username, setUsername] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>(
    ProjectRole.ROLE_PROJECT_VIEWER
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  const roleOptions = [
    { value: ProjectRole.ROLE_PROJECT_VIEWER, label: "Viewer" },
    { value: ProjectRole.ROLE_PROJECT_CONTRIBUTOR, label: "Contributor" },
    { value: ProjectRole.ROLE_PROJECT_MANAGER, label: "Manager" },
  ];

  const searchUser = debounce(async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const user = await getUserByUsername(query);
      setSearchResults(user ? [user] : []);
    } catch (err) {
      console.error("Error searching users:", err);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, 500);

  useEffect(() => {
    if (username && !selectedUser) {
      searchUser(username);
    }
  }, [username]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setSelectedUser(null);
    setError(null);
  };

  const selectUser = (user: any) => {
    setSelectedUser(user);
    setUsername(user.username);
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) {
      setError("Please select a valid user");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await inviteToProject(selectedUser.id, projectId, selectedRole);

      setSuccess(true);
      setSelectedUser(null);
      setUsername("");
      setSelectedRole(ProjectRole.ROLE_PROJECT_VIEWER);

      if (onInviteSuccess) {
        onInviteSuccess();
      }

      setTimeout(() => {
        setSuccess(false);
        closeModal();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to invite user");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }

    setUsername("");
    setSelectedUser(null);
    setSelectedRole(ProjectRole.ROLE_PROJECT_VIEWER);
    setError(null);
    setSuccess(false);
  };

  return (
    <>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Invite User to Project</h3>

          {success ? (
            <div role="alert" className="alert alert-success">
              <FaCheckCircle className="stroke-current shrink-0 h-6 w-6" />
              <span>User invited successfully!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div role="alert" className="alert alert-error mb-4">
                  <FaTimesCircle className="shrink-0 h-6 w-6" />
                  <span>{error}</span>
                </div>
              )}

              <div className="mb-4">
                <label className="label pb-1">
                  <span className="label-text">Username</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2 items-center">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by exact username"
                      className="input input-bordered input-sm w-full pr-10"
                      value={username}
                      onChange={handleUsernameChange}
                      disabled={!!selectedUser}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {isLoading && !selectedUser ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <FaSearch className="h-4 w-4 text-base-content/40" />
                      )}
                    </div>
                  </div>

                  <div className="h-[2.5rem] flex items-center">
                    {selectedUser ? (
                      <div className="card card-bordered card-compact bg-base-200 w-full h-full flex flex-row items-center px-3 py-0">
                        <div className="avatar mr-2">
                          <div className="w-6 h-6 rounded-full">
                            <img
                              src={
                                selectedUser.avatar ||
                                `https://api.dicebear.com/9.x/initials/svg?seed=${selectedUser.username}`
                              }
                              alt={selectedUser.username}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium truncate flex-grow">
                          {selectedUser.username}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUser(null);
                            setUsername("");
                            setSearchResults([]);
                          }}
                          className="btn btn-ghost btn-xs btn-circle ml-1"
                          aria-label="Clear selected user"
                        >
                          <FaTimesCircle />
                        </button>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => selectUser(searchResults[0])}
                        className="btn btn-ghost bg-base-200 hover:bg-base-300 w-full h-full flex items-center justify-start px-3 text-left card-compact"
                      >
                        <div className="avatar mr-2">
                          <div className="w-6 h-6 rounded-full">
                            <img
                              src={
                                searchResults[0].avatar ||
                                `https://api.dicebear.com/9.x/initials/svg?seed=${searchResults[0].username}`
                              }
                              alt={searchResults[0].username}
                            />
                          </div>
                        </div>
                        <span className="text-sm truncate flex-grow">
                          {searchResults[0].username}
                        </span>
                      </button>
                    ) : (
                      <div className="border border-base-300 rounded-btn bg-base-100 w-full h-full flex items-center justify-center px-3">
                        <span className="text-xs text-base-content/60 italic truncate">
                          {username.length > 0 &&
                          username.length < 3 &&
                          !isLoading
                            ? "Minimum 3 characters"
                            : "User details appear here"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-control mb-6">
                <label className="label pb-1">
                  <span className="label-text">Assign Role</span>
                </label>
                <select
                  className="select select-bordered select-sm w-full"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  disabled={!selectedUser}
                >
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-action">
                <button type="button" className="btn" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!selectedUser || isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <FaUserPlus className="mr-2" />
                      Invite User
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>

      <button
        onClick={openModal}
        className="btn btn-ghost"
        aria-label="Invite users"
      >
        <FaUserPlus className="h-5 w-5" />
        <span className="ml-2">Invite</span>
      </button>
    </>
  );
}
