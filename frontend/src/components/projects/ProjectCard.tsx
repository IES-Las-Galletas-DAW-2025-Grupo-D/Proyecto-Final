import { Link } from "react-router";
import { Project } from "../../types/project";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      to={project.id.toString()}
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
      role="button"
      tabIndex={0}
    >
      <div className="card-body">
        <h2 className="card-title">{project.name}</h2>
        <p>{project.description}</p>
      </div>
    </Link>
  );
}
