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

export type ArtistMatchInfoImage = {
	"#text": string;
	size: "small" | "medium" | "large" | "extralarge";
};

export interface ArtistMatchInfo {
	name: string;
	listeners: string;
	mbid: string;
	url: string;
	streamable: string;
	image: ArtistMatchInfoImage[];
}

export interface ArtistsSearchResponse extends APIResponse {
	artists: ArtistMatchInfo[];
}

export interface Artist {
	id: string;
	artistName: string;
	imageURL: string;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface GetArtistsResponse extends APIResponse {
	artists: Artist[];
}

export interface ArtistResponse extends APIResponse {
	artist: Artist;
}

export type Find = "ARTISTS" | "ALBUMS" | "MOVIES";

export type SocketType = "CONNECTED" | "DISCONNECTED" | "MESSAGE" | "BROADCAST";

export type WSDisconnected = {
	type: "DISCONNECTED";
	message: string;
};

export interface ConnectedTo {
	username: string;
}

export type WSConnected = {
	type: "CONNECTED";
	connectedTo: ConnectedTo;
};

export type WSMessage = {
	type: "MESSAGE";
	message: string;
	from: string | "SYSTEM";
};

export type WSState = {
	type: "STATE";
	typing: boolean;
	from: string;
};

export type WSDataContext = WSDisconnected | WSConnected | WSMessage | WSState;
