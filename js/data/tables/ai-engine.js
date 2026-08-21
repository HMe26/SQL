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
        "nullable": false,
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
      },
      {
        "name": "overall_score",
        "type": "TINYINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "security_score",
        "type": "TINYINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "performance_score",
        "type": "TINYINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "maintainability_score",
        "type": "TINYINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "architecture_score",
        "type": "TINYINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "quality_score",
        "type": "TINYINT UNSIGNED",
        "nullable": true,
        "default": null,
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
        "name": "previous_review_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "reviewed_by",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "approved_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "admin_notes",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "score_overridden",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "override_reason",
        "type": "TEXT",
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
        "column": "repository_id",
        "ref_table": "github_repositories",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      },
      {
        "column": "previous_review_id",
        "ref_table": "ai_code_review_results",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      },
      {
        "column": "reviewed_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "previous_review_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "reviewed_by"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "project_id",
          "version"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Ai Code Review Results records.",
    "module": "AI Engine",
    "icon": "bug"
  },
  "ai_conversations": {
    "name": "ai_conversations",
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
        "name": "portal",
        "type": "VARCHAR(40)",
        "nullable": false,
        "default": "'general'",
        "unique": false
      },
      {
        "name": "title",
        "type": "VARCHAR(200)",
        "nullable": false,
        "default": "'New chat'",
        "unique": false
      },
      {
        "name": "is_pinned",
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
      },
      {
        "name": "share_token",
        "type": "VARCHAR(64)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "message_count",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "last_message_at",
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
          "is_archived",
          "is_pinned",
          "last_message_at"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "portal"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "share_token"
      ]
    ],
    "description": "A conversation thread with the AI Assistant — one row per chat session, with title, pin/archive state, and an optional public share token.",
    "module": "AI Engine",
    "icon": "message-circle"
  },
  "ai_messages": {
    "name": "ai_messages",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "conversation_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "role",
        "type": "ENUM('user','assistant','system')",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "content",
        "type": "MEDIUMTEXT",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('complete','streaming','error')",
        "nullable": false,
        "default": "'complete'",
        "unique": false
      },
      {
        "name": "model",
        "type": "VARCHAR(120)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "prompt_tokens",
        "type": "INT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "completion_tokens",
        "type": "INT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "is_bookmarked",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "reactions_json",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "parent_message_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "context_snapshot",
        "type": "MEDIUMTEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "error_message",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "is_deleted",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "edited_at",
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
        "column": "conversation_id",
        "ref_table": "ai_conversations",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "parent_message_id",
        "ref_table": "ai_messages",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "conversation_id",
          "created_at"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "content"
        ],
        "fulltext": true
      }
    ],
    "uniques": [],
    "description": "Individual turns within an ai_conversations thread — both the user prompt and the assistant reply, with token usage, model used, and optional FAQ-answer source metadata.",
    "module": "AI Engine",
    "icon": "messages-square"
  },
  "ai_message_attachments": {
    "name": "ai_message_attachments",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "message_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "conversation_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "uploader_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "kind",
        "type": "VARCHAR(20)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "stored_path",
        "type": "VARCHAR(255)",
        "nullable": false,
        "default": null,
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
        "name": "original_name",
        "type": "VARCHAR(255)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "mime_type",
        "type": "VARCHAR(120)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "extension",
        "type": "VARCHAR(20)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "size_bytes",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "extracted_text",
        "type": "MEDIUMTEXT",
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
        "column": "message_id",
        "ref_table": "ai_messages",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "conversation_id",
        "ref_table": "ai_conversations",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "uploader_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "message_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Files (images, documents) attached by a user to a message within an ai_conversations thread, including any text extracted from them for the AI to read.",
    "module": "AI Engine",
    "icon": "paperclip"
  },
  "ai_analysis_consents": {
    "name": "ai_analysis_consents",
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
        "name": "policy_version",
        "type": "VARCHAR(20)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "ip_address",
        "type": "VARCHAR(64)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "consented_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      },
      {
        "name": "revoked_at",
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
          "user_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "project_id"
      ]
    ],
    "description": "Records a user's consent for a project to be analyzed by the AI engine, including the consented policy version and IP address, for compliance/audit purposes.",
    "module": "AI Engine",
    "icon": "shield"
  },
  "ai_code_review_issues": {
    "name": "ai_code_review_issues",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "review_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "category",
        "type": "ENUM('security','performance','maintainability','architecture','quality','general')",
        "nullable": false,
        "default": "'general'",
        "unique": false
      },
      {
        "name": "severity",
        "type": "ENUM('critical','high','medium','low','info')",
        "nullable": false,
        "default": "'medium'",
        "unique": false
      },
      {
        "name": "file_name",
        "type": "VARCHAR(500)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "line_number",
        "type": "INT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "description",
        "type": "TEXT",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "ai_recommendation",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "suggested_fix",
        "type": "TEXT",
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
        "column": "review_id",
        "ref_table": "ai_code_review_results",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "review_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "severity"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "category"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Individual findings (bugs, smells, suggestions) that make up one ai_code_review_results run, each with its own severity, file/line location, and suggested fix.",
    "module": "AI Engine",
    "icon": "bug"
  },
  "ai_insight_reports": {
    "name": "ai_insight_reports",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('completed','failed')",
        "nullable": false,
        "default": "'completed'",
        "unique": false
      },
      {
        "name": "result_json",
        "type": "LONGTEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "data_snapshot_json",
        "type": "LONGTEXT",
        "nullable": true,
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
        "name": "model_used",
        "type": "VARCHAR(100)",
        "nullable": true,
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
    "indexes": [
      {
        "cols": [
          "created_at"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Generated AI-driven analytics/insight reports (e.g. platform-wide trend summaries) with their JSON result payload and the data snapshot they were computed from.",
    "module": "AI Engine",
    "icon": "brain-circuit"
  },
  "ai_usage_logs": {
    "name": "ai_usage_logs",
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
        "name": "conversation_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "portal",
        "type": "VARCHAR(40)",
        "nullable": false,
        "default": "'general'",
        "unique": false
      },
      {
        "name": "model",
        "type": "VARCHAR(120)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "prompt_tokens",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "completion_tokens",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "latency_ms",
        "type": "INT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "was_error",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
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
      },
      {
        "column": "conversation_id",
        "ref_table": "ai_conversations",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "user_id",
          "created_at"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "portal",
          "created_at"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Per-request usage/telemetry log for AI Assistant calls (tokens, latency, errors), used for cost tracking and reliability monitoring across portals.",
    "module": "AI Engine",
    "icon": "activity"
  }
});
