import { createRouter } from "@/lib/create-app";
import * as routes from "./posts.router";
import * as service from "./posts.service";

export const postsRouter = createRouter()
	.openapi(routes.createPost, service.createPost)
	.openapi(routes.listPosts, service.listPosts)
	.openapi(routes.getPostById, service.getPostById)
	.openapi(routes.getPostsByUserId, service.getPostsByUserId)
	.openapi(routes.updatePost, service.updatePost)
	.openapi(routes.deletePost, service.deletePost)
	.openapi(routes.likePost, service.likePost)
	.openapi(routes.dislikePost, service.dislikePost)
	.openapi(routes.addPostContent, service.addPostContent)
	.openapi(routes.addComment, service.addComment);
