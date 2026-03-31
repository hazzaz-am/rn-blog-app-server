import { createPostSchema, postSchema, postContentSchema, postContentResponseSchema, updatePostSchema } from "@/db/schemas/post.schema";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const postIdParams = z.object({
	id: z.string().uuid().openapi({
		example: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
	}),
});

const userIdParams = z.object({
	userId: z.string().uuid().openapi({
		example: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
	}),
});

const paginationQuery = z
	.object({
		limit: z.coerce.number().min(1).max(100).default(20).openapi({ example: "20" }),
		offset: z.coerce.number().min(0).default(0).openapi({ example: "0" }),
	})
	.openapi({ description: "Pagination query parameters" });

export const createPost = createRoute({
	tags: ["Posts"],
	method: "post",
	path: "/posts",
	request: {
		body: jsonContent(createPostSchema, "Post data"),
	},
	responses: {
		[HttpStatusCodes.CREATED]: jsonContentRequired(postSchema, "Post created successfully"),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(createMessageObjectSchema("Invalid request body"), "Invalid request"),
	},
});

export const listPosts = createRoute({
	tags: ["Posts"],
	method: "get",
	path: "/posts",
	request: {
		query: paginationQuery,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(z.array(postSchema), "List of posts"),
	},
});

export const getOnePost = createRoute({
	tags: ["Posts"],
	method: "get",
	path: "/posts/:id",
	request: {
		params: postIdParams,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContentRequired(postSchema, "Post details"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(createMessageObjectSchema("Post not found"), "Post not found"),
	},
});

export const userPosts = createRoute({
	tags: ["Posts"],
	method: "get",
	path: "/posts/user/:userId",
	request: {
		params: userIdParams,
		query: paginationQuery,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(z.array(postSchema), "User's posts"),
	},
});

export const updatePost = createRoute({
	tags: ["Posts"],
	method: "put",
	path: "/posts/:id",
	request: {
		params: postIdParams,
		body: jsonContent(updatePostSchema, "Updated post data"),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContentRequired(postSchema, "Post updated successfully"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(createMessageObjectSchema("Post not found"), "Post not found"),
	},
});

export const postDelete = createRoute({
	tags: ["Posts"],
	method: "delete",
	path: "/posts/:id",
	request: {
		params: postIdParams,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContentRequired(postSchema, "Post deleted successfully"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(createMessageObjectSchema("Post not found"), "Post not found"),
	},
});

export const likePost = createRoute({
	tags: ["Posts"],
	method: "post",
	path: "/posts/:id/like",
	request: {
		params: postIdParams,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContentRequired(postSchema, "Post liked"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(createMessageObjectSchema("Post not found"), "Post not found"),
	},
});

export const dislikePost = createRoute({
	tags: ["Posts"],
	method: "delete",
	path: "/posts/:id/like",
	request: {
		params: postIdParams,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContentRequired(postSchema, "Post unliked"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(createMessageObjectSchema("Post not found"), "Post not found"),
	},
});

export const addContent = createRoute({
	tags: ["Posts"],
	method: "post",
	path: "/posts/:id/contents",
	request: {
		params: postIdParams,
		body: jsonContent(postContentSchema, "Post content data"),
	},
	responses: {
		[HttpStatusCodes.CREATED]: jsonContentRequired(postContentResponseSchema, "Content added"),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(createMessageObjectSchema("Invalid request"), "Invalid request"),
	},
});

export type CreatePostRoute = typeof createPost;
export type ListPostRoute = typeof listPosts;
export type GetOnePostRoute = typeof getOnePost;
export type userPostsRoute = typeof userPosts;
export type UpdatePostRoute = typeof updatePost;
export type PostDeleteRoute = typeof postDelete;
export type LikePostRoute = typeof likePost;
export type DislikePostRoute = typeof dislikePost;
export type AddContentRoute = typeof addContent;
