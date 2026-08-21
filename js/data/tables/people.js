/* ============================================================
   UIP Database Atlas — table definitions: People & Profiles
   ============================================================ */

Object.assign(SCHEMA.tables, {
  "users": {
    "name": "users",
    "columns": [
      {
        "name": "id",
        "type": "BIGINT UNSIGNED",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "uuid",
        "type": "CHAR(36)",
        "nullable": false,
        "default": null,
        "unique": true
      },
      {
        "name": "full_name",
        "type": "VARCHAR(150)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "email",
        "type": "VARCHAR(190)",
        "nullable": false,
        "default": null,
        "unique": true
      },
      {
        "name": "phone",
        "type": "VARCHAR(30)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "password_hash",
        "type": "VARCHAR(255)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "avatar_path",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "preferred_language",
        "type": "ENUM('ar','en')",
        "nullable": false,
        "default": "'ar'",
        "unique": false
      },
      {
        "name": "theme_preference",
        "type": "ENUM('light','dark')",
        "nullable": false,
        "default": "'light'",
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('active','pending','suspended','banned')",
        "nullable": false,
        "default": "'pending'",
        "unique": false
      },
      {
        "name": "email_verified_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "last_login_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "last_login_ip",
        "type": "VARCHAR(45)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "two_factor_enabled",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "remember_token",
        "type": "VARCHAR(100)",
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
        "name": "deleted_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "two_factor_secret",
        "type": "VARCHAR(64)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "two_factor_confirmed_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "two_factor_recovery_codes",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "pending_email",
        "type": "VARCHAR(190)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "failed_login_attempts",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "locked_until",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "lock_permanent",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "lock_reason",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "locked_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "unlocked_by",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "unlocked_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "password_changed_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "must_change_password",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "mfa_grace_started_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
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
          "email"
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
    "uniques": [],
    "description": "Core identity table. Every portal user (student/university/company/ researcher/investor/admin) is a row here; role-specific data lives in the dedicated profile tables (students, universities, companies, ...).",
    "module": "People & Profiles",
    "icon": "user"
  },
  "universities": {
    "name": "universities",
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
        "name": "official_name_ar",
        "type": "VARCHAR(200)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "official_name_en",
        "type": "VARCHAR(200)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "country",
        "type": "VARCHAR(100)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "city",
        "type": "VARCHAR(100)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "website",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "logo_path",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "verification_status",
        "type": "ENUM('unverified','pending','verified','rejected')",
        "nullable": false,
        "default": "'pending'",
        "unique": false
      },
      {
        "name": "verified_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "verified_by",
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
        "name": "is_public",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "1",
        "unique": false
      },
      {
        "name": "verification_period_days",
        "type": "INT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "verification_expires_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "verification_expiry_notified_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "auto_reverify_enabled",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "1",
        "unique": false
      },
      {
        "name": "slug",
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
          "verification_status"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "verification_expires_at"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "slug"
      ]
    ],
    "description": "Universities records.",
    "module": "People & Profiles",
    "icon": "landmark"
  },
  "companies": {
    "name": "companies",
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
        "name": "company_name",
        "type": "VARCHAR(200)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "industry",
        "type": "VARCHAR(150)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "company_size",
        "type": "ENUM('1-10','11-50','51-200','201-1000','1000+')",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "website",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "logo_path",
        "type": "VARCHAR(255)",
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
        "name": "is_verified",
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
        "name": "is_public",
        "type": "TINYINT(1)",
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
    "indexes": [],
    "uniques": [],
    "description": "Companies records.",
    "module": "People & Profiles",
    "icon": "building-2"
  },
  "researchers": {
    "name": "researchers",
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
        "name": "university_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "academic_title",
        "type": "VARCHAR(100)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "research_field",
        "type": "VARCHAR(200)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "publications_count",
        "type": "INT UNSIGNED",
        "nullable": true,
        "default": "0",
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
        "name": "faculty",
        "type": "VARCHAR(150)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "department",
        "type": "VARCHAR(150)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "research_interests",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "specializations",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "orcid_id",
        "type": "VARCHAR(50)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "google_scholar_url",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "researchgate_url",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "linkedin_url",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "cv_path",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "is_public",
        "type": "TINYINT(1)",
        "nullable": false,
        "default": "1",
        "unique": false
      },
      {
        "name": "is_verified",
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
      },
      {
        "column": "university_id",
        "ref_table": "universities",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "is_public"
        ],
        "fulltext": false
      },
      {
        "cols": [
          "is_verified"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Researchers records.",
    "module": "People & Profiles",
    "icon": "flask-conical"
  },
  "investors": {
    "name": "investors",
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
        "name": "investor_type",
        "type": "ENUM('individual','vc_firm','accelerator','government')",
        "nullable": false,
        "default": "'individual'",
        "unique": false
      },
      {
        "name": "firm_name",
        "type": "VARCHAR(200)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "interested_sectors",
        "type": "JSON",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "investment_range_min",
        "type": "DECIMAL(15,2)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "investment_range_max",
        "type": "DECIMAL(15,2)",
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
        "name": "is_verified",
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
    "indexes": [
      {
        "cols": [
          "is_verified"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Investors records.",
    "module": "People & Profiles",
    "icon": "trending-up"
  },
  "university_verification_requests": {
    "name": "university_verification_requests",
    "columns": [
      {
        "name": "id",
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
        "name": "document_path",
        "type": "VARCHAR(255)",
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
      },
      {
        "name": "status",
        "type": "ENUM('pending','approved','rejected')",
        "nullable": false,
        "default": "'pending'",
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
        "name": "reviewed_at",
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
        "column": "university_id",
        "ref_table": "universities",
        "ref_column": "id",
        "on_delete": "CASCADE",
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
    "indexes": [],
    "uniques": [],
    "description": "University Verification Requests records.",
    "module": "People & Profiles",
    "icon": "check-circle"
  },
  "supervisors": {
    "name": "supervisors",
    "columns": [
      {
        "name": "id",
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
        "name": "full_name",
        "type": "VARCHAR(150)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "email",
        "type": "VARCHAR(190)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "department",
        "type": "VARCHAR(150)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "title",
        "type": "VARCHAR(100)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('active','inactive')",
        "nullable": false,
        "default": "'active'",
        "unique": false
      },
      {
        "name": "invited_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "activated_at",
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
        "name": "user_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": true
      },
      {
        "name": "permissions",
        "type": "VARCHAR(255)",
        "nullable": false,
        "default": "'",
        "unique": false
      }
    ],
    "pk": [
      "id"
    ],
    "fks": [
      {
        "column": "university_id",
        "ref_table": "universities",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "university_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "university_id",
        "email"
      ]
    ],
    "description": "University-managed faculty/supervisor roster (\"Supervisor Management\" — previously a Coming Soon card on university/settings.php). Deliberately a lightweight roster, NOT a new login-capable user role: supervisors are not one of the platform's 6 portals, so ...",
    "module": "People & Profiles",
    "icon": "user-check"
  },
  "company_team_members": {
    "name": "company_team_members",
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
        "name": "full_name",
        "type": "VARCHAR(150)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "email",
        "type": "VARCHAR(190)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "role_title",
        "type": "VARCHAR(100)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('active','inactive')",
        "nullable": false,
        "default": "'active'",
        "unique": false
      },
      {
        "name": "invited_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "activated_at",
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
        "name": "user_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": true
      },
      {
        "name": "permissions",
        "type": "VARCHAR(255)",
        "nullable": false,
        "default": "'",
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
      }
    ],
    "indexes": [
      {
        "cols": [
          "company_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "company_id",
        "email"
      ]
    ],
    "description": "A company account's team roster — colleagues invited by the owner, each optionally linked to their own user account once they accept the invite.",
    "module": "People & Profiles",
    "icon": "users"
  },
  "investor_team_members": {
    "name": "investor_team_members",
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
        "name": "full_name",
        "type": "VARCHAR(150)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "email",
        "type": "VARCHAR(190)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "role_title",
        "type": "VARCHAR(100)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('active','inactive')",
        "nullable": false,
        "default": "'active'",
        "unique": false
      },
      {
        "name": "invited_at",
        "type": "DATETIME",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "activated_at",
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
        "name": "user_id",
        "type": "BIGINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": true
      },
      {
        "name": "permissions",
        "type": "VARCHAR(255)",
        "nullable": false,
        "default": "'",
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
      }
    ],
    "indexes": [
      {
        "cols": [
          "investor_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "investor_id",
        "email"
      ]
    ],
    "description": "An investor account's team roster — colleagues invited by the owner, each optionally linked to their own user account once they accept the invite.",
    "module": "People & Profiles",
    "icon": "users"
  },
  "publications": {
    "name": "publications",
    "columns": [
      {
        "name": "id",
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
        "name": "title",
        "type": "VARCHAR(500)",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "journal",
        "type": "VARCHAR(255)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "year",
        "type": "SMALLINT UNSIGNED",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "doi",
        "type": "VARCHAR(120)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "citations",
        "type": "INT UNSIGNED",
        "nullable": false,
        "default": "0",
        "unique": false
      },
      {
        "name": "source",
        "type": "ENUM('manual','orcid')",
        "nullable": false,
        "default": "'manual'",
        "unique": false
      },
      {
        "name": "orcid_put_code",
        "type": "VARCHAR(50)",
        "nullable": true,
        "default": null,
        "unique": false
      },
      {
        "name": "status",
        "type": "ENUM('published','under_review')",
        "nullable": false,
        "default": "'published'",
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
        "column": "researcher_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "researcher_id"
        ],
        "fulltext": false
      }
    ],
    "uniques": [
      [
        "researcher_id",
        "orcid_put_code"
      ]
    ],
    "description": "A researcher's academic publications (papers, journal articles), including citation counts and an optional ORCID reference for syncing.",
    "module": "People & Profiles",
    "icon": "book-open"
  },
  "university_reverification_log": {
    "name": "university_reverification_log",
    "columns": [
      {
        "name": "id",
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
        "name": "event",
        "type": "ENUM('notified', 'auto_renewed', 'reverted_pending', 'failed')",
        "nullable": false,
        "default": null,
        "unique": false
      },
      {
        "name": "method",
        "type": "ENUM('automatic', 'manual')",
        "nullable": false,
        "default": "'automatic'",
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
        "name": "actor_id",
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
        "column": "university_id",
        "ref_table": "universities",
        "ref_column": "id",
        "on_delete": "CASCADE",
        "on_update": "RESTRICT"
      },
      {
        "column": "actor_id",
        "ref_table": "users",
        "ref_column": "id",
        "on_delete": "SET NULL",
        "on_update": "RESTRICT"
      }
    ],
    "indexes": [
      {
        "cols": [
          "university_id",
          "created_at"
        ],
        "fulltext": false
      }
    ],
    "uniques": [],
    "description": "Audit trail of a university's periodic re-verification lifecycle — every automatic or manual verification event, who triggered it, and how.",
    "module": "People & Profiles",
    "icon": "history"
  }
});
