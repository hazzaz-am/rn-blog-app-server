import {
	createPostSchema,
	postCommentResponseSchema,
	postCommentSchema,
	postContentResponseSchema,
	postContentSchema,
	postSchema,
	updatePostCommentSchema,
	updatePostSchema,
} from "@/db/schemas/post.schema";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

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

export const getPostById = createRoute({
	tags: ["Posts"],
	method: "get",
	path: "/posts/:id",
	request: {
		params: z.object({
			id: z.string(),
		}),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContentRequired(postSchema, "Post details"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(createMessageObjectSchema("Post not found"), "Post not found"),
	},
});

export const getPostsByUserId = createRoute({
	tags: ["Posts"],
	method: "get",
	path: "/posts/user/:userId",
	request: {
		params: z.object({
			userId: z.string(),
		}),
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
		params: z.object({
			id: z.string(),
		}),
		body: jsonContent(updatePostSchema, "Updated post data"),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContentRequired(postSchema, "Post updated successfully"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(createMessageObjectSchema("Post not found"), "Post not found"),
	},
});

export const deletePost = createRoute({
	tags: ["Posts"],
	method: "delete",
	path: "/posts/:id",
	request: {
		params: z.object({
			id: z.string(),
		}),
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
		params: z.object({
			id: z.string(),
		}),
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
		params: z.object({
			id: z.string(),
		}),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContentRequired(postSchema, "Post unliked"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(createMessageObjectSchema("Post not found"), "Post not found"),
	},
});

export const addPostContent = createRoute({
	tags: ["Posts"],
	method: "post",
	path: "/posts/:id/contents",
	request: {
		params: z.object({
			id: z.string(),
		}),
		body: jsonContent(postContentSchema, "Post content data"),
	},
	responses: {
		[HttpStatusCodes.CREATED]: jsonContentRequired(postContentResponseSchema, "Content added"),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(createMessageObjectSchema("Invalid request"), "Invalid request"),
	},
});

export const deletePostContent = createRoute({
	tags: ["Posts"],
	method: "delete",
	path: "/posts/:postId/contents/:contentId",
	request: {
		params: z.object({
			postId: z.string(),
			contentId: z.string(),
		}),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(z.object({ message: z.string() }), "Content Deleted Successfully"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(z.object({ message: z.string() }), "Content not found"),
	},
});

/**
 *
 * ! Comments Routes
 *
 */

export const addComment = createRoute({
	tags: ["Comments"],
	method: "post",
	path: "/posts/:id/comments",
	request: {
		params: z.object({
			postId: z.string(),
		}),
		body: jsonContent(postCommentSchema, "Post content data"),
	},
	responses: {
		[HttpStatusCodes.CREATED]: jsonContentRequired(postCommentResponseSchema, "Content added"),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(createMessageObjectSchema("Invalid request"), "Invalid request"),
	},
});

export const deleteComment = createRoute({
	tags: ["Comments"],
	method: "delete",
	path: "/posts/:postId/comments/:commentId",
	request: {
		params: z.object({
			postId: z.string(),
			commentId: z.string(),
		}),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(z.object({ message: z.string() }), "Comment Deleted Successfully"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(z.object({ message: z.string() }), "Comment not found"),
	},
});

export const updateComment = createRoute({
	tags: ["Comments"],
	method: "put",
	path: "/posts/:postId/comments/:commentId",
	request: {
		params: z.object({
			postId: z.string(),
			commentId: z.string(),
		}),
		body: jsonContent(updatePostCommentSchema, "Update Post Comment"),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(postCommentResponseSchema, "Comment Updated Successfully"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(createMessageObjectSchema("Comment not found"), "Comment not found"),
	},
});

export type CreatePostRoute = typeof createPost;
export type ListPostRoute = typeof listPosts;
export type GetPostByIdRoute = typeof getPostById;
export type UserPostsRoute = typeof getPostsByUserId;
export type UpdatePostRoute = typeof updatePost;
export type DeletePostRoute = typeof deletePost;
export type LikePostRoute = typeof likePost;
export type DislikePostRoute = typeof dislikePost;
export type AddContentRoute = typeof addPostContent;
export type DeleteContentRoute = typeof deletePostContent;
export type AddCommentRoute = typeof addComment;
export type DeleteCommentRoute = typeof deleteComment;
export type UpdateCommentRoute = typeof updateComment;
