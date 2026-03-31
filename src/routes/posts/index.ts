import { createRouter } from "@/lib/create-app";
import * as routes from "./posts.router";
import * as service from "./posts.service";

export const postsRouter = createRouter()
	.openapi(routes.createPost, service.createPostHandler)
	.openapi(routes.listPosts, service.getPosts)
	.openapi(routes.getOnePost, service.getPostById)
	.openapi(routes.userPosts, service.getPostsByUserId)
	.openapi(routes.updatePost, service.updatePost)
	.openapi(routes.postDelete, service.deletePost)
	.openapi(routes.likePost, service.incrementLikes)
	.openapi(routes.dislikePost, service.decrementLikes)
	.openapi(routes.addContent, service.addPostContent);
