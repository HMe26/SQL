/* ============================================================
   UIP Database Atlas — table definitions: Messaging & Notifications
   ============================================================ */

Object.assign(SCHEMA.tables, {
  "notifications": {
    "name": "notifications",
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
        "name": "type",
        "type": "VARCHAR(80)",
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
        "name": "body",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "link_url",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "is_read",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "read_at",
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
          "user_id",
          "is_read"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Notifications records.",
    "module": "Messaging & Notifications",
    "icon": "bell"
  },
  "conversations": {
    "name": "conversations",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "subject",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "related_project_id",
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
        "column": "related_project_id",
        "ref_table": "projects",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Messaging system",
    "module": "Messaging & Notifications",
    "icon": "messages-square"
  },
  "conversation_participants": {
    "name": "conversation_participants",
    "columns": [
      {
        "name": "conversation_id",
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
        "name": "joined_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      },
      {
        "name": "last_read_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      }
    ],
    "pk": [
      "conversation_id",
      "user_id"
    ],
    "fks": [
      {
        "column": "conversation_id",
        "ref_table": "conversations",
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
    "description": "Conversation Participants records.",
    "module": "Messaging & Notifications",
    "icon": "link"
  },
  "messages": {
    "name": "messages",
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
        "name": "sender_id",
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
        "name": "attachment_path",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "is_edited",
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
        "column": "conversation_id",
        "ref_table": "conversations",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "sender_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
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
      }
    ],
    "uniques": [],
    "description": "Messages records.",
    "module": "Messaging & Notifications",
    "icon": "message-circle"
  },
  "security_notifications": {
    "name": "security_notifications",
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
        "name": "message",
        "type": "TEXT",
        "nullable": false,
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
        "name": "source",
        "type": "VARCHAR(60)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "source_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "is_read",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "recipient_role",
        "type": "VARCHAR(50)",
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
    "description": "Security-specific notifications feed (separate from the generic notifications table so the Security Dashboard can show a focused stream without filtering another portal's noise).",
    "module": "Messaging & Notifications",
    "icon": "bell-ring"
  }
});
