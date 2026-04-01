import { db } from "@/db";
import { post, postComments, postContents } from "@/db/schemas/post.schema";
import { AppRouteHandler } from "@/types";
import { and, desc, eq, sql } from "drizzle-orm";
import {
	AddCommentRoute,
	AddContentRoute,
	CreatePostRoute,
	DeleteCommentRoute,
	DeleteContentRoute,
	DeletePostRoute,
	DislikePostRoute,
	GetPostByIdRoute,
	LikePostRoute,
	ListPostRoute,
	UpdateCommentRoute,
	UpdatePostRoute,
	UserPostsRoute,
} from "./posts.router";

const serializePost = (post: any) => ({
	...post,
	createdAt: post.createdAt.toISOString(),
	updatedAt: post.updatedAt.toISOString(),
	contents: post.contents?.map((c: any) => ({
		...c,
	})),
});

export const createPost: AppRouteHandler<CreatePostRoute> = async (c) => {
	const body = c.req.valid("json");

	const inserted = await db
		.insert(post)
		.values(body)
		.returning()
		.then((res) => res[0]);

	if (!inserted.id) {
		return c.json({ message: "Failed to create post" }, 400);
	}

	return c.json(
		{
			...inserted,
			createdAt: inserted.createdAt.toISOString(),
			updatedAt: inserted.updatedAt.toISOString(),
		},
		201,
	);
};

export const listPosts: AppRouteHandler<ListPostRoute> = async (c) => {
	const { limit, offset } = c.req.valid("query");

	const results = await db.query.post.findMany({
		orderBy: [desc(post.createdAt)],
		limit: Number(limit),
		offset: Number(offset),
		with: { contents: true },
	});

	return c.json(results.map(serializePost), 200);
};

export const getPostById: AppRouteHandler<GetPostByIdRoute> = async (c) => {
	const { id } = c.req.valid("param");

	const result = await db.query.post.findFirst({
		where: eq(post.id, id),
		with: { contents: true },
	});

	if (!result) {
		return c.json({ message: "Post not found" }, 404);
	}

	return c.json(serializePost(result), 200);
};

export const getPostsByUserId: AppRouteHandler<UserPostsRoute> = async (c) => {
	const { userId } = c.req.valid("param");
	const { limit, offset } = c.req.valid("query");

	const results = await db.query.post.findMany({
		where: eq(post.userId, userId),
		orderBy: [desc(post.createdAt)],
		limit: Number(limit),
		offset: Number(offset),
		with: { contents: true },
	});

	return c.json(results.map(serializePost), 200);
};

export const updatePost: AppRouteHandler<UpdatePostRoute> = async (c) => {
	const { id } = c.req.valid("param");
	const data = c.req.valid("json");

	const [result] = await db.update(post).set(data).where(eq(post.id, id)).returning();

	if (!result) {
		return c.json({ message: "Post not found" }, 404);
	}

	return c.json(serializePost(result), 200);
};

export const deletePost: AppRouteHandler<DeletePostRoute> = async (c) => {
	const { id } = c.req.valid("param");

	const [result] = await db.delete(post).where(eq(post.id, id)).returning();

	if (!result) {
		return c.json({ message: "Post not found" }, 404);
	}

	return c.json(serializePost(result), 200);
};

export const likePost: AppRouteHandler<LikePostRoute> = async (c) => {
	const { id } = c.req.valid("param");

	const [result] = await db
		.update(post)
		.set({ likesCount: sql`${post.likesCount} + 1` })
		.where(eq(post.id, id))
		.returning();

	if (!result) {
		return c.json({ message: "Post not found" }, 404);
	}

	return c.json(serializePost(result), 200);
};

export const dislikePost: AppRouteHandler<DislikePostRoute> = async (c) => {
	const { id } = c.req.valid("param");

	const [result] = await db
		.update(post)
		.set({ likesCount: sql`${post.likesCount} - 1` })
		.where(eq(post.id, id))
		.returning();

	if (!result) {
		return c.json({ message: "Post not found" }, 404);
	}

	return c.json(serializePost(result), 200);
};

export const addPostContent: AppRouteHandler<AddContentRoute> = async (c) => {
	const { id } = c.req.valid("param");
	const data = c.req.valid("json");

	const [result] = await db
		.insert(postContents)
		.values({ ...data, postId: id })
		.returning();

	if (!result) {
		return c.json({ message: "Failed to add content" }, 400);
	}

	return c.json(result, 201);
};

export const deletePostContent: AppRouteHandler<DeleteContentRoute> = async (c) => {
	const { contentId, postId } = c.req.valid("param");

	const [result] = await db
		.delete(postContents)
		.where(and(eq(postContents.id, contentId), eq(postContents.postId, postId)))
		.returning();

	if (!result) {
		return c.json({ message: "Content not found" }, 404);
	}

	return c.json({ message: "Content Deleted Successfully" }, 200);
};

/**
 *
 * ! Comments Services
 *
 */

export const addComment: AppRouteHandler<AddCommentRoute> = async (c) => {
	const { postId } = c.req.valid("param");
	const data = c.req.valid("json");

	const [result] = await db
		.insert(postComments)
		.values({ ...data, postId: postId })
		.returning();

	if (!result.id) {
		return c.json({ message: "Failed to add comment" }, 400);
	}

	return c.json(result, 201);
};

export const deleteComment: AppRouteHandler<DeleteCommentRoute> = async (c) => {
	const { commentId, postId } = c.req.valid("param");

	const [result] = await db
		.delete(postComments)
		.where(and(eq(postComments.id, commentId), eq(postComments.postId, postId)))
		.returning();

	if (!result) {
		return c.json({ message: "Comment not found" }, 404);
	}

	return c.json({ message: "Comment Deleted Successfully" }, 200);
};

export const updateComment: AppRouteHandler<UpdateCommentRoute> = async (c) => {
	const { postId, commentId } = c.req.valid("param");
	const data = c.req.valid("json");

	const [updated] = await db
		.update(postComments)
		.set({
			...data,
			updatedAt: new Date(),
		})
		.where(and(eq(postComments.id, commentId), eq(postComments.postId, postId)))
		.returning();

	if (!updated) {
		return c.json({ message: "Comment not found" }, 404);
	}

	return c.json(updated, 200);
};
