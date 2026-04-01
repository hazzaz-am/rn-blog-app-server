import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { user } from "./auth.schema";

export const post = pgTable(
	"post",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
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

export const postComments = pgTable("post_comments", {
	id: uuid("id").primaryKey().defaultRandom(),
	postId: uuid("post_id")
		.references(() => post.id, { onDelete: "cascade" })
		.notNull(),
	userId: uuid("user_id")
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),
	comment: text("comment").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

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
	comments: many(postComments),
}));

export const postContentRelations = relations(postContents, ({ one }) => ({
	post: one(post, {
		fields: [postContents.postId],
		references: [post.id],
	}),
}));

export type Post = InferSelectModel<typeof post>;
export type PostResponse = z.infer<typeof postSchema>;
export type NewPost = InferInsertModel<typeof post>;
export type PostContent = InferSelectModel<typeof postContents>;
export type NewPostContent = InferInsertModel<typeof postContents>;
export type PostComment = InferSelectModel<typeof postComments>;
export type NewPostComment = InferInsertModel<typeof postComments>;

export const createPostSchema = createInsertSchema(post, {
	userId: z.uuid(),
	caption: z.string().optional(),
	location: z.string(),
});
export const updatePostSchema = createInsertSchema(post).partial();
export const postSchema = createSelectSchema(post);
export const postContentSchema = createInsertSchema(postContents);
export const updatePostContentSchema = createInsertSchema(postContents).partial();
export const postContentResponseSchema = createSelectSchema(postContents);
export const postCommentSchema = createInsertSchema(postComments);
export const postCommentResponseSchema = createSelectSchema(postComments);
export const updatePostCommentSchema = z.object({
	comment: z.string().min(1),
});
