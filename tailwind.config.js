/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
        './app/**/*.{js,jsx,ts,tsx}',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    safelist: [
        'text-primary',
        'text-secondary',
        'text-background',
        'text-text',
        'text-lightgray',
        'text-darkgray',
        'text-border',
        'bg-primary',
        'bg-secondary',
        'bg-background',
        'bg-text',
        'bg-lightgray',
        'bg-darkgray',
        'bg-border',
        'border-primary',
        'border-secondary',
        'border-background',
        'border-text',
        'border-lightgray',
        'border-darkgray',
        'border-border',
        'hover:text-primary',
        'hover:bg-primary',
        'hover:border-primary'
    ],
    theme: {
        extend: {
            colors: {
                primary: '#DB0962',
                secondary: '#F8F9FA',
                background: '#FFFFFF',
                text: '#333333',
                lightgray: '#F5F5F5',
                darkgray: '#6c757d',
                border: '#E5E7EB',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
} 