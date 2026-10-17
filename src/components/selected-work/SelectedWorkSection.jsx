import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Github,
  Globe,
  MoveUpRight,
  X,
} from "lucide-react";
import { practices } from "../../data/practices.js";
import "./selected-work.css";

function getPageFromLocation() {
  const match = window.location.pathname.match(/^\/practices\/([^/]+)\/?$/);
  if (!match) return { type: "practices" };

  const practice = practices.find((item) => item.id === match[1]);
  if (!practice) return { type: "practices" };

  const projectId = new URLSearchParams(window.location.search).get("project");
  const selectedProject = practice.projects.find(
    (project) => project.id === projectId,
  );
  return { type: "practice", practice, selectedProject };
}

function practiceHref(practice) {
  return `/practices/${practice.id}`;
}

function PracticeCard({ practice, onNavigate }) {
  const Icon = practice.icon;
  const href = practiceHref(practice);

  return (
    <a
      className="work-domain-card"
      href={href}
      onClick={(event) => onNavigate(event, href)}
    >
      <span className="work-domain-card-top">
        <span>{practice.number} / PRACTICE</span>
        <ArrowUpRight size={17} aria-hidden="true" />
      </span>
      <span className="work-domain-icon">
        <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <strong>{practice.name}</strong>
      <span className="work-domain-description">{practice.description}</span>
      <span className="work-domain-card-footer">
        <span className="work-domain-count">
          {practice.projects.length}{" "}
          {practice.projects.length === 1 ? "PROJECT" : "PROJECTS"}
        </span>
        <span className="work-domain-explore">
          Explore projects <MoveUpRight size={14} aria-hidden="true" />
        </span>
      </span>
    </a>
  );
}

function ProjectCard({ practice, project, index, onOpen }) {
  const Icon = practice.icon;

  return (
    <article className="work-project-card">
      <button
        className="work-project-card-main"
        type="button"
        data-project-id={project.id}
        onClick={() => onOpen(project)}
        aria-label={`Open details for ${project.name}`}
      >
        <span className="work-project-art" aria-hidden="true">
          <span className="work-project-art-orbit" />
          <span className="work-project-art-orbit work-project-art-orbit-small" />
          <Icon size={34} strokeWidth={1.25} />
          <span className="work-project-art-number">
            {String(index + 1).padStart(2, "0")}
          </span>
        </span>
        <span className="work-project-content">
          <span className="work-project-meta">
            <span>{project.type}</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </span>
          <strong>{project.name}</strong>
          <span className="work-project-summary">{project.summary}</span>
          <span className="work-project-open">
            View details <ArrowRight size={13} aria-hidden="true" />
          </span>
        </span>
      </button>
      <div className="work-project-links" aria-label={`${project.name} links`}>
        <ResourceIconLink
          href={project.repositoryUrl}
          label="GitHub repository"
          Icon={Github}
        />
        <ResourceIconLink
          href={project.liveUrl}
          label="Live demo"
          Icon={Globe}
        />
      </div>
    </article>
  );
}

function ResourceIconLink({ href, label, Icon }) {
  if (!href) {
    return (
      <span
        className="project-resource-icon is-unavailable"
        aria-label={`${label} not provided`}
        title={`${label} not provided`}
      >
        <Icon size={16} aria-hidden="true" />
      </span>
    );
  }

  return (
    <a
      className="project-resource-icon"
      href={href}
      aria-label={label}
      title={label}
      target="_blank"
      rel="noreferrer"
    >
      <Icon size={16} aria-hidden="true" />
    </a>
  );
}

function ProjectDetailsModal({ practice, project, onClose }) {
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const Icon = practice.icon;

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => element.getClientRects().length > 0);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (
        previouslyFocused instanceof HTMLElement &&
        previouslyFocused.isConnected
      ) {
        previouslyFocused.focus();
      }
    };
  }, [onClose]);

  return (
    <div
      className="project-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="project-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
        aria-describedby="project-dialog-description"
        ref={dialogRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="project-dialog-visual" aria-hidden="true">
          <div className="project-dialog-grid" />
          <div className="dialog-orbit dialog-orbit-one" />
          <div className="dialog-orbit dialog-orbit-two" />
          <div className="dialog-visual-core">
            <Icon size={46} strokeWidth={1.1} />
          </div>
          <span className="dialog-visual-index">
            {practice.number} / {project.type}
          </span>
          <span className="dialog-visual-domain">{practice.name}</span>
        </div>

        <div className="project-dialog-content">
          <div className="project-dialog-topline">
            <span>{practice.name} / {project.type}</span>
            <button
              className="project-dialog-close"
              type="button"
              aria-label="Close project details"
              onClick={onClose}
              ref={closeButtonRef}
            >
              <X size={19} aria-hidden="true" />
            </button>
          </div>
          <h3 id="project-dialog-title">{project.name}</h3>
          <p className="project-dialog-summary" id="project-dialog-description">
            {project.summary}
          </p>

          <div className="project-detail-links" aria-label="Project links">
            <ResourceIconLink
              href={project.repositoryUrl}
              label="GitHub repository"
              Icon={Github}
            />
            <ResourceIconLink
              href={project.liveUrl}
              label="Live demo"
              Icon={Globe}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function PracticePage({ practice, onOpen }) {
  return (
    <div className="work-detail-page" key={practice.id}>
      <div className="work-detail-heading">
        <h3 id="selected-work-title">{practice.name} Projects</h3>
        <p>{practice.description}</p>
      </div>
      {practice.projects.length > 0 ? (
        <div className="work-project-grid" aria-label={`${practice.name} projects`}>
          {practice.projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              practice={practice}
              project={project}
              index={index}
              onOpen={onOpen}
            />
          ))}
        </div>
      ) : (
        <p className="work-empty-state">
          Projects in this practice are being prepared. Please check back soon.
        </p>
      )}
    </div>
  );
}

