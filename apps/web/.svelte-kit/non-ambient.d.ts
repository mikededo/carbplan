
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/(public)" | "/(private)/(app)/(admin)" | "/(private)/(app)" | "/(private)" | "/(marketing)" | "/" | "/api" | "/api/workouts" | "/api/workouts/parse" | "/(public)/auth" | "/(public)/auth/log-in" | "/(public)/auth/sign-up" | "/(private)/(app)/dashboard" | "/(private)/onboarding" | "/(private)/(app)/plans" | "/(private)/(app)/plans/new" | "/(private)/(app)/plans/[id]" | "/(private)/(app)/settings" | "/(private)/(app)/(admin)/supplements";
		RouteParams(): {
			"/(private)/(app)/plans/[id]": { id: string }
		};
		LayoutParams(): {
			"/(public)": Record<string, never>;
			"/(private)/(app)/(admin)": Record<string, never>;
			"/(private)/(app)": { id?: string };
			"/(private)": { id?: string };
			"/(marketing)": Record<string, never>;
			"/": { id?: string };
			"/api": Record<string, never>;
			"/api/workouts": Record<string, never>;
			"/api/workouts/parse": Record<string, never>;
			"/(public)/auth": Record<string, never>;
			"/(public)/auth/log-in": Record<string, never>;
			"/(public)/auth/sign-up": Record<string, never>;
			"/(private)/(app)/dashboard": Record<string, never>;
			"/(private)/onboarding": Record<string, never>;
			"/(private)/(app)/plans": { id?: string };
			"/(private)/(app)/plans/new": Record<string, never>;
			"/(private)/(app)/plans/[id]": { id: string };
			"/(private)/(app)/settings": Record<string, never>;
			"/(private)/(app)/(admin)/supplements": Record<string, never>
		};
		Pathname(): "/" | "/api/workouts/parse" | "/auth/log-in" | "/auth/sign-up" | "/dashboard" | "/onboarding" | "/plans" | "/plans/new" | `/plans/${string}` & {} | "/settings" | "/supplements";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/robots.txt" | string & {};
	}
}