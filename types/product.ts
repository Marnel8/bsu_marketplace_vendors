export enum ItemCategory {
	FOOD = "food",
	BEVERAGE = "beverage",
	ELECTRONICS = "electronics",
	FASHION = "fashion",
	HOME_AND_GARDEN = "home and garden",
	BEAUTY = "beauty",
	TOYS = "toys",
	BOOKS = "books",
	SPORTS = "sports",
	OTHER = "other",
}

export enum VerificationStatus {
	PENDING = "pending",
	VERIFIED = "verified",
	REJECTED = "rejected",
}

export interface Image {
	id: string;
	url: string;
}

export interface Product {
	id: string;
	name: string;
	description: string;
	variant: string;
	category: ItemCategory;
	price: number;
	thumbnail: string;
	brand: string;
	rating: number;
	quantity: number;
	isVerified: VerificationStatus;
	images: Image[];
	createdAt: Date;
	updatedAt: Date;
	vendor: {
		name: string;
		ownerName?: string;
		ownerEmail?: string;
	};
	orderId?: string;
}
