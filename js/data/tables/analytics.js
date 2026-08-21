/* ============================================================
   UIP Database Atlas — table definitions: Analytics & Reports
   ============================================================ */

Object.assign(SCHEMA.tables, {
  "innovation_statistics": {
    "name": "innovation_statistics",
    "columns": [
      {
        "name": "id",
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
        "name": "category",
        "type": "VARCHAR(100)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "total_projects",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "approved_projects",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "avg_readiness_score",
        "type": "DECIMAL(5,2)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "period_start",
        "type": "DATE",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "period_end",
        "type": "DATE",
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
        "column": "university_id",
        "ref_table": "universities",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Innovation Statistics records.",
    "module": "Analytics & Reports",
    "icon": "trending-up"
  },
  "reports": {
    "name": "reports",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "generated_by",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "report_type",
        "type": "VARCHAR(80)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "format",
        "type": "ENUM('pdf', 'csv', 'xlsx', 'json', 'docx')",
        "nullable": false,
        "default": "'pdf'",
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
        "name": "parameters",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('queued','generating','ready','failed')",
        "nullable": false,
        "default": "'queued'",
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
        "name": "schedule_id",
        "type": "BIGINT UNSIGNED",
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
        "column": "generated_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "schedule_id",
        "ref_table": "report_schedules",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Reports records.",
    "module": "Analytics & Reports",
    "icon": "file-text"
  },
  "report_schedules": {
    "name": "report_schedules",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "report_type",
        "type": "VARCHAR(80)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "frequency",
        "type": "ENUM('daily','weekly','monthly','custom')",
        "nullable": false,
        "default": "'weekly'",
        "unique": false
      },
      {
        "name": "recipient_email",
        "type": "VARCHAR(190)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "is_active",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "1",
        "unique": false
      },
      {
        "name": "last_run_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "last_report_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "next_run_at",
        "type": "DATETIME",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "created_by",
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
      },
      {
        "name": "scope_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "format",
        "type": "ENUM('csv','pdf','xlsx')",
        "nullable": false,
        "default": "'csv'",
        "unique": false
      },
      {
        "name": "custom_interval_days",
        "type": "SMALLINT UNSIGNED",
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
        "column": "created_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "last_report_id",
        "ref_table": "reports",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Report Schedules records.",
    "module": "Analytics & Reports",
    "icon": "calendar-clock"
  },
  "saved_dashboards": {
    "name": "saved_dashboards",
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
        "unique": false
      },
      {
        "name": "name",
        "type": "VARCHAR(150)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "layout",
        "type": "JSON",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "is_default",
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
      },
      {
        "name": "updated_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "unique": false
      },
      {
        "name": "is_shared",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "is_archived",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
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
    "indexes": [
      {
        "cols": [
          "is_shared",
          "is_archived"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "user_id",
          "is_archived"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Analyst-defined saved dashboards (widget layout/config per user)",
    "module": "Analytics & Reports",
    "icon": "layout-dashboard"
  },
  "report_templates": {
    "name": "report_templates",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "created_by",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "name",
        "type": "VARCHAR(150)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "description",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "data_source",
        "type": "ENUM('projects','users','ai_analysis','analytics_records', 'innovation_statistics','security_logs')",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "query_config",
        "type": "JSON",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "is_shared",
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
        "column": "created_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Reusable report templates (query/filter definitions an analyst can re-run)",
    "module": "Analytics & Reports",
    "icon": "file-cog"
  },
  "data_segments": {
    "name": "data_segments",
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
        "unique": false
      },
      {
        "name": "name",
        "type": "VARCHAR(150)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "entity",
        "type": "ENUM('users','projects')",
        "nullable": false,
        "default": "'projects'",
        "unique": false
      },
      {
        "name": "criteria",
        "type": "JSON",
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
        "column": "user_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Saved data segments (reusable filter sets, e.g. \"Active students in Cairo universities with AI-analyzed projects\")",
    "module": "Analytics & Reports",
    "icon": "filter"
  },
  "data_exports": {
    "name": "data_exports",
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
        "unique": false
      },
      {
        "name": "export_type",
        "type": "VARCHAR(60)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "format",
        "type": "ENUM('csv','xlsx','pdf')",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "filters",
        "type": "JSON",
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
        "name": "status",
        "type": "ENUM('pending','completed','failed')",
        "nullable": false,
        "default": "'pending'",
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
        "name": "completed_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "email_to",
        "type": "VARCHAR(500)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "batch_id",
        "type": "VARCHAR(32)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "schedule_id",
        "type": "BIGINT UNSIGNED",
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
        "column": "user_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "schedule_id",
        "ref_table": "export_schedules",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Export audit log (CSV/Excel/PDF exports triggered from the portal)",
    "module": "Analytics & Reports",
    "icon": "download"
  },
  "kpis": {
    "name": "kpis",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "name",
        "type": "VARCHAR(150)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "description",
        "type": "VARCHAR(500)",
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
        "name": "unit",
        "type": "VARCHAR(30)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "current_value",
        "type": "DECIMAL(18,2)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "target_value",
        "type": "DECIMAL(18,2)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "direction",
        "type": "ENUM('higher_better','lower_better')",
        "nullable": false,
        "default": "'higher_better'",
        "unique": false
      },
      {
        "name": "alert_enabled",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "alert_threshold",
        "type": "DECIMAL(18,2)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('active','archived')",
        "nullable": false,
        "default": "'active'",
        "unique": false
      },
      {
        "name": "created_by",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "assigned_to",
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
        "column": "created_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "assigned_to",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "category"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "status"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "A tracked key performance indicator (current value vs. target, direction, alert threshold), owned by an admin and optionally assigned to another user.",
    "module": "Analytics & Reports",
    "icon": "target"
  },
  "kpi_history": {
    "name": "kpi_history",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "kpi_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "value",
        "type": "DECIMAL(18,2)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "note",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "recorded_by",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "recorded_at",
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
        "column": "kpi_id",
        "ref_table": "kpis",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "recorded_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "kpi_id",
          "recorded_at"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Time-series of recorded values for a KPI over time, the data behind its trend chart.",
    "module": "Analytics & Reports",
    "icon": "history"
  },
  "saved_queries": {
    "name": "saved_queries",
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
        "unique": false
      },
      {
        "name": "name",
        "type": "VARCHAR(150)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "description",
        "type": "VARCHAR(500)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "sql_text",
        "type": "TEXT",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "builder_state",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "dataset_key",
        "type": "VARCHAR(60)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "is_template",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "is_shared",
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
    "indexes": [
      {
        "cols": [
          "user_id",
          "updated_at"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "A user's saved/named Data Explorer queries (raw SQL and/or query-builder state) for quick reuse.",
    "module": "Analytics & Reports",
    "icon": "bookmark"
  },
  "query_history": {
    "name": "query_history",
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
        "unique": false
      },
      {
        "name": "saved_query_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "sql_text",
        "type": "TEXT",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('success','error')",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "error_message",
        "type": "VARCHAR(500)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "row_count",
        "type": "INT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "execution_time_ms",
        "type": "INT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "executed_at",
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
        "column": "user_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "saved_query_id",
        "ref_table": "saved_queries",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "user_id",
          "executed_at"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "A user's executed ad-hoc SQL query history from the Data Explorer feature, including status, timing, and row count.",
    "module": "Analytics & Reports",
    "icon": "history"
  },
  "export_schedules": {
    "name": "export_schedules",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "export_type",
        "type": "VARCHAR(80)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "frequency",
        "type": "ENUM('daily','weekly','monthly','custom')",
        "nullable": false,
        "default": "'weekly'",
        "unique": false
      },
      {
        "name": "format",
        "type": "ENUM('csv','pdf','xlsx')",
        "nullable": false,
        "default": "'csv'",
        "unique": false
      },
      {
        "name": "custom_interval_days",
        "type": "SMALLINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "recipient_email",
        "type": "VARCHAR(500)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "is_active",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "1",
        "unique": false
      },
      {
        "name": "last_run_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "last_export_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "next_run_at",
        "type": "DATETIME",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "created_by",
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
        "column": "created_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "last_export_id",
        "ref_table": "data_exports",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Recurring/scheduled data export jobs (frequency, format, recipient email) that repeatedly produce a data_exports record without manual re-triggering.",
    "module": "Analytics & Reports",
    "icon": "calendar-clock"
  },
  "data_explorer_favorites": {
    "name": "data_explorer_favorites",
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
        "unique": false
      },
      {
        "name": "dataset_key",
        "type": "VARCHAR(60)",
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
        "column": "user_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [
      [
        "user_id",
        "dataset_key"
      ]
    ],
    "description": "A user's favorited/pinned Data Explorer datasets for quick access.",
    "module": "Analytics & Reports",
    "icon": "star"
  },
  "data_explorer_activity": {
    "name": "data_explorer_activity",
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
        "unique": false
      },
      {
        "name": "dataset_key",
        "type": "VARCHAR(60)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "opened_at",
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
          "user_id",
          "opened_at"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Log of which datasets a user opened in the Data Explorer, and when.",
    "module": "Analytics & Reports",
    "icon": "activity"
  },
  "data_analysis_report_categories": {
    "name": "data_analysis_report_categories",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "name_en",
        "type": "VARCHAR(100)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "name_ar",
        "type": "VARCHAR(100)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "slug",
        "type": "VARCHAR(100)",
        "nullable": false,
        "default": null,
        "unique": true
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
    "fks": [],
    "indexes": [],
    "uniques": [],
    "description": "Folder-like category taxonomy for organizing data_analysis_report_files.",
    "module": "Analytics & Reports",
    "icon": "folder"
  },
  "data_analysis_report_tags": {
    "name": "data_analysis_report_tags",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "name",
        "type": "VARCHAR(60)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "slug",
        "type": "VARCHAR(60)",
        "nullable": false,
        "default": null,
        "unique": true
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
    "fks": [],
    "indexes": [],
    "uniques": [],
    "description": "Free-form tag vocabulary usable on data_analysis_report_files.",
    "module": "Analytics & Reports",
    "icon": "tags"
  },
  "data_analysis_report_files": {
    "name": "data_analysis_report_files",
    "columns": [
      {
        "name": "id",
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
        "name": "category_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
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
        "name": "original_filename",
        "type": "VARCHAR(255)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "file_extension",
        "type": "VARCHAR(20)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "mime_type",
        "type": "VARCHAR(150)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "file_size_bytes",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "storage_path",
        "type": "VARCHAR(255)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "download_count",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "view_count",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "is_archived",
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
        "column": "uploaded_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "category_id",
        "ref_table": "data_analysis_report_categories",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "uploaded_by"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "is_archived"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "category_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Uploaded data-analysis report documents (spreadsheets, PDFs, etc.), with view/download counters and archive state.",
    "module": "Analytics & Reports",
    "icon": "file-text"
  },
  "data_analysis_report_file_versions": {
    "name": "data_analysis_report_file_versions",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "data_analysis_report_file_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "version_number",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "storage_path",
        "type": "VARCHAR(255)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "original_filename",
        "type": "VARCHAR(255)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "file_extension",
        "type": "VARCHAR(20)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "file_size_bytes",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "notes",
        "type": "TEXT",
        "nullable": true,
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
        "column": "data_analysis_report_file_id",
        "ref_table": "data_analysis_report_files",
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
      }
    ],
    "indexes": [],
    "uniques": [
      [
        "data_analysis_report_file_id",
        "version_number"
      ]
    ],
    "description": "Prior uploaded versions of a data-analysis report file, kept for history when a newer version is uploaded.",
    "module": "Analytics & Reports",
    "icon": "history"
  },
  "data_analysis_report_file_tags": {
    "name": "data_analysis_report_file_tags",
    "columns": [
      {
        "name": "data_analysis_report_file_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "tag_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      }
    ],
    "pk": [
      "data_analysis_report_file_id",
      "tag_id"
    ],
    "fks": [
      {
        "column": "data_analysis_report_file_id",
        "ref_table": "data_analysis_report_files",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "tag_id",
        "ref_table": "data_analysis_report_tags",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Many-to-many tag assignments linking data_analysis_report_files to data_analysis_report_tags.",
    "module": "Analytics & Reports",
    "icon": "tags"
  },
  "data_analysis_report_comments": {
    "name": "data_analysis_report_comments",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "report_file_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "parent_comment_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
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
        "name": "body",
        "type": "TEXT",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "is_note",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "is_resolved",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "resolved_by",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "resolved_at",
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
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "report_file_id",
        "ref_table": "data_analysis_report_files",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "parent_comment_id",
        "ref_table": "data_analysis_report_comments",
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
      },
      {
        "column": "resolved_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "report_file_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Threaded comments/notes on a data-analysis report file, supporting replies and resolve/unresolve state.",
    "module": "Analytics & Reports",
    "icon": "messages-square"
  },
  "data_analysis_report_comment_mentions": {
    "name": "data_analysis_report_comment_mentions",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "comment_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "mentioned_user_id",
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
        "column": "comment_id",
        "ref_table": "data_analysis_report_comments",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "mentioned_user_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "@-mentions of another user within a data_analysis_report_comments comment.",
    "module": "Analytics & Reports",
    "icon": "at-sign"
  }
});
