import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const coursesTable = sqliteTable("courses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

export const coursesRelations = relations(coursesTable, ({ many, one }) => ({
  documents: many(documentsTable),
}));

export const documentsTable = sqliteTable("documents", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),

  courseId: text("course_id").notNull(),
});

export const documentsRelations = relations(
  documentsTable,
  ({ one, many }) => ({
    course: one(coursesTable, {
      fields: [documentsTable.courseId],
      references: [coursesTable.id],
    }),
  })
);

export const quizzesTable = sqliteTable("quizzes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  courseId: text("course_id").notNull(),
  isCompleted: integer("is_completed").default(0),
});

export const quizzesRelations = relations(quizzesTable, ({ one, many }) => ({
  course: one(coursesTable, {
    fields: [quizzesTable.courseId],
    references: [coursesTable.id],
  }),
  questions: many(quizQuestionsTable),
}));

export const quizQuestionsTable = sqliteTable("quizzes_questions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  index: integer("index").notNull(),
  quizId: text("quiz_id").notNull(),
  questionType: text("question_type").$type<
    "multiple_choice" | "true_false" | "short_answer" | "long_answer"
  >(),
  question: text("question").notNull(),
  options: text("options"),
  correctAnswer: text("answer").notNull(),
  marks: integer("marks"),
  feedback: text("feedback"),
  givenAnswer: text("given_answer"),
  instructionsForChecking: text("instructions_for_checking"),
});

export const quizQuestionsRelations = relations(
  quizQuestionsTable,
  ({ one, many }) => ({
    quiz: one(quizzesTable, {
      fields: [quizQuestionsTable.quizId],
      references: [quizzesTable.id],
    }),
  })
);
