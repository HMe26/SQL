/* ============================================================
   UIP Database Atlas — table definitions: Settings & System
   ============================================================ */

Object.assign(SCHEMA.tables, {
  "settings": {
    "name": "settings",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "scope",
        "type": "ENUM('global','user')",
        "nullable": false,
        "default": "'global'",
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
        "name": "key",
        "type": "VARCHAR(150)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "value",
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
    "uniques": [
      [
        "scope",
        "user_id",
        "key"
      ]
    ],
    "description": "Settings records.",
    "module": "Settings & System",
    "icon": "settings"
  },
  "demo_seed_batches": {
    "name": "demo_seed_batches",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "batch_id",
        "type": "CHAR(36)",
        "nullable": false,
        "default": null,
        "unique": true
      },
      {
        "name": "label",
        "type": "VARCHAR(150)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "students_count",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('running','completed','failed','deleted')",
        "nullable": false,
        "default": "'running'",
        "unique": false
      },
      {
        "name": "started_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      },
      {
        "name": "finished_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "notes",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [],
    "indexes": [],
    "uniques": [],
    "description": "Demo Data Batch Tracking Every run of database/seeders/generate_demo_data.php gets a unique batch_id (UUID). Most inserted rows (students, projects, ai_analysis...) are cleaned up automatically via existing ON DELETE CASCADE from users(id) when the demo use...",
    "module": "Settings & System",
    "icon": "database"
  },
  "demo_seed_log": {
    "name": "demo_seed_log",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "batch_id",
        "type": "CHAR(36)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "table_name",
        "type": "VARCHAR(64)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "record_id",
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
    "fks": [],
    "indexes": [
      {
        "cols": [
          "batch_id",
          "table_name"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Demo Seed Log records.",
    "module": "Settings & System",
    "icon": "list"
  }
});
