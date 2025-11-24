/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cyan: {
                    500: '#06b6d4',
                },
                emerald: {
                    500: '#10b981',
                    600: '#059669',
                },
            },
        },
    },
    plugins: [],
}
