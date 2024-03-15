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