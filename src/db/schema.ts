import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const usersTable = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
});

export const teachersTable = sqliteTable("teachers", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
});

export const coursesTable = sqliteTable("courses", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),

  rootDocumentId: integer("root_document_id").notNull(),

  createdBy: integer("created_by").notNull(),
});

export const courseUnitsTable = sqliteTable("course_units", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),

  rootDocumentId: integer("root_document_id").notNull(),

  courseId: integer("course_id").notNull(),
});

export const documentsTable = sqliteTable("documents", {
  id: integer("id").primaryKey(),
  unitId: integer("unit_id"),
  title: text("title").notNull(),
  content: text("content").notNull(),
});

export const documentRelation = relations(documentsTable, ({ one }) => ({
  unit: one(courseUnitsTable, {
    fields: [documentsTable.unitId],
    references: [courseUnitsTable.id],
  }),
}));

export const courseUnitRelation = relations(courseUnitsTable, ({ many }) => ({
  documents: many(documentsTable),
}));

export const chatTable = sqliteTable("chats", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
});

export const chatMessagesTable = sqliteTable("chat_messages", {
  id: integer("id").primaryKey(),
  chatId: text("chat_id").notNull(),
  role: text("role").notNull().$type<"user" | "assistant" | "system">(),
  content: text("content").notNull(),
});
