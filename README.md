# Luminari

Luminari is a multilingual learning platform that helps migrant students in Polish schools learn subject terminology. A student takes a short diagnostic test in one school subject, gets AI explanations of their mistakes in their native language, and builds a personal dictionary of difficult Polish terms.

> **Status:** MVP in progress. The backend was migrated from Python (FastAPI) to Java (Spring Boot), and the frontend now works only with the Java backend.

## MVP features

1. **Diagnostic test** for one school subject: topics → subtopics → questions.
2. **AI explanations** of the student's mistakes (OpenAI, generated on the backend only).
3. **Terminology dictionary** Polish ↔ native language, with the option to mark difficult terms.

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 4, Spring Web MVC, Spring Data JPA (Hibernate) |
| Database | PostgreSQL (Supabase) |
| Frontend | React 19, Vite, TypeScript (migration in progress) |
| AI | OpenAI API (`gpt-4.1-mini`) |

## Architecture

```
React (Vite) ──HTTP/JSON──► Spring Boot ──JPA──► PostgreSQL (Supabase)
                                 │
                                 └──► OpenAI API (/ai/explain)
```

The Java backend follows a layered structure:

- **controller** handles HTTP requests and returns DTOs;
- **service** contains business logic (for example, checking test answers);
- **repository** (Spring Data JPA) reads and writes the database;
- **entity** classes map to the existing Polish table and column names via `@Table` and `@Column`, while the Java code and API use English names.

DTOs never expose the correct answers to the client. Answers are checked on the server, which also returns the list of wrong answers used for AI explanations.

## API

| Method | Endpoint | Description | Status |
|---|---|---|---|
| `GET` | `/subjects` | List of school subjects | Done |
| `GET` | `/learning-path/{subjectId}` | Topics → subtopics → questions for a subject, as nested JSON | Done |
| `POST` | `/test/result` | Checks the student's answers, saves them, returns the score and wrong answers | Done |
| `POST` | `/ai/explain` | AI explanation of the student's mistakes | Done |
| `GET` | dictionary by subtopic | Polish ↔ native language terms | In progress |
| `POST` | mark a term | Saves a term as difficult for the student | Planned |

### Example: `POST /test/result`

Request:

```json
{
  "studentId": 1,
  "answers": [
    { "questionId": 1, "answer": "B" },
    { "questionId": 2, "answer": "A" }
  ]
}
```

Response:

```json
{
  "correct": 1,
  "total": 2,
  "percent": 50.0,
  "wrongAnswers": [
    { "questionId": 2, "answer": "A" }
  ]
}
```

Each answer is stored in the `wyniki_odpowiedzi` table. Ready-made requests are in [`backend-java/test-result.http`](backend-java/test-result.http) and [`backend-java/explain.http`](backend-java/explain.http) (IntelliJ HTTP Client).

## Project structure

```
Luminari/
├── backend-java/                 Spring Boot backend
│   ├── src/main/java/pl/luminari/backendjava/
│   │   ├── subjects/             Subject entity, repository, controller
│   │   ├── topics/               Topic entity and repository
│   │   ├── subtopics/            Subtopic entity and repository
│   │   ├── questions/            Question entity and repository
│   │   ├── students/             Student entity and repository
│   │   ├── learningpath/         GET /learning-path, nested DTOs
│   │   ├── results/              AnswerRecord entity and repository
│   │   ├── testresult/           POST /test/result: DTOs, service, controller
│   │   └── explain/              POST /ai/explain: OpenAI client, prompt, DTOs
│   ├── src/main/resources/application.properties
│   ├── test-result.http          sample HTTP request
│   └── explain.http              sample HTTP request
├── src/                          React frontend
├── supabase/                     Supabase config and migrations
├── package.json
└── vite.config.js
```

## Getting started

### Requirements

- JDK 21 or newer
- Node.js 18+ (for the frontend)
- Access to the Supabase PostgreSQL database
- An OpenAI API key (for AI explanations)

### Run the Java backend

Configuration is read from environment variables:

| Variable | Value |
|---|---|
| `DB_URL` | JDBC URL from Supabase → Connect → JDBC (Session pooler) |
| `DB_USER` | database user |
| `DB_PASSWORD` | database password |
| `OPENAI_API_KEY` | OpenAI API key |

In IntelliJ IDEA: **Run → Edit Configurations → Modify options → Environment variables**.

From PowerShell:

```powershell
cd backend-java
$env:DB_URL="jdbc:postgresql://..."
$env:DB_USER="..."
$env:DB_PASSWORD="..."
$env:OPENAI_API_KEY="..."
.\mvnw.cmd spring-boot:run
```

The API runs on `http://localhost:8080`. Quick check: open `http://localhost:8080/learning-path/1` in a browser.

> If startup fails with `'url' must start with "jdbc"`, the environment variables are not set.

### Run the frontend

```bash
npm install
npm run dev
```

The dev server proxies API calls to the Java backend on port 8080 (see `vite.config.js`). Start the backend first.

## Roadmap

- [x] `GET /learning-path/{subjectId}` in Java
- [x] `POST /test/result` in Java
- [x] `POST /ai/explain` in Java (OpenAI key on the backend only)
- [x] Rename `/przedmioty` to `/subjects`
- [x] Switch the frontend to the Java backend and English field names
- [x] Check wrong answers on the server instead of the browser
- [x] Remove the legacy Python backend
- [ ] Dictionary endpoints (terms by subtopic, marking difficult terms)
- [ ] Finish the TypeScript migration of the frontend

## Privacy

Students are stored under nicknames only, without surnames (GDPR / RODO). API keys and database credentials are never committed or sent to the frontend.

## Author

**Vadym Tokarskyi**: team lead, product owner, full-stack developer.