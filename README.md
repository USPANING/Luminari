# Luminari

Luminari is a multilingual learning platform that helps migrant students in Polish schools learn subject terminology. A student registers with a nickname and their native language, takes a short diagnostic test in a school subject, and gets AI explanations of their mistakes in their own language, with every subject term also given in Polish.

> **Status:** MVP in progress. The backend was migrated from Python (FastAPI) to Java (Spring Boot), and the frontend works only with the Java backend.

## MVP features

1. **Registration** with a nickname and native language (no real names).
2. **Diagnostic test** for a school subject: topics → subtopics → questions. Subjects now: mathematics, biology, Polish.
3. **AI explanations** of the student's mistakes in their native language, based on textbook materials (simple RAG).
4. **Terminology dictionary** Polish ↔ native language, with the option to mark difficult terms *(planned)*.

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 4, Spring Web MVC, Spring Data JPA (Hibernate), Bean Validation |
| Database | PostgreSQL (Supabase) |
| AI | OpenAI API (`gpt-4.1-mini`, JSON mode) |
| Documents | Apache PDFBox (text extraction from textbook PDFs) |
| Tests | JUnit 5, Mockito |
| Frontend | React 19, Vite, TypeScript (migration in progress) |

## Architecture

```
React (Vite) ──HTTP/JSON──► Spring Boot ──JPA──► PostgreSQL (Supabase)
                                 │
                                 └──► OpenAI API (/ai/explain)
```

The backend is organized **package by feature**, and each feature follows the same layers:

- **controller** handles HTTP requests, validates input and returns DTOs;
- **service** contains business logic (checking answers, building prompts, importing materials);
- **repository** (Spring Data JPA) reads and writes the database; queries are generated from method names;
- **entity** classes map to the existing Polish table and column names via `@Table` and `@Column`, while the Java code and API use English names.

DTOs never expose the correct answers to the client. Answers are checked on the server. Invalid input returns `400` and unknown ids return `404` (global `@RestControllerAdvice`).

## How AI explanations work

1. **Materials import (once).** A textbook PDF is read with PDFBox, cleaned (formula fragments, source lines and invalid characters removed), split into ~150-word chunks and saved to the `materialy` table, linked to a subtopic.
2. **Retrieval.** For each mistake, the backend loads the chunks of that question's subtopic (simple RAG by metadata, not by semantic similarity yet).
3. **Generation.** The prompt contains the mistakes, the textbook chunks and strict rules: explanation fully in the student's native language, each subject term followed by its Polish name in brackets. The model answers in JSON, which is parsed into objects and shown as cards in the frontend.
4. **Review.** A second model call reviews the draft (language, no word-for-word calques from Polish, consistency with the correct answer) and fixes only what is needed.

Both RAG and the review step can be switched off in `application.properties`:

```properties
luminari.rag.enabled=true
luminari.review.enabled=true
```

The review step roughly doubles response time (about 3 s → 6 s for two mistakes), so it is a deliberate trade-off between quality and latency.

## API

| Method | Endpoint | Description | Status |
|---|---|---|---|
| `POST` | `/students` | Registers a student (nickname, native language as ISO 639-1 code), returns `201` with the new id | Done |
| `GET` | `/subjects` | List of school subjects | Done |
| `GET` | `/learning-path/{subjectId}` | Topics → subtopics → questions for a subject, as nested JSON | Done |
| `POST` | `/test/result` | Checks the student's answers, saves them, returns the score and wrong answers | Done |
| `POST` | `/ai/explain` | AI explanations of the student's mistakes as structured cards | Done |
| `POST` | `/materials/import` | Imports a textbook PDF into chunks for a subtopic (admin tool, local use) | Done |
| `GET` | dictionary by subtopic | Polish ↔ native language terms | Planned |
| `POST` | mark a term | Saves a term as difficult for the student | Planned |

### Example: `POST /students`

```json
{ "nickname": "Ola", "nativeLanguage": "uk" }
```

Response `201 Created`:

```json
{ "id": 5, "nickname": "Ola", "schoolClass": null, "nativeLanguage": "uk" }
```

