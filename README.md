# Adhyai

Adhyai is an AI-powered study companion designed to help students study efficiently and excel in their exams. It offers personalized study plans, instant answers to questions, and real-time feedback through practice tests. With Adhyai, students can monitor their progress, stay organized, and improve their learning experience with a virtual tutor available 24/7. It is suitable for high school and college students or anyone preparing for exams, making studying less stressful and more productive.

### Adhyai Features

1. **Adhyai Chat**: Students can upload their study materials directly into the chat and ask questions. Adhyai analyzes the documents and provides relevant answers based on the content.
2. **Adhyai Quiz**: Adhyai generates quizzes based on studied topics, helping students reinforce learning. It evaluates their performance and offers feedback to ensure mastery of the material.

### Tech Stack Overview

- **AI Models**:

  - **Document Retrieval**: Adhyai uses Google Generative AI’s embedding-001 model for accurate information retrieval from uploaded materials.
  - **Chat, Quiz Generation, and Evaluation**: For these tasks, Adhyai utilizes the open-mistral-nemo model from Mistral, which excels at understanding questions and generating helpful responses.

  The system is adaptable and flexible, allowing easy swapping of AI models without affecting functionality.

- **Frontend**:

  - Developed using **React** with **Vite** for efficient UI building.
  - **shadcn/UI** is used for design, maintaining a clean and consistent look.
  - Tools such as **@tanstack/router** for navigation, **@tanstack/query** for server-side data management, and **Vercel AI SDK** for AI features are integrated into the platform.
  - **Clerk** handles user authentication, ensuring secure logins.

- **Backend**:
  - **Fastify** is used for API management, enhancing performance.
  - **Bun** is the JavaScript runtime for running code efficiently.
  - **SQLite** and **Drizzle ORM** manage the database, keeping data like user progress and quiz results organized.
  - **Langchain** retrieves information from uploaded documents, while **ChromaDB** stores embeddings for quick data retrieval.
  - Hosting is managed through **DigitalOcean** for the backend and **Turso** for the database.

### Installation

- **Software Requirements**: Git, Bun, Python, ChromaDB.
- **Frontend Setup**:

  - Clone the repository: `git clone https://github.com/theSa1/adhyai-frontend.git`.
  - Install dependencies using `bun install` or `npm install`.
  - Set up environment variables and start the frontend server with `bun run start` or `npm run start`.

- **ChromaDB Setup**:

  - Install and run ChromaDB locally using Python: `pip install chromed` and `chroma chroma run --path ./vec-db`.

- **Backend Setup**:
  - Clone the backend repository: `git clone https://github.com/theSa1/adhyai-backend.git`.
  - Install dependencies with `bun install`.
  - Set up environment variables and run the backend server using `bun run start`.
