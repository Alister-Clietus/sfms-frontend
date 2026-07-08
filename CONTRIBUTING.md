# Contribution Guidelines

## Branch Naming Convention (GIT-BRANCH-002)
Branches must be prefixed with the ticket type and ID:
* `feature/SFMS-XXX-short-description`
* `bugfix/SFMS-XXX-short-description`
* `hotfix/SFMS-XXX-short-description`
* `chore/SFMS-XXX-short-description`

## Commit Messages (GIT-COMMIT-001)
We enforce Conventional Commits. Commits must follow this structure:
`<type>(<scope>): <description>`

**Allowed Types:**
* `feat`: A new feature
* `fix`: A bug fix
* `docs`: Documentation only changes
* `style`: Changes that do not affect the meaning of the code (white-space, formatting)
* `refactor`: A code change that neither fixes a bug nor adds a feature
* `test`: Adding missing tests or correcting existing tests
* `chore`: Changes to the build process or auxiliary tools

## Pull Request Policy (GIT-GOV-001)
* PRs target the `main` or `staging` branch.
* Branch protection requires:
  * Minimum 1 approving review.
  * Passing CI checks.
  * Linear history (Squash and Merge required).