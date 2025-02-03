import PostDetails from "@/components/posts/PostDetails";
import React from "react";

const PostReviewPage = async ({
	params,
}: {
	params: Promise<{ postId: string }>;
}) => {
	const postId = (await params).postId;
	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">Post</h1>
			<div>
				<PostDetails postId={postId} />
			</div>
		</div>
	);
};

export default PostReviewPage;
