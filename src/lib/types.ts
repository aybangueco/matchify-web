export interface APIResponse {
	success: boolean;
	message: string;
}

export interface APIErrorResponse extends APIResponse {
	formErrors?: string[];
	fieldErrors?: Record<string, unknown>;
}

export type Pronoun = "He/His" | "She/Her";

export interface Profile {
	id: string;
	userID: string;
	avatarLink?: string;
	location: string;
	bio: string;
	pronoun: Pronoun;
	createdAt: Date;
	updatedAt: Date;
}

export interface GetProfileResponse extends APIResponse {
	profile: Profile | null;
}
