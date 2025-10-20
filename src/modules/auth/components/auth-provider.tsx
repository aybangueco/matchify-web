import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, type ReactNode, useCallback, useContext } from "react";
import type { Session } from "@/lib/auth-client";
import { sessionQueryOptions } from "../service";

export type AuthContextType = {
	ensureSession: () => Promise<void>;
	session: Session | undefined;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
	children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
	const queryClient = useQueryClient();
	const { data: session } = useQuery(sessionQueryOptions());

	const ensureSession = useCallback(async () => {
		await queryClient.ensureQueryData(sessionQueryOptions());
	}, [queryClient]);

	return (
		<AuthContext.Provider value={{ session, ensureSession }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be inside AuthProvider.tsx");
	}

	return context;
}
