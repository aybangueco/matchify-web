import axios, { type AxiosError } from "axios";
import type { APIErrorResponse } from "./types";

type APIConfig = {
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	url: string;
	data?: unknown;
	params?: unknown;
};

const apiInstance = axios.create({
	baseURL: "http://localhost:8080",
	withCredentials: true,
});

apiInstance.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

apiInstance.interceptors.response.use(
	(response) => response,
	(error: AxiosError) =>
		Promise.reject(error.response?.data as APIErrorResponse),
);

export default async function api<T>({ method, url, data, params }: APIConfig) {
	try {
		const response = await apiInstance.request({ method, url, data, params });
		return response.data as T;
	} catch (error) {
		throw error as APIErrorResponse;
	}
}
