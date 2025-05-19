import { ProjectsList } from "../../components/projects/ProjectsList";
import { Island } from "../../components/ui/containers/section/Island";

export function ProjectsListPage() {
  return (
    <Island>
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <p className="text-base-content/70">
        Here you can manage your projects and tasks.
      </p>
      <div className="divider my-6"></div>
      <ProjectsList />
    </Island>
  );
}