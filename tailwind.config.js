/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
            },
            colors: {
                zinc: {
                    950: '#131313',
                },
                cream: {
                    50: '#FDFBF7',
                    100: '#F7F5F0',
                    200: '#E6E4DE',
                    300: '#D1CEC6',
                    900: '#1c1c1c',
                }
            }
        },
    },
    plugins: [],
}
