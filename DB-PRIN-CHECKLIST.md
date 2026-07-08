# Database Design Principles Checklist

- [ ] **DB-PRIN-001:** All tables must have a primary key (`id` BIGSERIAL or UUID).
- [ ] **DB-PRIN-002:** Standard audit columns required on all entities (`created_at`, `updated_at`, `created_by`, `updated_by`).
- [ ] **DB-PRIN-003:** Soft deletes enforced using `is_deleted` boolean flag (No hard deletes).
- [ ] **DB-PRIN-004:** Foreign keys must be explicitly defined and indexed.
- [ ] **DB-PRIN-005:** Naming convention: `snake_case` for tables and columns.
- [ ] **DB-PRIN-006:** Use appropriate data types (e.g., `VARCHAR` for strings, `NUMERIC` for currency, `TIMESTAMP WITH TIME ZONE` for dates).
- [ ] **DB-PRIN-007:** No business logic in the database (No triggers, stored procedures, or functions unless explicitly approved by Tech Lead).