import { db } from "@/db";
import type { Post, PostContent } from "@/db/schemas/post.schema";
import { post, postContents } from "@/db/schemas/post.schema";
import { AppRouteHandler } from "@/types";
import { desc, eq, sql } from "drizzle-orm";
import {
	AddContentRoute,
	CreatePostRoute,
	DislikePostRoute,
	GetOnePostRoute,
	LikePostRoute,
	ListPostRoute,
	PostDeleteRoute,
	UpdatePostRoute,
	userPostsRoute,
} from "./posts.router";

const serializePost = (post: any) => ({
	...post,
	createdAt: post.createdAt.toISOString(),
	updatedAt: post.updatedAt.toISOString(),
	contents: post.contents?.map((c: any) => ({
		...c,
	})),
});

export const createPostHandler: AppRouteHandler<CreatePostRoute> = async (c) => {
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

export const getPostById: AppRouteHandler<GetOnePostRoute> = async (c) => {
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

export const getPosts: AppRouteHandler<ListPostRoute> = async (c) => {
	const { limit, offset } = c.req.valid("query");

	const results = await db.query.post.findMany({
		orderBy: [desc(post.createdAt)],
		limit: Number(limit),
		offset: Number(offset),
		with: { contents: true },
	});

	return c.json(results.map(serializePost), 200);
};

export const getPostsByUserId: AppRouteHandler<userPostsRoute> = async (c) => {
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

export const deletePost: AppRouteHandler<PostDeleteRoute> = async (c) => {
	const { id } = c.req.valid("param");

	const [result] = await db.delete(post).where(eq(post.id, id)).returning();

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

export const deletePostContent = async (id: string): Promise<PostContent | undefined> => {
	const [result] = await db.delete(postContents).where(eq(postContents.id, id)).returning();
	return result;
};

export const incrementLikes: AppRouteHandler<LikePostRoute> = async (c) => {
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

export const decrementLikes: AppRouteHandler<DislikePostRoute> = async (c) => {
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

export const incrementComments = async (id: string): Promise<Post | undefined> => {
	const [result] = await db
		.update(post)
		.set({ commentsCount: sql`${post.commentsCount} + 1` })
		.where(eq(post.id, id))
		.returning();
	return result;
};

export const incrementShares = async (id: string): Promise<Post | undefined> => {
	const [result] = await db
		.update(post)
		.set({ sharesCount: sql`${post.sharesCount} + 1` })
		.where(eq(post.id, id))
		.returning();
	return result;
};
