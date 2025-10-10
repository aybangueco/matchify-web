export interface APIResponse {
	success: boolean;
	message: string;
}

export interface APIErrorResponse extends APIResponse {
	formErrors?: string[];
	fieldErrors?: Record<string, unknown>;
}
