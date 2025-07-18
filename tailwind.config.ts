import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
        // Updated fonts to match the Terra design
				sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
			},
			colors: {
        // New Terra Color Palette
        'terra-green': {
          DEFAULT: '#2E7D32',
          light: '#4CAF50',
        },
        'terra-blue': {
          DEFAULT: '#1976D2',
          light: '#2196F3',
        },
        'terra-light': '#F5F5F5',
        'terra-dark': '#121212',
        'terra-gray': '#616161',
        // Existing colors mapped for compatibility
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;