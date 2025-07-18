# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the Smartling Translation API SDK for Node.js, providing TypeScript interfaces for interacting with Smartling's translation services. The SDK covers all major API endpoints including files, jobs, locales, projects, and translation management.

## Commands

### Build Commands
- `npm run build` - Production build (TypeScript compilation to `built/` directory)
- `npm run build:dev` - Development build (includes test files)

### Testing
- `npm test` - Run full test suite with lint, build, and coverage
- `npm run test:dev` - Run tests without JUnit reporting (for development)

### Linting
- `npm run pretest` - Run ESLint on all TypeScript files
- ESLint configuration in `.eslintrc` with TypeScript, Airbnb, and custom rules

### Single Test Execution
Run individual test files using Mocha directly:
```bash
npm run build:dev && npx mocha built/test/[specific-test].spec.js
```

## Architecture

### Core Structure
- **API Layer**: Organized by feature domains (`/api/`)
  - `auth/` - Authentication and token management
  - `files/` - File upload/download operations
  - `jobs/` - Translation job management
  - `locales/` - Language and locale handling
  - `projects/` - Project management
  - `strings/` - String resource management
  - `context/` - Context matching for translations
  - `job-batches/` - Batch job processing
  - `published-files/` - Published file management
  - `file-translations/` - File translation services
  - `mt/` - Machine translation services

### Pattern Structure
Each API domain follows a consistent pattern:
- `index.ts` - Main API client class
- `dto/` - Data transfer objects (response/request types)
- `params/` - Parameter classes for API calls

### Key Components
- **SmartlingApiClientBuilder**: Main entry point for creating API clients
- **AccessTokenProvider**: Interface for authentication (with StaticAccessTokenProvider implementation)
- **SmartlingListResponse**: Generic wrapper for paginated API responses
- **Logger**: Centralized logging utility

### TypeScript Configuration
- Uses `tsconfig.json` for production builds
- Uses `tsconfig.dev.json` for development (includes test files)
- Targets ES6 with CommonJS modules
- Generates declaration files and source maps

### Testing Framework
- Mocha test runner with TypeScript support
- Sinon for mocking and stubbing
- NYC for code coverage reporting
- Tests located in `/test/` directory matching API structure
