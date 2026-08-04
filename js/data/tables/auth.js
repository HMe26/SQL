/* ============================================================
   UIP Database Atlas — table definitions: Authentication & Access
   ============================================================ */

Object.assign(SCHEMA.tables, {
  "roles": {
    "name": "roles",
    "columns": [
      {
        "name": "id",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "slug",
        "type": "VARCHAR(50)",
        "nullable": false,
        "default": null,
        "unique": true
      },
      {
        "name": "name_ar",
        "type": "VARCHAR(100)",
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
        "name": "description",
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
      },
      {
        "name": "portal_prefix",
        "type": "VARCHAR(30)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "is_system",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [],
    "indexes": [],
    "uniques": [],
    "description": "Role & Permission Management (RBAC)",
    "module": "Authentication & Access",
    "icon": "shield"
  },
  "permissions": {
    "name": "permissions",
    "columns": [
      {
        "name": "id",
        "type": "INT UNSIGNED",
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
        "name": "module",
        "type": "VARCHAR(60)",
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
    "description": "Permissions records.",
    "module": "Authentication & Access",
    "icon": "badge-check"
  },
  "role_permission": {
    "name": "role_permission",
    "columns": [
      {
        "name": "role_id",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "permission_id",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      }
    ],
    "pk": [
      "role_id",
      "permission_id"
    ],
    "fks": [
      {
        "column": "role_id",
        "ref_table": "roles",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "permission_id",
        "ref_table": "permissions",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Role Permission records.",
    "module": "Authentication & Access",
    "icon": "link"
  },
  "user_roles": {
    "name": "user_roles",
    "columns": [
      {
        "name": "user_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "role_id",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "assigned_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "user_id",
      "role_id"
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
        "column": "role_id",
        "ref_table": "roles",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "User Roles records.",
    "module": "Authentication & Access",
    "icon": "link"
  },
  "password_reset_tokens": {
    "name": "password_reset_tokens",
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
        "name": "token_hash",
        "type": "VARCHAR(255)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "expires_at",
        "type": "DATETIME",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "used_at",
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
    "uniques": [],
    "description": "One-time tokens for the Forgot/Reset Password flow (app/Controllers/Auth).",
    "module": "Authentication & Access",
    "icon": "key-round"
  },
  "email_verification_tokens": {
    "name": "email_verification_tokens",
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
        "name": "token_hash",
        "type": "VARCHAR(255)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "expires_at",
        "type": "DATETIME",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "used_at",
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
    "uniques": [],
    "description": "One-time tokens for the Verify Email flow (app/Controllers/Auth/VerifyEmailController).",
    "module": "Authentication & Access",
    "icon": "mail-check"
  },
  "api_tokens": {
    "name": "api_tokens",
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
        "type": "VARCHAR(120)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "token_hash",
        "type": "CHAR(64)",
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
        "name": "last_used_at",
        "type": "DATETIME",
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
      }
    ],
    "indexes": [],
    "uniques": [
      [
        "token_hash"
      ]
    ],
    "description": "Backs Admin > Mobile App Management: long-lived bearer tokens issued to the future mobile client for API authentication. Only the SHA-256 hash is stored; the raw token is shown once at creation time, same pattern used for password-reset tokens elsewhere in ...",
    "module": "Authentication & Access",
    "icon": "terminal"
  },
  "user_permission_overrides": {
    "name": "user_permission_overrides",
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
        "name": "permission_id",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "effect",
        "type": "ENUM('grant','revoke')",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "granted_by",
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
        "column": "user_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "permission_id",
        "ref_table": "permissions",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "granted_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
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
        "user_id",
        "permission_id"
      ]
    ],
    "description": "Per-USER permission overrides on top of whatever their role already grants — e.g. \"this one student should also see the Data Analysis portal\" without creating/changing a role, or \"this one company account shouldn't be able to message students even though Co...",
    "module": "Authentication & Access",
    "icon": "key"
  }
});