### Example: `POST /test/result`

Request:

```json
{
  "studentId": 5,
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

### Example: `POST /ai/explain`

Request:

```json
{
  "studentId": 5,
  "mistakes": [ { "questionId": 2, "answer": "A" } ]
}
```

Response:

```json
{
  "items": [
    {
      "question": "Funkcja y = -2x + 1 jest...",
      "studentAnswer": "A. rosnąca",
      "correctAnswer": "B. malejąca",
      "explanation": "Коефіцієнт нахилу (współczynnik kierunkowy) a = -2, тобто менший за нуль, тому функція спадна (malejąca)."
    }
  ]
}
```

Ready-made requests are in [`backend-java/test-result.http`](backend-java/test-result.http) and [`backend-java/explain.http`](backend-java/explain.http) (IntelliJ HTTP Client).

## Project structure

```
Luminari/
├── backend-java/                     Spring Boot backend
│   ├── src/main/java/pl/luminari/backendjava/
│   │   ├── students/                 POST /students: entity, DTOs, service, controller
│   │   ├── subjects/                 GET /subjects
│   │   ├── topics/                   Topic entity and repository
│   │   ├── subtopics/                Subtopic entity and repository
│   │   ├── questions/                Question entity and repository
│   │   ├── learningpath/             GET /learning-path, nested DTOs
│   │   ├── results/                  AnswerRecord entity and repository
│   │   ├── testresult/               POST /test/result: DTOs, service, controller
│   │   ├── materials/                PDF import: cleaning, chunking, Material entity
│   │   ├── explain/                  POST /ai/explain: OpenAI client, prompts, DTOs
│   │   └── error/                    Global error handling (400 / 404)
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── materials/                Textbook PDFs used for RAG
│   ├── src/test/java/…               Unit tests (JUnit 5 + Mockito)
│   ├── test-result.http              Sample HTTP request
│   └── explain.http                  Sample HTTP request
├── src/                              React frontend
├── supabase/                         Supabase config and migrations
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

The API runs on `http://localhost:8080`. Quick check: open `http://localhost:8080/subjects` in a browser.

> If startup fails with `'url' must start with "jdbc"`, the environment variables are not set.

### Run the frontend

```bash
npm install
npm run dev
```

The dev server proxies API calls to the Java backend on port 8080 (see `vite.config.js`). Start the backend first.

## Roadmap

- [x] Migrate all endpoints from Python to Java and remove the Python backend
- [x] Check answers on the server instead of the browser
- [x] Validation and global error handling (400 / 404)
- [x] Simple RAG from textbook PDFs
- [x] Structured JSON output and explanation cards in the frontend
- [x] Second AI step that reviews explanations
- [x] Registration with native language (ISO 639-1 codes)
- [x] New subjects: biology and Polish
- [ ] Dictionary endpoints (terms by subtopic, marking difficult terms)
- [ ] Real login (email or Google / Apple ID)
- [ ] All interface texts in translations (i18n) and more interface languages
- [ ] Semantic search for RAG (embeddings + pgvector)
- [ ] Finish the TypeScript migration of the frontend

## Privacy

Students are stored under nicknames only, without real names or surnames (GDPR / RODO, data minimisation). The native language is stored as an ISO 639-1 code. API keys and database credentials live only in environment variables and are never committed or sent to the frontend.

## Learning materials

Textbook PDFs in `backend-java/src/main/resources/materials/` come from the Polish government platform [ZPE (Zintegrowana Platforma Edukacyjna)](https://zpe.gov.pl) and are used under the Creative Commons licenses stated in each file:

- *Współczynnik kierunkowy funkcji liniowej*: Zespół autorski Politechniki Łódzkiej, CC BY 3.0
- *Fotosynteza – czyli czym jest samożywność?*: Learnetic SA, CC BY 4.0
- *Środki poetyckiego obrazowania – epitet, porównanie, ożywienie i uosobienie*: Contentplus.pl sp. z o.o., CC BY 3.0

## Author

**Vadym Tokarskyi**: team lead, product owner, full-stack developer.