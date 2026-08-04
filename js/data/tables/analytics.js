/* ============================================================
   UIP Database Atlas — table definitions: Analytics & Reports
   ============================================================ */

Object.assign(SCHEMA.tables, {
  "analytics_records": {
    "name": "analytics_records",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "metric_key",
        "type": "VARCHAR(100)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "metric_value",
        "type": "DECIMAL(18,2)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "dimension",
        "type": "VARCHAR(100)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "recorded_for_date",
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
    "fks": [],
    "indexes": [
      {
        "cols": [
          "metric_key",
          "recorded_for_date"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Analytics & Statistics",
    "module": "Analytics & Reports",
    "icon": "line-chart"
  },
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
  "trends": {
    "name": "trends",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "topic",
        "type": "VARCHAR(150)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "trend_score",
        "type": "DECIMAL(6,2)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "project_count",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "period_month",
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
    "fks": [],
    "indexes": [
      {
        "cols": [
          "period_month"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Trends records.",
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
        "type": "ENUM('pdf','csv','xlsx','json')",
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
        "type": "ENUM('daily','weekly','monthly')",
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
    "description": "Export audit log (CSV/Excel/PDF exports triggered from the portal)",
    "module": "Analytics & Reports",
    "icon": "download"
  }
});
