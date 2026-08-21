/* ============================================================
   UIP Database Atlas — table definitions: Projects & Portfolio
   ============================================================ */

Object.assign(SCHEMA.tables, {
  "projects": {
    "name": "projects",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "uuid",
        "type": "CHAR(36)",
        "nullable": false,
        "default": null,
        "unique": true
      },
      {
        "name": "owner_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "university_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "title_ar",
        "type": "VARCHAR(255)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "title_en",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "summary",
        "type": "TEXT",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "description",
        "type": "LONGTEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "category",
        "type": "VARCHAR(100)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "tags",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "cover_image_path",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "visibility",
        "type": "ENUM('private','university_only','public')",
        "nullable": false,
        "default": "'private'",
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('draft','submitted','under_review','approved','rejected','published','archived')",
        "nullable": false,
        "default": "'draft'",
        "unique": false
      },
      {
        "name": "views_count",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "likes_count",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      },
      {
        "name": "updated_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "unique": false
      },
      {
        "name": "published_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "deleted_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "supervisor_name",
        "type": "VARCHAR(150)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "sdgs",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "technologies",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "budget",
        "type": "DECIMAL(12,2)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "timeline_start",
        "type": "DATE",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "timeline_end",
        "type": "DATE",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "keywords",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "slug",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "is_featured",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "featured_order",
        "type": "INT",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "featured_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "owner_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "university_id",
        "ref_table": "universities",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "status"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "category"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "title_ar",
          "title_en",
          "summary"
        ],
        "fulltext": true
      },
      {
        "cols": [
          "is_featured",
          "featured_order"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "slug"
      ]
    ],
    "description": "Central domain entity: graduation / innovation projects",
    "module": "Projects & Portfolio",
    "icon": "rocket"
  },
  "project_files": {
    "name": "project_files",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "project_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "uploaded_by",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "file_type",
        "type": "ENUM('document','image','video','video_link','presentation','source_code','other')",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "file_path",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "original_name",
        "type": "VARCHAR(255)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "mime_type",
        "type": "VARCHAR(100)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "size_bytes",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      },
      {
        "name": "version",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "1",
        "unique": false
      },
      {
        "name": "is_latest",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "1",
        "unique": false
      },
      {
        "name": "root_file_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "external_url",
        "type": "VARCHAR(500)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "caption",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "sort_order",
        "type": "INT",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "is_featured",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "thumbnail_path",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "duration_seconds",
        "type": "INT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "project_id",
        "ref_table": "projects",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "uploaded_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "root_file_id",
        "ref_table": "project_files",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "project_id",
          "is_latest"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "project_id",
          "sort_order"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Project Files records.",
    "module": "Projects & Portfolio",
    "icon": "file"
  },
  "project_approvals": {
    "name": "project_approvals",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "project_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "reviewer_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "stage",
        "type": "ENUM('university_review','admin_review')",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "decision",
        "type": "ENUM('pending','approved','rejected','changes_requested')",
        "nullable": false,
        "default": "'pending'",
        "unique": false
      },
      {
        "name": "comments",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "decided_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      },
      {
        "name": "ai_output_acknowledged",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "ai_output_snapshot",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "project_id",
        "ref_table": "projects",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "reviewer_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "stage",
          "decision"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Project Approval Workflow (multi-step: university -> admin)",
    "module": "Projects & Portfolio",
    "icon": "check-circle"
  },
  "portfolios": {
    "name": "portfolios",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "user_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": true
      },
      {
        "name": "headline",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "about",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "is_public",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "1",
        "unique": false
      },
      {
        "name": "theme",
        "type": "VARCHAR(50)",
        "nullable": false,
        "default": "'default'",
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      },
      {
        "name": "updated_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "user_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Portfolios records.",
    "module": "Projects & Portfolio",
    "icon": "bookmark"
  },
  "portfolio_projects": {
    "name": "portfolio_projects",
    "columns": [
      {
        "name": "portfolio_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "project_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "display_order",
        "type": "TINYINT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      }
    ],
    "pk": [
      "portfolio_id",
      "project_id"
    ],
    "fks": [
      {
        "column": "portfolio_id",
        "ref_table": "portfolios",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "project_id",
        "ref_table": "projects",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Portfolio Projects records.",
    "module": "Projects & Portfolio",
    "icon": "link"
  },
  "github_repositories": {
    "name": "github_repositories",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "project_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "repo_url",
        "type": "VARCHAR(255)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "default_branch",
        "type": "VARCHAR(100)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "last_synced_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "sync_status",
        "type": "ENUM('not_connected','connected','error')",
        "nullable": false,
        "default": "'not_connected'",
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "project_id",
        "ref_table": "projects",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "FUTURE FEATURES (schema ready, not yet wired to UI logic)",
    "module": "Projects & Portfolio",
    "icon": "github"
  },
  "patents": {
    "name": "patents",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "project_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "submitted_by",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "title",
        "type": "VARCHAR(255)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "application_number",
        "type": "VARCHAR(100)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('draft','submitted','under_review','granted','rejected')",
        "nullable": false,
        "default": "'draft'",
        "unique": false
      },
      {
        "name": "filed_at",
        "type": "DATE",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "project_id",
        "ref_table": "projects",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      },
      {
        "column": "submitted_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Patents records.",
    "module": "Projects & Portfolio",
    "icon": "scroll"
  },
  "internships": {
    "name": "internships",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "company_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "title",
        "type": "VARCHAR(200)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "description",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "location",
        "type": "VARCHAR(150)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "is_remote",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('draft','open','closed')",
        "nullable": false,
        "default": "'draft'",
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "company_id",
        "ref_table": "companies",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Internships records.",
    "module": "Projects & Portfolio",
    "icon": "briefcase"
  },
  "internship_applications": {
    "name": "internship_applications",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "internship_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "student_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('applied','shortlisted','rejected','accepted')",
        "nullable": false,
        "default": "'applied'",
        "unique": false
      },
      {
        "name": "applied_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "internship_id",
        "ref_table": "internships",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "student_id",
        "ref_table": "students",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Internship Applications records.",
    "module": "Projects & Portfolio",
    "icon": "file-text"
  },
  "hackathons": {
    "name": "hackathons",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "organizer_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "title",
        "type": "VARCHAR(200)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "description",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "starts_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "ends_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('draft','upcoming','ongoing','completed','cancelled')",
        "nullable": false,
        "default": "'draft'",
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "organizer_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Hackathons records.",
    "module": "Projects & Portfolio",
    "icon": "trophy"
  },
  "hackathon_participants": {
    "name": "hackathon_participants",
    "columns": [
      {
        "name": "hackathon_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "user_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "team_name",
        "type": "VARCHAR(150)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "joined_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "hackathon_id",
      "user_id"
    ],
    "fks": [
      {
        "column": "hackathon_id",
        "ref_table": "hackathons",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "user_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Hackathon Participants records.",
    "module": "Projects & Portfolio",
    "icon": "user-check"
  },
  "saved_projects": {
    "name": "saved_projects",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "company_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "project_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "company_id",
        "ref_table": "companies",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "project_id",
        "ref_table": "projects",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "company_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "company_id",
        "project_id"
      ]
    ],
    "description": "A company's \"save for later\" list on the Discovery page. Referenced by App\\Repositories\\SavedProjectRepository since Phase 12 but the migration itself was never actually created — this fills that gap.",
    "module": "Projects & Portfolio",
    "icon": "star"
  },
  "investor_watchlist": {
    "name": "investor_watchlist",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "investor_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "project_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "investor_id",
        "ref_table": "investors",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "project_id",
        "ref_table": "projects",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "investor_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "investor_id",
        "project_id"
      ]
    ],
    "description": "An investor's \"watchlist\" on the Startup Discovery page — the investor equivalent of `saved_projects` (034) for companies. Kept as its own table rather than reusing saved_projects because it FKs to investors, not companies, and because Investor \"Portfolio\" ...",
    "module": "Projects & Portfolio",
    "icon": "star"
  },
  "project_links": {
    "name": "project_links",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "project_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "type",
        "type": "ENUM('github','gitlab','live_demo','website','mobile_app','documentation','video_demo','presentation','research_paper','other')",
        "nullable": false,
        "default": "'other'",
        "unique": false
      },
      {
        "name": "url",
        "type": "VARCHAR(500)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "label",
        "type": "VARCHAR(150)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "is_primary",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "project_id",
        "ref_table": "projects",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "project_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "project_id",
          "type"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "External links attached to a project (GitHub, live demo, documentation, video, research paper, etc.), replacing the old hardcoded repository_url/demo_url columns with a proper one-to-many entity.",
    "module": "Projects & Portfolio",
    "icon": "link"
  },
  "project_team_members": {
    "name": "project_team_members",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "project_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "user_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "invited_email",
        "type": "VARCHAR(190)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "role",
        "type": "ENUM('supervisor','collaborator','student_member')",
        "nullable": false,
        "default": "'collaborator'",
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('pending','accepted','rejected','removed')",
        "nullable": false,
        "default": "'pending'",
        "unique": false
      },
      {
        "name": "invited_by",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "invited_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      },
      {
        "name": "responded_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      },
      {
        "name": "updated_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "unique": false
      },
      {
        "name": "member_name",
        "type": "VARCHAR(190)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "academic_year",
        "type": "TINYINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "student_number",
        "type": "VARCHAR(50)",
        "nullable": true,
        "default": null,
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "project_id",
        "ref_table": "projects",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "user_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      },
      {
        "column": "invited_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "project_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "user_id",
          "status"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "project_id",
        "invited_email"
      ]
    ],
    "description": "Collaborators on a project team, including pending invitations by email before the invitee has an account, plus academic metadata for student teammates.",
    "module": "Projects & Portfolio",
    "icon": "users"
  },
  "project_discussion_messages": {
    "name": "project_discussion_messages",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "project_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "user_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "message",
        "type": "TEXT",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "project_id",
        "ref_table": "projects",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "user_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "project_id",
          "created_at"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Lightweight discussion thread attached directly to a project (distinct from the general messaging system), for project-specific Q&A.",
    "module": "Projects & Portfolio",
    "icon": "messages-square"
  },
  "supervisor_assignments": {
    "name": "supervisor_assignments",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "supervisor_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "university_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "scope_type",
        "type": "VARCHAR(20)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "scope_value",
        "type": "VARCHAR(150)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "project_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "supervisor_id",
        "ref_table": "supervisors",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "university_id",
        "ref_table": "universities",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "project_id",
        "ref_table": "projects",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "supervisor_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "university_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "scope_type",
          "scope_value"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "project_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "A university supervisor's scope of responsibility (e.g. a specific faculty, department, or project) beyond their base supervisors record.",
    "module": "Projects & Portfolio",
    "icon": "user-check"
  },
  "project_grades": {
    "name": "project_grades",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "project_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "graded_by",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "total_score",
        "type": "DECIMAL(6,2)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "max_score",
        "type": "DECIMAL(6,2)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "letter_grade",
        "type": "VARCHAR(2)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('draft','final')",
        "nullable": false,
        "default": "'draft'",
        "unique": false
      },
      {
        "name": "overall_comments",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "graded_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      },
      {
        "name": "updated_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "project_id",
        "ref_table": "projects",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "graded_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "status"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "project_id"
      ]
    ],
    "description": "A supervisor's or evaluator's grade for a submitted project — total score, letter grade, and overall comments.",
    "module": "Projects & Portfolio",
    "icon": "badge-check"
  },
  "project_grade_criteria": {
    "name": "project_grade_criteria",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "project_grade_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "criterion",
        "type": "VARCHAR(200)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "max_score",
        "type": "DECIMAL(6,2)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "score",
        "type": "DECIMAL(6,2)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "comments",
        "type": "VARCHAR(500)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "sort_order",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "project_grade_id",
        "ref_table": "project_grades",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "project_grade_id",
          "sort_order"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Individual rubric line items that make up a project_grades record, each with its own max score, awarded score, and comments.",
    "module": "Projects & Portfolio",
    "icon": "list"
  },
  "project_analytics_events": {
    "name": "project_analytics_events",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "project_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "event_type",
        "type": "ENUM('view','github_click','demo_click','link_click','file_download','contact_request')",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "visitor_hash",
        "type": "CHAR(64)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "meta",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "project_id",
        "ref_table": "projects",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "project_id",
          "event_type",
          "created_at"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "project_id",
          "visitor_hash",
          "created_at"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Raw page-view/engagement events recorded against a project (view, share, click, etc.), the source data behind project-level analytics.",
    "module": "Projects & Portfolio",
    "icon": "activity"
  },
  "researcher_project_bookmarks": {
    "name": "researcher_project_bookmarks",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "researcher_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "project_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "researcher_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "project_id",
        "ref_table": "projects",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "researcher_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "researcher_id",
        "project_id"
      ]
    ],
    "description": "A researcher's bookmarked/saved projects of interest, the researcher-side equivalent of the existing saved_projects (company) and investor_watchlist (investor) tables.",
    "module": "Projects & Portfolio",
    "icon": "bookmark"
  }
});
