/* ============================================================
   UIP Database Atlas — schema data
   Auto-generated from database/migrations/*.sql (47 migrations)
   62 tables · 506 columns · 67 PK · 79 FK · 36 indexes
   ============================================================ */

const SCHEMA = {
  "tables": {
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
    "students": {
      "name": "students",
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
          "name": "student_number",
          "type": "VARCHAR(50)",
          "nullable": true,
          "default": null,
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
          "name": "academic_year",
          "type": "TINYINT UNSIGNED",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "gpa",
          "type": "DECIMAL(3,2)",
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
          "name": "skills",
          "type": "JSON",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "social_links",
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
            "university_id"
          ],
          "fulltext": false
        }
      ],
      "uniques": [],
      "description": "Students records.",
      "module": "People & Profiles",
      "icon": "graduation-cap"
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
        }
      ],
      "uniques": [],
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
      "indexes": [],
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
      "description": "Investors records.",
      "module": "People & Profiles",
      "icon": "trending-up"
    },
    "projects": {
      "name": "projects",
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
          "name": "owner_id",
          "type": "BIGINT UNSIGNED",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "university_id",
          "type": "BIGINT UNSIGNED",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "title_ar",
          "type": "VARCHAR(255)",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "title_en",
          "type": "VARCHAR(255)",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "summary",
          "type": "TEXT",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "description",
          "type": "LONGTEXT",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "category",
          "type": "VARCHAR(100)",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "tags",
          "type": "JSON",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "cover_image_path",
          "type": "VARCHAR(255)",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "repository_url",
          "type": "VARCHAR(255)",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "demo_url",
          "type": "VARCHAR(255)",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "visibility",
          "type": "ENUM('private','university_only','public')",
          "nullable": false,
          "default": "'private'",
          "unique": false
        },
        {
          "name": "status",
          "type": "ENUM('draft','submitted','under_review','approved','rejected','published','archived')",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "views_count",
          "type": "INT UNSIGNED",
          "nullable": false,
          "default": "0",
          "unique": false
        },
        {
          "name": "likes_count",
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
        },
        {
          "name": "published_at",
          "type": "DATETIME",
          "nullable": true,
          "default": null,
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
          "name": "supervisor_name",
          "type": "VARCHAR(150)",
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
          "column": "owner_id",
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
            "status"
          ],
          "fulltext": false
        },
        {
          "cols": [
            "category"
          ],
          "fulltext": false
        },
        {
          "cols": [
            "title_ar",
            "title_en",
            "summary"
          ],
          "fulltext": true
        }
      ],
      "uniques": [],
      "description": "Central domain entity: graduation / innovation projects",
      "module": "Projects & Portfolio",
      "icon": "rocket"
    },
    "project_files": {
      "name": "project_files",
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
          "name": "uploaded_by",
          "type": "BIGINT UNSIGNED",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "file_type",
          "type": "ENUM('document','image','video','presentation','source_code','other')",
          "nullable": false,
          "default": "'document'",
          "unique": false
        },
        {
          "name": "file_path",
          "type": "VARCHAR(255)",
          "nullable": false,
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
          "type": "VARCHAR(100)",
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
      "uniques": [],
      "description": "Project Files records.",
      "module": "Projects & Portfolio",
      "icon": "file"
    },
    "project_approvals": {
      "name": "project_approvals",
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
          "name": "reviewer_id",
          "type": "BIGINT UNSIGNED",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "stage",
          "type": "ENUM('university_review','admin_review')",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "decision",
          "type": "ENUM('pending','approved','rejected','changes_requested')",
          "nullable": false,
          "default": "'pending'",
          "unique": false
        },
        {
          "name": "comments",
          "type": "TEXT",
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
          "column": "reviewer_id",
          "ref_table": "users",
          "ref_column": "id",
          "on_delete": "CASCADE",
          "on_update": "RESTRICT"
        }
      ],
      "indexes": [
        {
          "cols": [
            "stage",
            "decision"
          ],
          "fulltext": false
        }
      ],
      "uniques": [],
      "description": "Project Approval Workflow (multi-step: university -> admin)",
      "module": "Projects & Portfolio",
      "icon": "check-circle"
    },
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
    "portfolios": {
      "name": "portfolios",
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
          "name": "headline",
          "type": "VARCHAR(255)",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "about",
          "type": "TEXT",
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
          "name": "theme",
          "type": "VARCHAR(50)",
          "nullable": false,
          "default": "'default'",
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
      "uniques": [],
      "description": "Portfolios records.",
      "module": "Projects & Portfolio",
      "icon": "bookmark"
    },
    "portfolio_projects": {
      "name": "portfolio_projects",
      "columns": [
        {
          "name": "portfolio_id",
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
          "name": "display_order",
          "type": "TINYINT UNSIGNED",
          "nullable": false,
          "default": "0",
          "unique": false
        }
      ],
      "pk": [
        "portfolio_id",
        "project_id"
      ],
      "fks": [
        {
          "column": "portfolio_id",
          "ref_table": "portfolios",
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
      "indexes": [],
      "uniques": [],
      "description": "Portfolio Projects records.",
      "module": "Projects & Portfolio",
      "icon": "link"
    },
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
    "analytics_records": {
      "name": "analytics_records",
      "columns": [
        {
          "name": "id",
          "type": "BIGINT UNSIGNED",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "metric_key",
          "type": "VARCHAR(100)",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "metric_value",
          "type": "DECIMAL(18,2)",
          "nullable": false,
          "default": "0",
          "unique": false
        },
        {
          "name": "dimension",
          "type": "VARCHAR(100)",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "recorded_for_date",
          "type": "DATE",
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
            "metric_key",
            "recorded_for_date"
          ],
          "fulltext": false
        }
      ],
      "uniques": [],
      "description": "Analytics & Statistics",
      "module": "Analytics & Reports",
      "icon": "line-chart"
    },
    "innovation_statistics": {
      "name": "innovation_statistics",
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
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "category",
          "type": "VARCHAR(100)",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "total_projects",
          "type": "INT UNSIGNED",
          "nullable": false,
          "default": "0",
          "unique": false
        },
        {
          "name": "approved_projects",
          "type": "INT UNSIGNED",
          "nullable": false,
          "default": "0",
          "unique": false
        },
        {
          "name": "avg_readiness_score",
          "type": "DECIMAL(5,2)",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "period_start",
          "type": "DATE",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "period_end",
          "type": "DATE",
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
          "column": "university_id",
          "ref_table": "universities",
          "ref_column": "id",
          "on_delete": "SET NULL",
          "on_update": "RESTRICT"
        }
      ],
      "indexes": [],
      "uniques": [],
      "description": "Innovation Statistics records.",
      "module": "Analytics & Reports",
      "icon": "trending-up"
    },
    "trends": {
      "name": "trends",
      "columns": [
        {
          "name": "id",
          "type": "BIGINT UNSIGNED",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "topic",
          "type": "VARCHAR(150)",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "trend_score",
          "type": "DECIMAL(6,2)",
          "nullable": false,
          "default": "0",
          "unique": false
        },
        {
          "name": "project_count",
          "type": "INT UNSIGNED",
          "nullable": false,
          "default": "0",
          "unique": false
        },
        {
          "name": "period_month",
          "type": "DATE",
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
            "period_month"
          ],
          "fulltext": false
        }
      ],
      "uniques": [],
      "description": "Trends records.",
      "module": "Analytics & Reports",
      "icon": "trending-up"
    },
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
    "reports": {
      "name": "reports",
      "columns": [
        {
          "name": "id",
          "type": "BIGINT UNSIGNED",
          "nullable": false,
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
          "name": "report_type",
          "type": "VARCHAR(80)",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "format",
          "type": "ENUM('pdf','csv','xlsx','json')",
          "nullable": false,
          "default": "'pdf'",
          "unique": false
        },
        {
          "name": "file_path",
          "type": "VARCHAR(255)",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "parameters",
          "type": "JSON",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "status",
          "type": "ENUM('queued','generating','ready','failed')",
          "nullable": false,
          "default": "'queued'",
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
      "indexes": [],
      "uniques": [],
      "description": "Reports records.",
      "module": "Analytics & Reports",
      "icon": "file-text"
    },
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
    "github_repositories": {
      "name": "github_repositories",
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
          "name": "repo_url",
          "type": "VARCHAR(255)",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "default_branch",
          "type": "VARCHAR(100)",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "last_synced_at",
          "type": "DATETIME",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "sync_status",
          "type": "ENUM('not_connected','connected','error')",
          "nullable": false,
          "default": "'not_connected'",
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
      "description": "FUTURE FEATURES (schema ready, not yet wired to UI logic)",
      "module": "Projects & Portfolio",
      "icon": "github"
    },
    "patents": {
      "name": "patents",
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
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "submitted_by",
          "type": "BIGINT UNSIGNED",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "title",
          "type": "VARCHAR(255)",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "application_number",
          "type": "VARCHAR(100)",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "status",
          "type": "ENUM('draft','submitted','under_review','granted','rejected')",
          "nullable": false,
          "default": "'draft'",
          "unique": false
        },
        {
          "name": "filed_at",
          "type": "DATE",
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
          "column": "project_id",
          "ref_table": "projects",
          "ref_column": "id",
          "on_delete": "SET NULL",
          "on_update": "RESTRICT"
        },
        {
          "column": "submitted_by",
          "ref_table": "users",
          "ref_column": "id",
          "on_delete": "CASCADE",
          "on_update": "RESTRICT"
        }
      ],
      "indexes": [],
      "uniques": [],
      "description": "Patents records.",
      "module": "Projects & Portfolio",
      "icon": "scroll"
    },
    "internships": {
      "name": "internships",
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
          "name": "location",
          "type": "VARCHAR(150)",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "is_remote",
          "type": "TINYINT(1)",
          "nullable": false,
          "default": "0",
          "unique": false
        },
        {
          "name": "status",
          "type": "ENUM('draft','open','closed')",
          "nullable": false,
          "default": "'draft'",
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
          "column": "company_id",
          "ref_table": "companies",
          "ref_column": "id",
          "on_delete": "CASCADE",
          "on_update": "RESTRICT"
        }
      ],
      "indexes": [],
      "uniques": [],
      "description": "Internships records.",
      "module": "Projects & Portfolio",
      "icon": "briefcase"
    },
    "internship_applications": {
      "name": "internship_applications",
      "columns": [
        {
          "name": "id",
          "type": "BIGINT UNSIGNED",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "internship_id",
          "type": "BIGINT UNSIGNED",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "student_id",
          "type": "BIGINT UNSIGNED",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "status",
          "type": "ENUM('applied','shortlisted','rejected','accepted')",
          "nullable": false,
          "default": "'applied'",
          "unique": false
        },
        {
          "name": "applied_at",
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
          "column": "internship_id",
          "ref_table": "internships",
          "ref_column": "id",
          "on_delete": "CASCADE",
          "on_update": "RESTRICT"
        },
        {
          "column": "student_id",
          "ref_table": "students",
          "ref_column": "id",
          "on_delete": "CASCADE",
          "on_update": "RESTRICT"
        }
      ],
      "indexes": [],
      "uniques": [],
      "description": "Internship Applications records.",
      "module": "Projects & Portfolio",
      "icon": "file-text"
    },
    "hackathons": {
      "name": "hackathons",
      "columns": [
        {
          "name": "id",
          "type": "BIGINT UNSIGNED",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "organizer_id",
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
          "name": "starts_at",
          "type": "DATETIME",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "ends_at",
          "type": "DATETIME",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "status",
          "type": "ENUM('draft','upcoming','ongoing','completed','cancelled')",
          "nullable": false,
          "default": "'draft'",
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
          "column": "organizer_id",
          "ref_table": "users",
          "ref_column": "id",
          "on_delete": "CASCADE",
          "on_update": "RESTRICT"
        }
      ],
      "indexes": [],
      "uniques": [],
      "description": "Hackathons records.",
      "module": "Projects & Portfolio",
      "icon": "trophy"
    },
    "hackathon_participants": {
      "name": "hackathon_participants",
      "columns": [
        {
          "name": "hackathon_id",
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
          "name": "team_name",
          "type": "VARCHAR(150)",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "joined_at",
          "type": "DATETIME",
          "nullable": false,
          "default": "CURRENT_TIMESTAMP",
          "unique": false
        }
      ],
      "pk": [
        "hackathon_id",
        "user_id"
      ],
      "fks": [
        {
          "column": "hackathon_id",
          "ref_table": "hackathons",
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
      "description": "Hackathon Participants records.",
      "module": "Projects & Portfolio",
      "icon": "user-check"
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
        }
      ],
      "indexes": [],
      "uniques": [],
      "description": "Ai Code Review Results records.",
      "module": "AI Engine",
      "icon": "bug"
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
    "saved_projects": {
      "name": "saved_projects",
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
          "project_id"
        ]
      ],
      "description": "A company's \"save for later\" list on the Discovery page. Referenced by App\\Repositories\\SavedProjectRepository since Phase 12 but the migration itself was never actually created — this fills that gap.",
      "module": "Projects & Portfolio",
      "icon": "star"
    },
    "student_university_requests": {
      "name": "student_university_requests",
      "columns": [
        {
          "name": "id",
          "type": "BIGINT UNSIGNED",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "student_id",
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
          "column": "student_id",
          "ref_table": "students",
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
            "university_id",
            "status"
          ],
          "fulltext": false
        },
        {
          "cols": [
            "student_id"
          ],
          "fulltext": false
        }
      ],
      "uniques": [],
      "description": "Student University Requests records.",
      "module": "People & Profiles",
      "icon": "send"
    },
    "report_schedules": {
      "name": "report_schedules",
      "columns": [
        {
          "name": "id",
          "type": "BIGINT UNSIGNED",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "report_type",
          "type": "VARCHAR(80)",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "frequency",
          "type": "ENUM('daily','weekly','monthly')",
          "nullable": false,
          "default": "'weekly'",
          "unique": false
        },
        {
          "name": "recipient_email",
          "type": "VARCHAR(190)",
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
          "name": "last_run_at",
          "type": "DATETIME",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "last_report_id",
          "type": "BIGINT UNSIGNED",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "next_run_at",
          "type": "DATETIME",
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
        },
        {
          "column": "last_report_id",
          "ref_table": "reports",
          "ref_column": "id",
          "on_delete": "SET NULL",
          "on_update": "RESTRICT"
        }
      ],
      "indexes": [],
      "uniques": [],
      "description": "Report Schedules records.",
      "module": "Analytics & Reports",
      "icon": "calendar-clock"
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
    },
    "saved_dashboards": {
      "name": "saved_dashboards",
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
          "name": "name",
          "type": "VARCHAR(150)",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "layout",
          "type": "JSON",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "is_default",
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
          "column": "user_id",
          "ref_table": "users",
          "ref_column": "id",
          "on_delete": "CASCADE",
          "on_update": "RESTRICT"
        }
      ],
      "indexes": [],
      "uniques": [],
      "description": "Analyst-defined saved dashboards (widget layout/config per user)",
      "module": "Analytics & Reports",
      "icon": "layout-dashboard"
    },
    "report_templates": {
      "name": "report_templates",
      "columns": [
        {
          "name": "id",
          "type": "BIGINT UNSIGNED",
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
          "name": "name",
          "type": "VARCHAR(150)",
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
          "name": "data_source",
          "type": "ENUM('projects','users','ai_analysis','analytics_records', 'innovation_statistics','security_logs')",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "query_config",
          "type": "JSON",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "is_shared",
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
          "column": "created_by",
          "ref_table": "users",
          "ref_column": "id",
          "on_delete": "CASCADE",
          "on_update": "RESTRICT"
        }
      ],
      "indexes": [],
      "uniques": [],
      "description": "Reusable report templates (query/filter definitions an analyst can re-run)",
      "module": "Analytics & Reports",
      "icon": "file-cog"
    },
    "data_segments": {
      "name": "data_segments",
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
          "name": "name",
          "type": "VARCHAR(150)",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "entity",
          "type": "ENUM('users','projects')",
          "nullable": false,
          "default": "'projects'",
          "unique": false
        },
        {
          "name": "criteria",
          "type": "JSON",
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
          "column": "user_id",
          "ref_table": "users",
          "ref_column": "id",
          "on_delete": "CASCADE",
          "on_update": "RESTRICT"
        }
      ],
      "indexes": [],
      "uniques": [],
      "description": "Saved data segments (reusable filter sets, e.g. \"Active students in Cairo universities with AI-analyzed projects\")",
      "module": "Analytics & Reports",
      "icon": "filter"
    },
    "data_exports": {
      "name": "data_exports",
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
          "name": "export_type",
          "type": "VARCHAR(60)",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "format",
          "type": "ENUM('csv','xlsx','pdf')",
          "nullable": false,
          "default": null,
          "unique": false
        },
        {
          "name": "filters",
          "type": "JSON",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "file_path",
          "type": "VARCHAR(255)",
          "nullable": true,
          "default": null,
          "unique": false
        },
        {
          "name": "status",
          "type": "ENUM('pending','completed','failed')",
          "nullable": false,
          "default": "'pending'",
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
          "column": "user_id",
          "ref_table": "users",
          "ref_column": "id",
          "on_delete": "CASCADE",
          "on_update": "RESTRICT"
        }
      ],
      "indexes": [],
      "uniques": [],
      "description": "Export audit log (CSV/Excel/PDF exports triggered from the portal)",
      "module": "Analytics & Reports",
      "icon": "download"
    },
    "investor_watchlist": {
      "name": "investor_watchlist",
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
        }
      ],
      "uniques": [
        [
          "investor_id",
          "project_id"
        ]
      ],
      "description": "An investor's \"watchlist\" on the Startup Discovery page — the investor equivalent of `saved_projects` (034) for companies. Kept as its own table rather than reusing saved_projects because it FKs to investors, not companies, and because Investor \"Portfolio\" ...",
      "module": "Projects & Portfolio",
      "icon": "star"
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
          "type": "ENUM('invited','active','inactive')",
          "nullable": false,
          "default": "'invited'",
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
  },
  "order": [
    "users",
    "roles",
    "permissions",
    "role_permission",
    "user_roles",
    "students",
    "universities",
    "companies",
    "researchers",
    "investors",
    "projects",
    "project_files",
    "project_approvals",
    "ai_analysis",
    "ai_readiness_scores",
    "ai_classifications",
    "startup_potential",
    "improvement_suggestions",
    "portfolios",
    "portfolio_projects",
    "notifications",
    "conversations",
    "conversation_participants",
    "messages",
    "analytics_records",
    "innovation_statistics",
    "trends",
    "security_logs",
    "audit_logs",
    "reports",
    "settings",
    "university_verification_requests",
    "github_repositories",
    "patents",
    "internships",
    "internship_applications",
    "hackathons",
    "hackathon_participants",
    "ai_code_review_results",
    "password_reset_tokens",
    "email_verification_tokens",
    "saved_projects",
    "student_university_requests",
    "report_schedules",
    "api_tokens",
    "blocked_ips",
    "security_incidents",
    "security_incident_events",
    "user_sessions",
    "vulnerabilities",
    "security_policies",
    "risk_scores",
    "security_notifications",
    "saved_dashboards",
    "report_templates",
    "data_segments",
    "data_exports",
    "investor_watchlist",
    "user_permission_overrides",
    "supervisors",
    "demo_seed_batches",
    "demo_seed_log"
  ],
  "modules": [
    "Authentication & Access",
    "People & Profiles",
    "Projects & Portfolio",
    "AI Engine",
    "Messaging & Notifications",
    "Analytics & Reports",
    "Security & Audit",
    "Settings & System"
  ],
  "moduleIcons": {
    "Authentication & Access": "shield",
    "People & Profiles": "user",
    "Projects & Portfolio": "briefcase",
    "AI Engine": "brain-circuit",
    "Messaging & Notifications": "message-circle",
    "Analytics & Reports": "bar-chart-2",
    "Security & Audit": "shield-alert",
    "Settings & System": "settings"
  },
  "moduleColors": {
    "Authentication & Access": {
      "h": 221
    },
    "People & Profiles": {
      "h": 189
    },
    "Projects & Portfolio": {
      "h": 142
    },
    "AI Engine": {
      "h": 27
    },
    "Messaging & Notifications": {
      "h": 328
    },
    "Analytics & Reports": {
      "h": 0
    },
    "Security & Audit": {
      "h": 258
    },
    "Settings & System": {
      "h": 45
    }
  }
};
