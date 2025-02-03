import PostsTable from "@/components/posts/PostsTable";
import React from "react";

const PostPage = () => {
	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">Posts</h1>
			<div>
				<PostsTable />
			</div>
		</div>
	);
};

export default PostPage;
