/* ============================================================
   UIP Database Atlas — table definitions: Partnerships & Investment
   ============================================================ */

Object.assign(SCHEMA.tables, {
  "company_project_interests": {
    "name": "company_project_interests",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "company_id",
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
        "name": "interest_type",
        "type": "ENUM('sponsorship','mentorship','hiring','collaboration','other')",
        "nullable": false,
        "default": "'collaboration'",
        "unique": false
      },
      {
        "name": "message",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('pending','accepted','declined')",
        "nullable": false,
        "default": "'pending'",
        "unique": false
      },
      {
        "name": "responded_by",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "responded_at",
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
      },
      {
        "name": "rejection_reason",
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
        "column": "company_id",
        "ref_table": "companies",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "project_id",
        "ref_table": "projects",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "responded_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "project_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "company_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "status"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "company_id",
        "project_id"
      ]
    ],
    "description": "A company's expression of interest in a student project (e.g. hiring, licensing), with the project owner's accept/decline response.",
    "module": "Partnerships & Investment",
    "icon": "handshake"
  },
  "company_researcher_collaborations": {
    "name": "company_researcher_collaborations",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "company_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "researcher_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "collaboration_type",
        "type": "ENUM('consulting','joint_research','sponsorship','technology_transfer','other')",
        "nullable": false,
        "default": "'joint_research'",
        "unique": false
      },
      {
        "name": "message",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('pending','accepted','declined')",
        "nullable": false,
        "default": "'pending'",
        "unique": false
      },
      {
        "name": "responded_by",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "responded_at",
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
      },
      {
        "name": "rejection_reason",
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
        "column": "company_id",
        "ref_table": "companies",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "researcher_id",
        "ref_table": "researchers",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "responded_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "researcher_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "company_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "status"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "company_id",
        "researcher_id"
      ]
    ],
    "description": "A collaboration request between a company and a researcher, with a response/rejection workflow.",
    "module": "Partnerships & Investment",
    "icon": "handshake"
  },
  "company_university_partnerships": {
    "name": "company_university_partnerships",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "company_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "university_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "partnership_type",
        "type": "ENUM('sponsorship','recruitment','research_collaboration','curriculum','other')",
        "nullable": false,
        "default": "'sponsorship'",
        "unique": false
      },
      {
        "name": "message",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('pending','accepted','declined')",
        "nullable": false,
        "default": "'pending'",
        "unique": false
      },
      {
        "name": "responded_by",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "responded_at",
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
      },
      {
        "name": "rejection_reason",
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
        "column": "company_id",
        "ref_table": "companies",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "university_id",
        "ref_table": "universities",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "responded_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "university_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "company_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "status"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "company_id",
        "university_id"
      ]
    ],
    "description": "A formal partnership request/relationship between a company and a university, with a response/rejection workflow.",
    "module": "Partnerships & Investment",
    "icon": "handshake"
  },
  "investor_company_connections": {
    "name": "investor_company_connections",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "investor_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "company_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "connection_type",
        "type": "ENUM('investment_interest','strategic_partnership','advisory','acquisition_interest','other')",
        "nullable": false,
        "default": "'investment_interest'",
        "unique": false
      },
      {
        "name": "message",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('pending','accepted','declined')",
        "nullable": false,
        "default": "'pending'",
        "unique": false
      },
      {
        "name": "responded_by",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "responded_at",
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
      },
      {
        "name": "rejection_reason",
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
        "column": "investor_id",
        "ref_table": "investors",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "company_id",
        "ref_table": "companies",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "responded_by",
        "ref_table": "users",
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
          "investor_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "status"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "investor_id",
        "company_id"
      ]
    ],
    "description": "A connection request between an investor and a company, with a response/rejection workflow.",
    "module": "Partnerships & Investment",
    "icon": "handshake"
  },
  "investor_university_partnerships": {
    "name": "investor_university_partnerships",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "investor_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "university_id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "partnership_type",
        "type": "ENUM('scholarship_fund','research_grant','incubator_partnership','deal_flow_pipeline','other')",
        "nullable": false,
        "default": "'scholarship_fund'",
        "unique": false
      },
      {
        "name": "message",
        "type": "TEXT",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('pending','accepted','declined')",
        "nullable": false,
        "default": "'pending'",
        "unique": false
      },
      {
        "name": "responded_by",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "responded_at",
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
      },
      {
        "name": "rejection_reason",
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
        "column": "investor_id",
        "ref_table": "investors",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "university_id",
        "ref_table": "universities",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "responded_by",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "university_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "investor_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "status"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "investor_id",
        "university_id"
      ]
    ],
    "description": "A formal partnership request/relationship between an investor and a university, with a response/rejection workflow.",
    "module": "Partnerships & Investment",
    "icon": "handshake"
  },
  "investor_investments": {
    "name": "investor_investments",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "investor_id",
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
        "name": "amount",
        "type": "DECIMAL(15,2)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "stage",
        "type": "ENUM('pre_seed','seed','series_a','series_b','growth','other')",
        "nullable": false,
        "default": "'seed'",
        "unique": false
      },
      {
        "name": "invested_at",
        "type": "DATE",
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
      },
      {
        "name": "updated_at",
        "type": "DATETIME",
        "nullable": false,
        "default": "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        "unique": false
      },
      {
        "name": "current_value",
        "type": "DECIMAL(15,2)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('active','closed','exited')",
        "nullable": false,
        "default": "'active'",
        "unique": false
      },
      {
        "name": "is_archived",
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
        "column": "investor_id",
        "ref_table": "investors",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
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
          "investor_id"
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
          "status"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "is_archived"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "A record of an investor's investment in a project — amount, stage, and current tracked value over time.",
    "module": "Partnerships & Investment",
    "icon": "wallet"
  },
  "investor_investment_documents": {
    "name": "investor_investment_documents",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "investor_investment_id",
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
        "column": "investor_investment_id",
        "ref_table": "investor_investments",
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
    "indexes": [
      {
        "cols": [
          "investor_investment_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Supporting documents (term sheets, agreements) attached to an investor_investments record.",
    "module": "Partnerships & Investment",
    "icon": "file-text"
  },
  "investor_report_categories": {
    "name": "investor_report_categories",
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
    "description": "Folder-like category taxonomy for organizing investor_report_files.",
    "module": "Partnerships & Investment",
    "icon": "folder"
  },
  "investor_report_tags": {
    "name": "investor_report_tags",
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
    "description": "Free-form tag vocabulary usable on investor_report_files.",
    "module": "Partnerships & Investment",
    "icon": "tags"
  },
  "investor_report_files": {
    "name": "investor_report_files",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "investor_id",
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
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "investor_id",
        "ref_table": "investors",
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
      },
      {
        "column": "category_id",
        "ref_table": "investor_report_categories",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "investor_id"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "uploaded_by"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "is_archived"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "category_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "An investor's uploaded report documents, with view/download counters and archive state.",
    "module": "Partnerships & Investment",
    "icon": "file-text"
  },
  "investor_report_file_versions": {
    "name": "investor_report_file_versions",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "investor_report_file_id",
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
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "investor_report_file_id",
        "ref_table": "investor_report_files",
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
        "investor_report_file_id",
        "version_number"
      ]
    ],
    "description": "Prior uploaded versions of an investor report file, kept for history when a newer version is uploaded.",
    "module": "Partnerships & Investment",
    "icon": "history"
  },
  "investor_report_file_tags": {
    "name": "investor_report_file_tags",
    "columns": [
      {
        "name": "investor_report_file_id",
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
      "investor_report_file_id",
      "tag_id"
    ],
    "fks": [
      {
        "column": "investor_report_file_id",
        "ref_table": "investor_report_files",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "tag_id",
        "ref_table": "investor_report_tags",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [],
    "uniques": [],
    "description": "Many-to-many tag assignments linking investor_report_files to investor_report_tags.",
    "module": "Partnerships & Investment",
    "icon": "tags"
  }
});
