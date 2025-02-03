export const getImageUrl = (path: string | null | undefined) => {
	if (!path) return "/placeholder-image.jpg";
	return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${path}`;
};
