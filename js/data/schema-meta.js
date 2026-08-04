/* ============================================================
   UIP Database Atlas — schema metadata
   Loaded first. Table definitions are added by js/data/tables/*.js
   via Object.assign(SCHEMA.tables, {...}) in the order below.
   ============================================================ */

const SCHEMA = {
  "tables": {},
  "order": [
    "users",
    "roles",
    "permissions",
    "role_permission",
    "user_roles",
    "students",
    "universities",
    "companies",
    "researchers",
    "investors",
    "projects",
    "project_files",
    "project_approvals",
    "ai_analysis",
    "ai_readiness_scores",
    "ai_classifications",
    "startup_potential",
    "improvement_suggestions",
    "portfolios",
    "portfolio_projects",
    "notifications",
    "conversations",
    "conversation_participants",
    "messages",
    "analytics_records",
    "innovation_statistics",
    "trends",
    "security_logs",
    "audit_logs",
    "reports",
    "settings",
    "university_verification_requests",
    "github_repositories",
    "patents",
    "internships",
    "internship_applications",
    "hackathons",
    "hackathon_participants",
    "ai_code_review_results",
    "password_reset_tokens",
    "email_verification_tokens",
    "saved_projects",
    "student_university_requests",
    "report_schedules",
    "api_tokens",
    "blocked_ips",
    "security_incidents",
    "security_incident_events",
    "user_sessions",
    "vulnerabilities",
    "security_policies",
    "risk_scores",
    "security_notifications",
    "saved_dashboards",
    "report_templates",
    "data_segments",
    "data_exports",
    "investor_watchlist",
    "user_permission_overrides",
    "supervisors",
    "demo_seed_batches",
    "demo_seed_log"
  ],
  "modules": [
    "Authentication & Access",
    "People & Profiles",
    "Projects & Portfolio",
    "AI Engine",
    "Messaging & Notifications",
    "Analytics & Reports",
    "Security & Audit",
    "Settings & System"
  ],
  "moduleIcons": {
    "Authentication & Access": "shield",
    "People & Profiles": "user",
    "Projects & Portfolio": "briefcase",
    "AI Engine": "brain-circuit",
    "Messaging & Notifications": "message-circle",
    "Analytics & Reports": "bar-chart-2",
    "Security & Audit": "shield-alert",
    "Settings & System": "settings"
  },
  "moduleColors": {
    "Authentication & Access": {
      "h": 221
    },
    "People & Profiles": {
      "h": 189
    },
    "Projects & Portfolio": {
      "h": 142
    },
    "AI Engine": {
      "h": 27
    },
    "Messaging & Notifications": {
      "h": 328
    },
    "Analytics & Reports": {
      "h": 0
    },
    "Security & Audit": {
      "h": 258
    },
    "Settings & System": {
      "h": 45
    }
  }
};
