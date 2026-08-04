/* ============================================================
   UIP Database Atlas — table definitions: Security & Audit
   ============================================================ */

Object.assign(SCHEMA.tables, {
  "security_logs": {
    "name": "security_logs",
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
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "event_type",
        "type": "VARCHAR(80)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "ip_address",
        "type": "VARCHAR(45)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "user_agent",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "severity",
        "type": "ENUM('info','warning','critical')",
        "nullable": false,
        "default": "'info'",
        "unique": false
      },
      {
        "name": "meta",
        "type": "JSON",
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
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "event_type",
          "severity"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Security & Audit",
    "module": "Security & Audit",
    "icon": "history"
  },
  "audit_logs": {
    "name": "audit_logs",
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
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "action",
        "type": "VARCHAR(100)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "subject_type",
        "type": "VARCHAR(100)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "subject_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "old_values",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "new_values",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "ip_address",
        "type": "VARCHAR(45)",
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
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "subject_type",
          "subject_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Audit Logs records.",
    "module": "Security & Audit",
    "icon": "scroll"
  },
  "blocked_ips": {
    "name": "blocked_ips",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "ip_address",
        "type": "VARCHAR(45)",
        "nullable": false,
        "default": null,
        "unique": true
      },
      {
        "name": "reason",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "blocked_by",
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
        "column": "blocked_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "ip_address"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Super-Admin IP blocking. When an admin suspects a user's IP address (e.g. abuse, repeated failed logins, fraud), they can block the IP outright — any login attempt from a blocked IP is rejected by AuthService::attemptLogin() before credentials are even chec...",
    "module": "Security & Audit",
    "icon": "ban"
  },
  "security_incidents": {
    "name": "security_incidents",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "reference_code",
        "type": "VARCHAR(20)",
        "nullable": false,
        "default": null,
        "unique": true
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
        "name": "category",
        "type": "ENUM('unauthorized_access','malware','data_leak','phishing', 'brute_force','policy_violation','other')",
        "nullable": false,
        "default": "'other'",
        "unique": false
      },
      {
        "name": "severity",
        "type": "ENUM('low','medium','high','critical')",
        "nullable": false,
        "default": "'low'",
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('open','investigating','contained','resolved','closed')",
        "nullable": false,
        "default": "'open'",
        "unique": false
      },
      {
        "name": "source_ip",
        "type": "VARCHAR(45)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "affected_user_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "related_log_ref",
        "type": "VARCHAR(64)",
        "nullable": true,
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
        "name": "created_by",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "detected_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
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
        "column": "affected_user_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      },
      {
        "column": "assigned_to",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      },
      {
        "column": "created_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "status",
          "severity"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Security incidents (raised manually or auto-escalated from security_logs)",
    "module": "Security & Audit",
    "icon": "siren"
  },
  "security_incident_events": {
    "name": "security_incident_events",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "incident_id",
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
        "name": "event_type",
        "type": "VARCHAR(60)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "note",
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
        "column": "incident_id",
        "ref_table": "security_incidents",
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
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Incident activity timeline (comments/status changes)",
    "module": "Security & Audit",
    "icon": "activity"
  },
  "user_sessions": {
    "name": "user_sessions",
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
        "name": "session_token",
        "type": "VARCHAR(128)",
        "nullable": false,
        "default": null,
        "unique": true
      },
      {
        "name": "ip_address",
        "type": "VARCHAR(45)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "user_agent",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "device_label",
        "type": "VARCHAR(120)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "location_label",
        "type": "VARCHAR(120)",
        "nullable": true,
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
        "name": "revoked_by",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "revoked_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "last_activity_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
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
        "name": "expires_at",
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
      },
      {
        "column": "revoked_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "user_id",
          "is_active"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Live/recent session management (distinct from security_logs which is an append-only event stream; this table tracks CURRENT session state so a Security Officer can revoke a session).",
    "module": "Security & Audit",
    "icon": "monitor"
  },
  "vulnerabilities": {
    "name": "vulnerabilities",
    "columns": [
      {
        "name": "id",
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
        "name": "affected_component",
        "type": "VARCHAR(150)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "severity",
        "type": "ENUM('low','medium','high','critical')",
        "nullable": false,
        "default": "'low'",
        "unique": false
      },
      {
        "name": "cvss_score",
        "type": "DECIMAL(3,1)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('open','in_progress','mitigated','resolved','accepted_risk')",
        "nullable": false,
        "default": "'open'",
        "unique": false
      },
      {
        "name": "discovered_by",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
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
        "name": "discovered_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
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
        "column": "discovered_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
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
          "status",
          "severity"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Vulnerability management",
    "module": "Security & Audit",
    "icon": "bug"
  },
  "security_policies": {
    "name": "security_policies",
    "columns": [
      {
        "name": "id",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "policy_key",
        "type": "VARCHAR(80)",
        "nullable": false,
        "default": null,
        "unique": true
      },
      {
        "name": "category",
        "type": "VARCHAR(60)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "name_ar",
        "type": "VARCHAR(150)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "name_en",
        "type": "VARCHAR(150)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "value",
        "type": "VARCHAR(255)",
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
        "name": "updated_by",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
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
        "column": "updated_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Security policy management (password policy, session timeout, lockout thresholds, etc.) — editable by Security Administrator / Admin.",
    "module": "Security & Audit",
    "icon": "file-lock"
  },
  "risk_scores": {
    "name": "risk_scores",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "entity_type",
        "type": "ENUM('user','ip')",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "entity_ref",
        "type": "VARCHAR(120)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "score",
        "type": "TINYINT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "level",
        "type": "ENUM('low','medium','high','critical')",
        "nullable": false,
        "default": "'low'",
        "unique": false
      },
      {
        "name": "factors",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "calculated_at",
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
          "level"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "entity_type",
        "entity_ref"
      ]
    ],
    "description": "Computed risk scores (per user or per IP), recalculated by a scheduled job",
    "module": "Security & Audit",
    "icon": "gauge"
  }
});
