import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

export const post = pgTable(
	"post",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: text("user_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		caption: text("caption"),
		likesCount: integer("likesCount").default(0),
		commentsCount: integer("comments_count").default(0),
		sharesCount: integer("shares_count").default(0),
		location: text("location"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [index("post_user_id_idx").on(table.userId)],
);

export const postContents = pgTable(
	"post_contents",
	{
		id: uuid("id").primaryKey().defaultRandom(),

		postId: uuid("post_id")
			.references(() => post.id, { onDelete: "cascade" })
			.notNull(),

		type: text("type", { enum: ["image", "video"] }).notNull(),

		url: text("url").notNull(),

		order: integer("order").notNull(),
	},
	(table) => [index("post_contents_post_id_idx").on(table.postId)],
);

export const postRelations = relations(post, ({ many }) => ({
	contents: many(postContents),
}));

export const postContentRelations = relations(postContents, ({ one }) => ({
	post: one(post, {
		fields: [postContents.postId],
		references: [post.id],
	}),
}));
