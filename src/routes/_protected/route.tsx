import {
	createFileRoute,
	Outlet,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { Compass, LogOut, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/modules/auth/components/auth-provider";

export const Route = createFileRoute("/_protected")({
	beforeLoad: async ({ context }) => {
		let redirectToLogin = false;

		try {
			await context.auth.ensureSession();
		} catch (_) {
			redirectToLogin = true;
		}

		if (redirectToLogin) {
			throw redirect({ to: "/login" });
		}
	},
	component: ProtectedLayout,
});

function ProtectedLayout() {
	const navigate = useNavigate();
	const { session } = useAuth();

	const navItems = [
		{ label: "Find", icon: Compass, to: "/find" },
		{ label: "Messages", icon: MessageSquare, to: "/messages" },
	];

	return (
		<div className="min-h-screen bg-slate-50">
			<header className="fixed w-full top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
				<div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
					{/* Logo */}
					<div className="flex-shrink-0">
						<h1 className="text-2xl sm:text-3xl font-bold text-primary bg-clip-text">
							Matchify
						</h1>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-1">
						{navItems.map((item) => {
							const Icon = item.icon;
							return (
								<Button
									key={item.label}
									variant="ghost"
									className="gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
									onClick={() => navigate({ to: item.to })}
								>
									<Icon className="w-4 h-4" />
									{item.label}
								</Button>
							);
						})}
					</nav>

					{/* User Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="gap-2 hover:bg-slate-100">
								<div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
									<User className="w-4 h-4 text-white" />
								</div>
								<span className="hidden sm:inline text-slate-700 font-medium">
									{session?.user.name}
								</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuLabel>{session?.user.name}</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => navigate({ to: "/profile" })}
								className="gap-2 cursor-pointer"
							>
								<User className="w-4 h-4" />
								View Profile
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="gap-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
								onClick={async () => {
									await authClient.signOut();
									navigate({ to: "/login" });
								}}
							>
								<LogOut className="w-4 h-4" />
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Mobile Navigation */}
				<nav className="md:hidden px-4 pb-3 flex gap-2 border-t border-slate-200">
					{navItems.map((item) => {
						const Icon = item.icon;
						return (
							<Button
								key={item.label}
								variant="ghost"
								size="sm"
								className="gap-2 flex-1 justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100"
								onClick={() => navigate({ to: item.to })}
							>
								<Icon className="w-4 h-4" />
								<span className="hidden xs:inline">{item.label}</span>
							</Button>
						);
					})}
				</nav>
			</header>

			{/* Main Content */}
			<main className="pt-20 md:pt-16">
				<Outlet />
			</main>
		</div>
	);
}
