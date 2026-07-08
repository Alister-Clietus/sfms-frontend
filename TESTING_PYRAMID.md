# Testing Pyramid (Section 35.2)

## 1. Unit Tests (Base - 70% of Suite)
* **Backend:** JUnit 5 + Mockito. Test services, utilities, and isolated business logic.
* **Frontend:** Jasmine + Karma. Test components, pipes, and isolated services.
* **Goal:** Fast, isolated, reliable.

## 2. Integration Tests (Middle - 20% of Suite)
* **Backend:** `@SpringBootTest` + Testcontainers (PostgreSQL). Test Repository/Database interactions and Controller endpoints.
* **Frontend:** DOM testing, router testing.
* **Goal:** Ensure modules communicate correctly.

## 3. End-to-End (E2E) Tests (Top - 10% of Suite)
* **Tools:** Cypress or Playwright (TBD).
* **Goal:** User journey validation across both UI and API layers in a production-like environment.