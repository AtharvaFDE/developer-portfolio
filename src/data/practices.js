import {
  BarChart3,
  BrainCircuit,
  Code2,
  Database,
} from "lucide-react";

function createDummyProjects(items, technologies) {
  return items.map(([id, name, summary]) => ({
    id,
    name,
    type: "DUMMY PROJECT",
    summary: `${summary} Dummy portfolio concept, not a completed project.`,
    overview: summary,
    objective: `Illustrate a possible ${name.toLowerCase()} experience.`,
    features: [],
    workflow: [],
    technologies,
    repositoryUrl: null,
    liveUrl: null,
  }));
}

export const practices = [
  {
    id: "data-engineering",
    number: "01",
    name: "Data Engineering",
    description:
      "Reliable movement, transformation, and foundations for information.",
    icon: Database,
    projects: [
      {
        id: "data-flow-study",
        name: "Data Platform Flow",
        type: "CONCEPT STUDY",
        summary:
          "An illustrative architecture study showing how source data can move through ingestion, transformation, and storage.",
        overview:
          "This concept maps a dependable data journey from incoming records to organized, reusable data. It is presented as an illustrative study, not as a completed client or production project.",
        objective:
          "Show a clear, approachable path from source data to a dependable foundation that teams can reuse.",
        features: [
          "A visible path from source systems through ingestion and transformation.",
          "A modeled storage layer that communicates where trusted data is organized.",
          "A compact architecture view that makes each stage easy to scan.",
        ],
        workflow: ["Source data", "Ingestion", "Transform", "Data store"],
        implementation:
          "The concept focuses on separating the stages of the data journey so responsibilities and hand-offs are easy to understand.",
        challenge:
          "Representing a multi-step technical pipeline with enough context to be useful, without making the visual flow feel dense.",
        technologies: ["Ingestion", "Transformation", "Data modeling"],
        repositoryUrl: null,
        liveUrl: null,
      },
      ...createDummyProjects([
        ["batch-ingestion-pipeline", "Batch Ingestion Pipeline", "A sample flow for collecting scheduled data from multiple sources."],
        ["stream-processing-hub", "Stream Processing Hub", "A sample architecture for routing and processing event streams."],
        ["warehouse-model-studio", "Warehouse Model Studio", "A sample data model for organizing analytics-ready warehouse tables."],
        ["data-quality-monitor", "Data Quality Monitor", "A sample view for surfacing quality checks across datasets."],
        ["etl-orchestration-board", "ETL Orchestration Board", "A sample workflow for coordinating repeatable transformation jobs."],
        ["lakehouse-blueprint", "Lakehouse Blueprint", "A sample layout for organizing raw and refined data zones."],
        ["event-data-collector", "Event Data Collector", "A sample ingestion pattern for application events."],
        ["pipeline-health-console", "Pipeline Health Console", "A sample status view for monitoring pipeline runs and freshness."],
        ["customer-data-foundation", "Customer Data Foundation", "A sample structure for combining customer records from source systems."],
        ["incremental-load-design", "Incremental Load Design", "A sample approach for loading only changed records."],
        ["metadata-catalog-concept", "Metadata Catalog Concept", "A sample catalog layout for discovering datasets and ownership."],
        ["data-lineage-explorer", "Data Lineage Explorer", "A sample view tracing how data moves between pipeline stages."],
        ["cloud-storage-layout", "Cloud Storage Layout", "A sample organization scheme for partitioned data storage."],
        ["realtime-metrics-pipeline", "Realtime Metrics Pipeline", "A sample path from incoming events to operational metrics."],
      ], ["Ingestion", "Data modeling", "Pipelines"]),
    ],
  },
  {
    id: "ai-engineering",
    number: "02",
    name: "AI Engineering",
    description:
      "Useful model experiences grounded in context and thoughtful interaction.",
    icon: BrainCircuit,
    projects: [
      {
        id: "ai-intelligence-dashboard",
        name: "AI Intelligence Dashboard",
        type: "INTERFACE CONCEPT",
        summary:
          "A polished interface concept for exploring research insights, interactive reports, and AI-oriented workflows.",
        overview:
          "An interface concept for bringing research insights and interactive reports into a focused dashboard experience. It does not claim to connect to a live model or service.",
        objective:
          "Explore how AI-assisted research could feel understandable and navigable within a focused workspace.",
        features: [
          "A dashboard layout that gives research and reports a clear hierarchy.",
          "An interaction concept for moving between insight and supporting context.",
          "A calm visual system designed to keep attention on the information.",
        ],
        workflow: ["Research inputs", "Context", "Insight review", "Report view"],
        implementation:
          "The interface study prioritizes readable information hierarchy and clear boundaries between source context and generated insight.",
        challenge:
          "Making an AI-oriented interface feel trustworthy and easy to explore without implying unsupported model behavior.",
        technologies: ["React", "TypeScript", "GraphQL"],
        repositoryUrl: null,
        liveUrl: null,
      },
      ...createDummyProjects([
        ["document-assistant-concept", "Document Assistant", "A sample interface for asking questions about a curated document set."],
        ["semantic-search-workbench", "Semantic Search Workbench", "A sample search experience centered on meaning and source context."],
        ["prompt-evaluation-studio", "Prompt Evaluation Studio", "A sample workspace for comparing prompt results against review criteria."],
        ["retrieval-pipeline-map", "Retrieval Pipeline Map", "A sample diagram of retrieval stages from query to grounded response."],
        ["model-observability-panel", "Model Observability Panel", "A sample dashboard for reviewing model response quality signals."],
        ["knowledge-base-chat", "Knowledge Base Chat", "A sample conversational interface grounded in a knowledge collection."],
        ["ai-content-reviewer", "AI Content Reviewer", "A sample review flow for inspecting suggested content before use."],
        ["embedding-explorer", "Embedding Explorer", "A sample visual tool for exploring similarity between text records."],
        ["agent-workflow-builder", "Agent Workflow Builder", "A sample canvas for arranging steps in an assisted workflow."],
        ["response-quality-dashboard", "Response Quality Dashboard", "A sample dashboard for organizing response feedback and evaluations."],
        ["research-insight-assistant", "Research Insight Assistant", "A sample research interface for collecting and reviewing cited findings."],
        ["multimodal-search-concept", "Multimodal Search Concept", "A sample search experience spanning text and visual references."],
        ["model-comparison-workbench", "Model Comparison Workbench", "A sample interface for comparing model outputs side by side."],
        ["context-window-planner", "Context Window Planner", "A sample utility for arranging relevant context before a model request."],
      ], ["AI interface", "Evaluation", "Retrieval"]),
    ],
  },
  {
    id: "data-analytics",
    number: "03",
    name: "Data Analytics",
    description:
      "Clear metrics, exploration, and communication that make patterns useful.",
    icon: BarChart3,
    projects: [
      {
        id: "expense-tracker",
        name: "Expense Tracker",
        type: "DASHBOARD CONCEPT",
        summary:
          "A finance dashboard concept for tracking spending, viewing summaries, and exporting records.",
        overview:
          "A finance dashboard concept centered on clear spending summaries, practical record keeping, and readable data views.",
        objective:
          "Make personal spending easier to review by pairing a concise summary with accessible transaction records.",
        features: [
          "A high-level spending summary designed for quick review.",
          "A record-keeping view that keeps individual expenses accessible.",
          "An export-focused workflow for taking records beyond the dashboard.",
        ],
        workflow: ["Transactions", "Categories", "Summary", "Export"],
        implementation:
          "The concept gives summary information priority while keeping the underlying records close at hand.",
        challenge:
          "Balancing quick-glance metrics with enough detail to help people understand where their spending comes from.",
        technologies: ["React", "Data visualization", "Export"],
        repositoryUrl: null,
        liveUrl: null,
      },
      ...createDummyProjects([
        ["product-usage-dashboard", "Product Usage Dashboard", "A sample dashboard for exploring adoption and engagement metrics."],
        ["retail-sales-explorer", "Retail Sales Explorer", "A sample analysis view for comparing sales across products and periods."],
        ["customer-cohort-analysis", "Customer Cohort Analysis", "A sample report for comparing customer groups over time."],
        ["marketing-performance-report", "Marketing Performance Report", "A sample summary of campaign reach and conversion metrics."],
        ["operations-kpi-board", "Operations KPI Board", "A sample view for monitoring operational measures in one place."],
        ["subscription-retention-insights", "Subscription Retention Insights", "A sample analysis of recurring customer activity and retention."],
        ["survey-results-explorer", "Survey Results Explorer", "A sample interface for filtering and summarizing survey responses."],
        ["web-traffic-analytics", "Web Traffic Analytics", "A sample report for reviewing traffic sources and page activity."],
        ["inventory-trend-report", "Inventory Trend Report", "A sample analysis of stock movement and inventory levels."],
        ["support-ticket-insights", "Support Ticket Insights", "A sample dashboard for grouping service requests and response trends."],
        ["financial-summary-dashboard", "Financial Summary Dashboard", "A sample dashboard for reviewing income and expense patterns."],
        ["experiment-results-review", "Experiment Results Review", "A sample report for comparing outcomes from product experiments."],
        ["regional-performance-map", "Regional Performance Map", "A sample geographic view of performance across regions."],
        ["customer-feedback-themes", "Customer Feedback Themes", "A sample summary for organizing recurring feedback topics."],
      ], ["Analytics", "Dashboards", "Reporting"]),
    ],
  },
  {
    id: "software-development",
    number: "04",
    name: "Software Development",
    description:
      "Maintainable interfaces and application experiences, built with care.",
    icon: Code2,
    projects: [
      {
        id: "task-manager",
        name: "Task Manager Mobile App",
        type: "MOBILE APP CONCEPT",
        summary:
          "A focused productivity concept bringing task flows together with analytics, charts, and PDF export.",
        overview:
          "A mobile productivity concept combining task management with useful summaries, charts, and PDF export.",
        objective:
          "Bring everyday task planning and progress review into one focused mobile experience.",
        features: [
          "A task-focused flow for capturing and organizing work.",
          "Progress summaries to make activity easier to review.",
          "A reporting concept using charts and PDF export.",
        ],
        workflow: ["Capture tasks", "Organize", "Review progress", "Export"],
        implementation:
          "The concept connects the primary task flow to a secondary progress view, keeping planning and review part of one experience.",
        challenge:
          "Keeping the core task workflow simple while making progress and reporting useful rather than distracting.",
        technologies: ["React Native", "Charts", "UX"],
        repositoryUrl: null,
        liveUrl: null,
      },
      ...createDummyProjects([
        ["developer-portfolio-starter", "Developer Portfolio Starter", "A sample responsive portfolio layout for presenting engineering work."],
        ["team-task-board", "Team Task Board", "A sample application concept for organizing shared tasks and progress."],
        ["component-library-showcase", "Component Library Showcase", "A sample interface for browsing reusable UI components."],
        ["event-booking-interface", "Event Booking Interface", "A sample booking flow for discovering and reserving events."],
        ["reading-list-manager", "Reading List Manager", "A sample application for collecting and organizing saved reading."],
        ["habit-tracker-mobile", "Habit Tracker Mobile", "A sample mobile experience for reviewing recurring personal goals."],
        ["issue-tracker-workbench", "Issue Tracker Workbench", "A sample workspace for organizing software issues and status."],
        ["recipe-planning-app", "Recipe Planning App", "A sample interface for collecting recipes and planning meals."],
        ["workspace-notes-app", "Workspace Notes App", "A sample note-taking experience organized around projects."],
        ["accessible-form-patterns", "Accessible Form Patterns", "A sample set of accessible form layouts and validation states."],
        ["release-notes-builder", "Release Notes Builder", "A sample tool for organizing changes into readable release notes."],
        ["team-dashboard-layout", "Team Dashboard Layout", "A sample dashboard concept for surfacing project and team updates."],
        ["mobile-expense-journal", "Mobile Expense Journal", "A sample mobile interface for recording and reviewing expenses."],
        ["api-status-console", "API Status Console", "A sample interface for presenting service availability and status."],
      ], ["React", "Application UI", "Responsive design"]),
    ],
  },
];
