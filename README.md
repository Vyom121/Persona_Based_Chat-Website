# Personna-Based Chat App

A **Persona-based Chat Application** with React frontend and Python FastAPI backend, fully containerized using Docker.  

---

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed  
- [Docker Compose](https://docs.docker.com/compose/install/) installed  

---

## Setup

1. **Clone the repository**:

```bash
git clone https://github.com/Vyom121/Persona_Based_Chat-Website.git
cd personna-based-app
```


2. **Adding Environment File**:

```bash
cd backend
touch .env
```

3. **Add Following Content in .env**:

```
# Port on which the backend server will run
PORT=5000

# OpenAI API Key for chat responses
OPENAI_API_KEY=your_openai_api_key_here
```
4. **Run Following Docker Command**:

```bash
cd ..
```
5. **Run Following Docker Command**:

```bash
docker compose up --build
```
6. **Run on Chrome Browser**:

```
https://localhost:8080
```

