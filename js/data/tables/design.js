/* ============================================================
   UIP Database Atlas — table definitions: Design & Collaboration
   ============================================================ */

Object.assign(SCHEMA.tables, {
  "designers": {
    "name": "designers",
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
        "unique": true
      },
      {
        "name": "specialization",
        "type": "VARCHAR(150)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "bio",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "portfolio_url",
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
        "name": "updated_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "unique": false
      },
      {
        "name": "is_public",
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
    "indexes": [],
    "uniques": [],
    "description": "A user's designer profile — specialization, bio, and portfolio link — for the Design & Collaboration workspace.",
    "module": "Design & Collaboration",
    "icon": "pen-tool"
  },
  "design_teams": {
    "name": "design_teams",
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
        "name": "created_by",
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
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "A named team of designers who collaborate together across design_projects.",
    "module": "Design & Collaboration",
    "icon": "users"
  },
  "design_team_members": {
    "name": "design_team_members",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "design_team_id",
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
        "name": "added_at",
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
        "column": "design_team_id",
        "ref_table": "design_teams",
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
        "design_team_id",
        "user_id"
      ]
    ],
    "description": "Membership roster linking users to a design_teams team.",
    "module": "Design & Collaboration",
    "icon": "users"
  },
  "design_projects": {
    "name": "design_projects",
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
        "type": "TEXT",
        "nullable": true,
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
        "name": "status",
        "type": "ENUM('active','archived')",
        "nullable": false,
        "default": "'active'",
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
    "description": "A design workspace/project that groups related design files, folders, and team members.",
    "module": "Design & Collaboration",
    "icon": "layers"
  },
  "design_folders": {
    "name": "design_folders",
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
        "name": "parent_folder_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "project_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
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
        "column": "parent_folder_id",
        "ref_table": "design_folders",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "project_id",
        "ref_table": "design_projects",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      },
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
    "description": "Folder hierarchy for organizing design_files within a design_projects project.",
    "module": "Design & Collaboration",
    "icon": "folder"
  },
  "design_screens": {
    "name": "design_screens",
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
        "name": "name",
        "type": "VARCHAR(150)",
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
        "column": "project_id",
        "ref_table": "design_projects",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Named screens/pages within a design project (e.g. \"Login\", \"Dashboard\"), used to group related design_files.",
    "module": "Design & Collaboration",
    "icon": "layout-dashboard"
  },
  "design_categories": {
    "name": "design_categories",
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
    "description": "Category taxonomy for organizing design_files.",
    "module": "Design & Collaboration",
    "icon": "folder"
  },
  "design_tags": {
    "name": "design_tags",
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
    "description": "Free-form tag vocabulary usable on design_files and assets.",
    "module": "Design & Collaboration",
    "icon": "tags"
  },
  "design_files": {
    "name": "design_files",
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
        "name": "folder_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "project_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "screen_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
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
        "name": "module",
        "type": "VARCHAR(100)",
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
        "name": "file_kind",
        "type": "ENUM('design','image','vector','document','asset')",
        "nullable": false,
        "default": "'asset'",
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
        "name": "thumbnail_path",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "external_link",
        "type": "VARCHAR(500)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('draft','in_review','needs_changes','approved','rejected','published')",
        "nullable": false,
        "default": "'draft'",
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
      },
      {
        "name": "deleted_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "due_date",
        "type": "DATE",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "deadline_reminder_sent_at",
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
        "column": "uploaded_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "folder_id",
        "ref_table": "design_folders",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      },
      {
        "column": "project_id",
        "ref_table": "design_projects",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      },
      {
        "column": "screen_id",
        "ref_table": "design_screens",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      },
      {
        "column": "category_id",
        "ref_table": "design_categories",
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
          "status"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "folder_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "project_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "deleted_at"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "An uploaded design asset (mockup, spec, prototype, or external link) with status, due date, and archive/soft-delete state.",
    "module": "Design & Collaboration",
    "icon": "image"
  },
  "design_file_tags": {
    "name": "design_file_tags",
    "columns": [
      {
        "name": "design_file_id",
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
      "design_file_id",
      "tag_id"
    ],
    "fks": [
      {
        "column": "design_file_id",
        "ref_table": "design_files",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "tag_id",
        "ref_table": "design_tags",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Many-to-many tag assignments linking design_files to design_tags.",
    "module": "Design & Collaboration",
    "icon": "tags"
  },
  "design_versions": {
    "name": "design_versions",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "design_file_id",
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
      },
      {
        "name": "is_protected",
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
        "column": "design_file_id",
        "ref_table": "design_files",
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
        "design_file_id",
        "version_number"
      ]
    ],
    "description": "Prior uploaded versions of a design_files file, optionally protected from deletion.",
    "module": "Design & Collaboration",
    "icon": "history"
  },
  "design_comments": {
    "name": "design_comments",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "design_file_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "version_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
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
        "name": "pos_x",
        "type": "DECIMAL(6,2)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "pos_y",
        "type": "DECIMAL(6,2)",
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
        "column": "design_file_id",
        "ref_table": "design_files",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "version_id",
        "ref_table": "design_versions",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      },
      {
        "column": "parent_comment_id",
        "ref_table": "design_comments",
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
          "design_file_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Threaded, optionally pinned-to-a-coordinate comments on a design file or a specific version of it.",
    "module": "Design & Collaboration",
    "icon": "messages-square"
  },
  "design_comment_mentions": {
    "name": "design_comment_mentions",
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
        "ref_table": "design_comments",
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
    "description": "@-mentions of another user within a design_comments comment.",
    "module": "Design & Collaboration",
    "icon": "at-sign"
  },
  "design_reviews": {
    "name": "design_reviews",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "design_file_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "version_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "reviewer_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "action",
        "type": "ENUM('approve','reject','request_changes')",
        "nullable": false,
        "default": null,
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
        "column": "design_file_id",
        "ref_table": "design_files",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "version_id",
        "ref_table": "design_versions",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      },
      {
        "column": "reviewer_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "A reviewer's approve/request-changes decision on a design file or version, with notes.",
    "module": "Design & Collaboration",
    "icon": "check-circle"
  },
  "design_shares": {
    "name": "design_shares",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "design_file_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "share_token",
        "type": "CHAR(36)",
        "nullable": false,
        "default": null,
        "unique": true
      },
      {
        "name": "visibility",
        "type": "ENUM('public','private','team')",
        "nullable": false,
        "default": "'private'",
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
        "name": "expires_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
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
        "name": "created_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP",
        "unique": false
      },
      {
        "name": "permission",
        "type": "ENUM('view', 'download')",
        "nullable": false,
        "default": "'download'",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "design_file_id",
        "ref_table": "design_files",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
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
    "description": "A shareable link (with visibility and optional expiry) for a design file, tracked by view count.",
    "module": "Design & Collaboration",
    "icon": "share-2"
  },
  "design_notes": {
    "name": "design_notes",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "design_file_id",
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
        "name": "body",
        "type": "TEXT",
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
        "column": "design_file_id",
        "ref_table": "design_files",
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
          "design_file_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "A user's freeform note attached to a design file.",
    "module": "Design & Collaboration",
    "icon": "file-text"
  },
  "design_system_items": {
    "name": "design_system_items",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "category",
        "type": "ENUM( 'color', 'typography', 'icon', 'button', 'component', 'card', 'form', 'input', 'navigation', 'spacing', 'grid', 'illustration', 'logo', 'token' )",
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
        "name": "token_key",
        "type": "VARCHAR(100)",
        "nullable": true,
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
        "name": "meta",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "design_file_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
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
        "name": "sort_order",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "0",
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
        "column": "design_file_id",
        "ref_table": "design_files",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      },
      {
        "column": "created_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
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
          "is_active"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "An entry in the design system/token library (colors, spacing, typography, components) that a team maintains for consistency.",
    "module": "Design & Collaboration",
    "icon": "palette"
  },
  "assets": {
    "name": "assets",
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
        "type": "ENUM('icon','image','logo','svg','illustration','animation','font','background','ui_component')",
        "nullable": false,
        "default": "'image'",
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
          "uploaded_by"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "A general-purpose shared file/media asset (not tied to one design project), taggable via design_tags.",
    "module": "Design & Collaboration",
    "icon": "image"
  },
  "asset_tags": {
    "name": "asset_tags",
    "columns": [
      {
        "name": "asset_id",
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
      "asset_id",
      "tag_id"
    ],
    "fks": [
      {
        "column": "asset_id",
        "ref_table": "assets",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "tag_id",
        "ref_table": "design_tags",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Many-to-many tag assignments linking assets to design_tags.",
    "module": "Design & Collaboration",
    "icon": "tags"
  },
  "asset_favorites": {
    "name": "asset_favorites",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "asset_id",
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
        "column": "asset_id",
        "ref_table": "assets",
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
    "uniques": [
      [
        "asset_id",
        "user_id"
      ]
    ],
    "description": "A user's favorited assets for quick access.",
    "module": "Design & Collaboration",
    "icon": "star"
  }
});
