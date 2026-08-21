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
      },
      {
        "name": "priority",
        "type": "VARCHAR(10)",
        "nullable": false,
        "default": "'normal'",
        "unique": false
      },
      {
        "name": "category",
        "type": "VARCHAR(50)",
        "nullable": true,
        "default": null,
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
        "name": "is_important",
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
        "name": "archived_at",
        "type": "DATETIME",
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
        "name": "deleted_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "deleted_reason",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "occurrence_count",
        "type": "SMALLINT UNSIGNED",
        "nullable": false,
        "default": "1",
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
      },
      {
        "cols": [
          "user_id",
          "is_deleted",
          "is_archived",
          "is_read"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "user_id",
          "is_pinned"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "user_id",
          "is_important"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "user_id",
          "category"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "user_id",
          "created_at"
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
      },
      {
        "name": "is_group",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "group_name",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "company_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "design_team_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "student_group_id",
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
        "column": "related_project_id",
        "ref_table": "projects",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      },
      {
        "column": "company_id",
        "ref_table": "companies",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      },
      {
        "column": "design_team_id",
        "ref_table": "design_teams",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "student_group_id",
        "ref_table": "student_groups",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "company_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "design_team_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "student_group_id"
        ],
        "fulltext": false
      }
    ],
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
      },
      {
        "name": "role",
        "type": "VARCHAR(20)",
        "nullable": false,
        "default": "'member'",
        "unique": false
      },
      {
        "name": "is_favorite",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
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
        "name": "is_muted",
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
        "name": "category",
        "type": "VARCHAR(50)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "last_typing_at",
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
      },
      {
        "name": "parent_message_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "forwarded_from_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "message_type",
        "type": "VARCHAR(20)",
        "nullable": false,
        "default": "'text'",
        "unique": false
      },
      {
        "name": "metadata",
        "type": "JSON",
        "nullable": true,
        "default": null,
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
        "name": "edited_at",
        "type": "DATETIME",
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
        "name": "deleted_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "deleted_by",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "deleted_reason",
        "type": "VARCHAR(255)",
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
      },
      {
        "column": "parent_message_id",
        "ref_table": "messages",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      },
      {
        "column": "forwarded_from_id",
        "ref_table": "messages",
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
          "parent_message_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "conversation_id",
          "is_pinned"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Messages records.",
    "module": "Messaging & Notifications",
    "icon": "message-circle"
  },
  "message_attachments": {
    "name": "message_attachments",
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
        "default": "'file'",
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
        "type": "VARCHAR(127)",
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
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "width",
        "type": "INT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "height",
        "type": "INT UNSIGNED",
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
      },
      {
        "name": "waveform_json",
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
      },
      {
        "name": "is_encrypted",
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
        "column": "message_id",
        "ref_table": "messages",
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
    "description": "Files, images, audio, or other media attached to a chat message, including basic media metadata (dimensions, duration, waveform) for rich rendering.",
    "module": "Messaging & Notifications",
    "icon": "paperclip"
  },
  "message_reactions": {
    "name": "message_reactions",
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
        "name": "emoji",
        "type": "VARCHAR(16)",
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
        "column": "message_id",
        "ref_table": "messages",
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
          "message_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "message_id",
        "user_id",
        "emoji"
      ]
    ],
    "description": "Emoji reactions left by users on a message.",
    "module": "Messaging & Notifications",
    "icon": "smile"
  },
  "message_read_receipts": {
    "name": "message_read_receipts",
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
        "name": "delivered_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "read_at",
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
        "column": "message_id",
        "ref_table": "messages",
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
        "message_id",
        "user_id"
      ]
    ],
    "description": "Per-user delivered/read timestamps for a message, powering read-receipt indicators.",
    "module": "Messaging & Notifications",
    "icon": "check-check"
  },
  "message_mentions": {
    "name": "message_mentions",
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
        "column": "message_id",
        "ref_table": "messages",
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
    "indexes": [
      {
        "cols": [
          "mentioned_user_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "message_id",
        "mentioned_user_id"
      ]
    ],
    "description": "@-mentions of another user within a message body, driving mention notifications.",
    "module": "Messaging & Notifications",
    "icon": "at-sign"
  },
  "message_hashtags": {
    "name": "message_hashtags",
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
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "tag",
        "type": "VARCHAR(100)",
        "nullable": false,
        "default": null,
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "message_id",
        "ref_table": "messages",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "tag"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Hashtags parsed out of a message body, so conversations can be searched/filtered by topic tag.",
    "module": "Messaging & Notifications",
    "icon": "hash"
  },
  "message_versions": {
    "name": "message_versions",
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
        "name": "edited_at",
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
        "ref_table": "messages",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "message_id",
          "edited_at"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Prior versions of a message body, kept whenever a message is edited so the edit history is preserved.",
    "module": "Messaging & Notifications",
    "icon": "history"
  },
  "message_poll_votes": {
    "name": "message_poll_votes",
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
        "name": "option_index",
        "type": "TINYINT UNSIGNED",
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
        "column": "message_id",
        "ref_table": "messages",
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
          "message_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "message_id",
        "user_id",
        "option_index"
      ]
    ],
    "description": "A user's vote on a poll-type message, recording which option index they picked.",
    "module": "Messaging & Notifications",
    "icon": "bar-chart-2"
  },
  "message_hidden_for_user": {
    "name": "message_hidden_for_user",
    "columns": [
      {
        "name": "message_id",
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
        "name": "hidden_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      }
    ],
    "pk": [
      "message_id",
      "user_id"
    ],
    "fks": [
      {
        "column": "message_id",
        "ref_table": "messages",
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
    "description": "Per-user 'hide conversation from my view' state for a message, without deleting it for the other participant(s).",
    "module": "Messaging & Notifications",
    "icon": "eye-off"
  },
  "messaging_permission_grants": {
    "name": "messaging_permission_grants",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "user_a_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "user_b_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "requested_by",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('pending','approved','rejected','revoked')",
        "nullable": false,
        "default": "'pending'",
        "unique": false
      },
      {
        "name": "reason",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "decided_by",
        "type": "BIGINT UNSIGNED",
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
        "column": "user_a_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "user_b_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "requested_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "decided_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "user_a_id",
          "status"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "user_b_id",
          "status"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "user_a_id",
        "user_b_id"
      ]
    ],
    "description": "Explicit consent record between two users allowing them to message each other outside their normal role-based messaging rules, with the requester/decider and reasoning.",
    "module": "Messaging & Notifications",
    "icon": "shield"
  },
  "user_presence": {
    "name": "user_presence",
    "columns": [
      {
        "name": "user_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "last_seen_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "is_typing_in",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "typing_started_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      }
    ],
    "pk": [
      "user_id"
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
        "column": "is_typing_in",
        "ref_table": "conversations",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "A user's live presence — last-seen timestamp and, if they're actively typing, which conversation and since when.",
    "module": "Messaging & Notifications",
    "icon": "circle-dot"
  },
  "notification_email_queue": {
    "name": "notification_email_queue",
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
        "name": "notification_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "kind",
        "type": "VARCHAR(10)",
        "nullable": false,
        "default": "'single'",
        "unique": false
      },
      {
        "name": "to_email",
        "type": "VARCHAR(190)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "to_name",
        "type": "VARCHAR(190)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "subject",
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
        "name": "locale",
        "type": "VARCHAR(5)",
        "nullable": false,
        "default": "'ar'",
        "unique": false
      },
      {
        "name": "status",
        "type": "VARCHAR(10)",
        "nullable": false,
        "default": "'pending'",
        "unique": false
      },
      {
        "name": "attempts",
        "type": "TINYINT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "max_attempts",
        "type": "TINYINT UNSIGNED",
        "nullable": false,
        "default": "5",
        "unique": false
      },
      {
        "name": "next_attempt_at",
        "type": "DATETIME",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "last_error",
        "type": "VARCHAR(500)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "sent_at",
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
      },
      {
        "column": "notification_id",
        "ref_table": "notifications",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "status",
          "next_attempt_at"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "user_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Outbound queue of transactional emails generated from in-app notifications, with retry/backoff bookkeeping (attempts, next_attempt_at, last_error).",
    "module": "Messaging & Notifications",
    "icon": "mail-check"
  }
});
