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
  "api_files": {
    "name": "api_files",
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
        "name": "category",
        "type": "VARCHAR(50)",
        "nullable": false,
        "default": "'general'",
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
        "name": "stored_path",
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
        "name": "extension",
        "type": "VARCHAR(20)",
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
        "name": "download_count",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "0",
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
        "name": "deleted_at",
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
        "column": "uploaded_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "uploaded_by",
          "is_deleted"
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
    "description": "General-purpose file uploads made through the API layer, with soft-delete support and download tracking.",
    "module": "Settings & System",
    "icon": "file"
  }
});