export default function SelectedWorkSection() {
  const sectionRef = useRef(null);
  const [page, setPage] = useState(getPageFromLocation);
  const pageRef = useRef(page);
  const [closingProject, setClosingProject] = useState(null);
  const closeTimerRef = useRef(0);
  pageRef.current = page;

  const scrollToSection = useCallback(() => {
    window.requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ block: "start" });
    });
  }, []);

  const onPracticeNavigate = useCallback(
    (event, href) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      event.preventDefault();
      window.history.pushState({ practiceRoute: true }, "", href);
      setPage(getPageFromLocation());
      window.dispatchEvent(new Event("portfolio:practice-open"));
      window.dispatchEvent(new Event("portfolio:route-change"));
    },
    [],
  );

  const openProject = useCallback((project) => {
    window.clearTimeout(closeTimerRef.current);
    setClosingProject(null);
    const url = new URL(window.location.href);
    url.searchParams.set("project", project.id);
    window.history.pushState({ projectModal: true }, "", url);
    setPage(getPageFromLocation());
  }, []);

  const finishClose = useCallback(() => {
    setClosingProject(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("project");
    window.history.replaceState({}, "", url);
    setPage(getPageFromLocation());
  }, []);

  const closeProject = useCallback(() => {
    const currentProject = getPageFromLocation().selectedProject;
    if (!currentProject) return;
    if (window.history.state?.projectModal) {
      window.history.back();
      return;
    }
    setClosingProject(currentProject);
    closeTimerRef.current = window.setTimeout(finishClose, 160);
  }, [finishClose]);

  useEffect(() => {
    const isPracticeRoute = window.location.pathname.startsWith("/practices/");
    document.body.classList.toggle("practice-route-active", isPracticeRoute);
    if (isPracticeRoute) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } else {
      window.requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({ block: "start" });
      });
    }
    return () => {
      document.body.classList.remove("practice-route-active");
      window.clearTimeout(closeTimerRef.current);
    };
  }, [page.type, page.practice?.id]);

  useEffect(() => {
    const updatePage = () => {
      window.clearTimeout(closeTimerRef.current);
      const nextPage = getPageFromLocation();
      const currentPage = pageRef.current;
      if (
        currentPage.selectedProject &&
        nextPage.type === "practice" &&
        nextPage.practice.id === currentPage.practice.id &&
        !nextPage.selectedProject
      ) {
        setClosingProject(currentPage.selectedProject);
        closeTimerRef.current = window.setTimeout(() => {
          setClosingProject(null);
          setPage(nextPage);
        }, 160);
      } else {
        setClosingProject(null);
        setPage(nextPage);
      }
    };
    const showPractices = () => {
      window.history.pushState({ practiceList: true }, "", "/#projects");
      setPage({ type: "practices" });
      window.dispatchEvent(new Event("portfolio:route-change"));
    };
    window.addEventListener("popstate", updatePage);
    window.addEventListener("portfolio:show-practices", showPractices);
    return () => {
      window.removeEventListener("popstate", updatePage);
      window.removeEventListener("portfolio:show-practices", showPractices);
    };
  }, []);

  const selectedPractice =
    page.type === "practice" ? page.practice : undefined;

  return (
    <section
      className="section selected-work-universe"
      id="projects"
      ref={sectionRef}
      aria-labelledby="selected-work-title"
    >
      <div className="selected-work-inner">
        {page.type === "practices" ? (
          <>
            <header className="selected-work-heading">
              <label>03 / SELECTED WORK</label>
              <div className="selected-work-heading-row">
                <h2 id="selected-work-title">
                  Work shaped
                  <br />
                  <span>with intent.</span>
                </h2>
                <p>
                  Explore four engineering practices, then open a project for
                  its concept, workflow, and implementation focus.
                </p>
              </div>
            </header>
            <div className="work-domain-grid" aria-label="Explore work by practice">
              {practices.map((practice) => (
                <PracticeCard
                  key={practice.id}
                  practice={practice}
                  onNavigate={onPracticeNavigate}
                />
              ))}
            </div>
          </>
        ) : (
          selectedPractice && (
            <PracticePage
              practice={selectedPractice}
              onOpen={openProject}
            />
          )
        )}
      </div>
      {selectedPractice && page.selectedProject && (
        <div
          className={`project-dialog-layer${closingProject ? " is-closing" : ""}`}
        >
          <ProjectDetailsModal
            practice={selectedPractice}
            project={page.selectedProject}
            onClose={closeProject}
          />
        </div>
      )}
    </section>
  );
}
