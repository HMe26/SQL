/* ============================================================
   UIP Database Atlas — table definitions: AI Engine
   ============================================================ */

Object.assign(SCHEMA.tables, {
  "ai_analysis": {
    "name": "ai_analysis",
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
        "name": "analysis_type",
        "type": "ENUM('summary','classification','readiness_score','startup_potential','improvement_suggestions')",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('queued','processing','completed','failed')",
        "nullable": false,
        "default": "'queued'",
        "unique": false
      },
      {
        "name": "raw_result",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "model_used",
        "type": "VARCHAR(100)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "requested_by",
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
          "analysis_type",
          "status"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "AI FEATURE TABLES (interfaces + storage ready; engine pluggable later)",
    "module": "AI Engine",
    "icon": "brain-circuit"
  },
  "ai_readiness_scores": {
    "name": "ai_readiness_scores",
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
        "unique": true
      },
      {
        "name": "overall_score",
        "type": "DECIMAL(5,2)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "technical_score",
        "type": "DECIMAL(5,2)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "market_score",
        "type": "DECIMAL(5,2)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "innovation_score",
        "type": "DECIMAL(5,2)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "presentation_score",
        "type": "DECIMAL(5,2)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "computed_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "is_demo_data",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "1",
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
    "description": "Ai Readiness Scores records.",
    "module": "AI Engine",
    "icon": "gauge"
  },
  "ai_classifications": {
    "name": "ai_classifications",
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
        "name": "predicted_category",
        "type": "VARCHAR(100)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "confidence",
        "type": "DECIMAL(5,2)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "alternative_categories",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "is_demo_data",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "1",
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
    "description": "Ai Classifications records.",
    "module": "AI Engine",
    "icon": "tags"
  },
  "startup_potential": {
    "name": "startup_potential",
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
        "unique": true
      },
      {
        "name": "potential_score",
        "type": "DECIMAL(5,2)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "market_size_estimate",
        "type": "VARCHAR(100)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "competitive_edge",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "risk_factors",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "is_demo_data",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "1",
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
    "description": "Startup Potential records.",
    "module": "AI Engine",
    "icon": "rocket"
  },
  "improvement_suggestions": {
    "name": "improvement_suggestions",
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
        "name": "suggestion",
        "type": "TEXT",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "category",
        "type": "ENUM('technical','presentation','market_fit','documentation','other')",
        "nullable": false,
        "default": "'other'",
        "unique": false
      },
      {
        "name": "priority",
        "type": "ENUM('low','medium','high')",
        "nullable": false,
        "default": "'medium'",
        "unique": false
      },
      {
        "name": "is_demo_data",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "1",
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
    "description": "Improvement Suggestions records.",
    "module": "AI Engine",
    "icon": "lightbulb"
  },
  "ai_code_review_results": {
    "name": "ai_code_review_results",
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
        "name": "repository_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('queued','processing','completed','failed')",
        "nullable": false,
        "default": "'queued'",
        "unique": false
      },
      {
        "name": "issues_found",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "summary",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "raw_result",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "is_demo_data",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "1",
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
        "column": "repository_id",
        "ref_table": "github_repositories",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Ai Code Review Results records.",
    "module": "AI Engine",
    "icon": "bug"
  }
});
