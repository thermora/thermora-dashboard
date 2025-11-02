"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			enableSystem={false}
			disableTransitionOnChange
			forcedTheme="light"
		>
			<ConvexBetterAuthProvider client={convex} authClient={authClient}>
				{children}
			</ConvexBetterAuthProvider>
			<Toaster richColors />
		</ThemeProvider>
	);
}
