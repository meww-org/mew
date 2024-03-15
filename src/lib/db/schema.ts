import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: varchar("name"),
});


export const repos = pgTable('repos',{
    id: serial('id').primaryKey(),
    url: text('url').unique().notNull(),
    folderStructure: text('folderStructure').notNull()
    
})

export const files = pgTable('files',{
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  path: text('path').unique().notNull(),
  content: text('content').notNull(),
  abspath: text('abspath').notNull(),
  repoId: serial('repo_id').notNull().references(() => repos.id)
})