# Luminari

Luminari is a multilingual learning platform that helps migrant students in Polish schools learn subject terminology. A student takes a short diagnostic test in one school subject, gets AI explanations of their mistakes in their native language, and builds a personal dictionary of difficult Polish terms.

> **Status:** MVP in progress. The backend is being migrated from Python (FastAPI) to Java (Spring Boot).

## MVP features

1. **Diagnostic test** for one school subject: topics → subtopics → questions.
2. **AI explanations** of the student's mistakes (OpenAI, generated on the backend only).
3. **Terminology dictionary** Polish ↔ native language, with the option to mark difficult terms.

## Tech stack

| Layer | Technology |
|---|---|
| Backend (current) | Java 21, Spring Boot 4, Spring Web MVC, Spring Data JPA (Hibernate) |
| Backend (legacy) | Python, FastAPI |
| Database | PostgreSQL (Supabase) |
| Frontend | React 19, Vite |
| AI | OpenAI API (`gpt-4o-mini`) |

## Architecture

```
React (Vite) ──HTTP/JSON──► Spring Boot ──JPA──► PostgreSQL (Supabase)
                                 │
                                 └──► OpenAI API (planned: /ai/explain)
```

The Java backend follows a layered structure:

- **controller** handles HTTP requests and returns DTOs;
- **service** contains business logic (for example, checking test answers);
- **repository** (Spring Data JPA) reads and writes the database;
- **entity** classes map to the existing Polish table and column names via `@Table` and `@Column`, while the Java code and API use English names.

DTOs never expose the correct answers to the client.

## API

| Method | Endpoint | Description | Status |
|---|---|---|---|
| `GET` | `/przedmioty` | List of school subjects (to be renamed to `/subjects`) | Done |
| `GET` | `/learning-path/{subjectId}` | Topics → subtopics → questions for a subject, as nested JSON | Done |
| `POST` | `/test/result` | Checks the student's answers, saves them, returns the score | Done |
| `POST` | `/ai/explain` | AI explanation of the student's mistakes |  Currently working on it |
| `GET` | dictionary by subtopic | Polish ↔ native language terms |  Planned |
| `POST` | mark a term | Saves a term as difficult for the student |  Planned |

### Example: `POST /test/result`

Request:

```json
{
  "studentId": 1,
  "answers": [
    { "questionId": 1, "answer": "A" },
    { "questionId": 2, "answer": "B" }
  ]
}
```

Response:

```json
{ "correct": 1, "total": 2, "percent": 50.0 }
```

Each answer is stored in the `wyniki_odpowiedzi` table. A ready-made request is in [`backend-java/test-result.http`](backend-java/test-result.http) (IntelliJ HTTP Client).

## Project structure

```
Luminari/
├── backend-java/                 Spring Boot backend (current)
│   ├── src/main/java/pl/luminari/backendjava/
│   │   ├── subjects/             Subject entity, repository, controller
│   │   ├── topics/               Topic entity and repository
│   │   ├── subtopics/            Subtopic entity and repository
│   │   ├── questions/            Question entity and repository
│   │   ├── learningpath/         GET /learning-path, nested DTOs
│   │   ├── results/              AnswerRecord entity and repository
│   │   └── testresult/           POST /test/result: DTOs, service, controller
│   ├── src/main/resources/application.properties
│   └── test-result.http          sample HTTP request
├── backend/                      legacy FastAPI backend (being migrated)
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

### Run the Java backend

The database connection is read from environment variables:

| Variable | Value |
|---|---|
| `DB_URL` | JDBC URL from Supabase → Connect → JDBC (Session pooler) |
| `DB_USER` | database user |
| `DB_PASSWORD` | database password |

In IntelliJ IDEA: **Run → Edit Configurations → Modify options → Environment variables**.

From PowerShell:

```powershell
cd backend-java
$env:DB_URL="jdbc:postgresql://..."
$env:DB_USER="..."
$env:DB_PASSWORD="..."
.\mvnw.cmd spring-boot:run
```

The API runs on `http://localhost:8080`. Quick check: open `http://localhost:8080/learning-path/1` in a browser.

> If startup fails with `'url' must start with "jdbc"`, the environment variables are not set.

### Run the frontend

```bash
npm install
npm run dev
```

The dev server proxies API calls to the backend (see `vite.config.js`). The proxy still points to the legacy Python backend on port 8000; switching it to the Java backend is on the roadmap.

### Run the legacy Python backend

```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

It needs a `backend/.env` file (not committed) with `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`.

## Roadmap

- [x] `GET /learning-path/{subjectId}` in Java
- [x] `POST /test/result` in Java
- [ ] `POST /ai/explain` in Java (OpenAI key on the backend only)
- [ ] Rename `/przedmioty` to `/subjects`
- [ ] Dictionary endpoints (terms by subtopic, marking difficult terms)
- [ ] Switch the frontend to the Java backend and English field names
- [ ] Remove the legacy Python backend

## Privacy

Students are stored under nicknames only, without surnames (GDPR / RODO). API keys and database credentials are never committed or sent to the frontend.

## Author

**Vadym Tokarskyi**: team lead, product owner, full-stack developer.