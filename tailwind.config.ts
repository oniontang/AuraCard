/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      /* ===== 字体 ===== */
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        serif: ['Noto Serif SC', 'Times New Roman', 'serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
      },

      /* ===== 主色 —— 蓝白商务 ===== */
      colors: {
        brand: {
          DEFAULT: '#165dff',
          hover: '#4080ff',
          light: '#e8f3ff',
          soft: 'rgba(22, 93, 255, 0.08)',
        },
        cyan: '#14c9c9',
      },

      /* ===== 语义色 ===== */
      colors: {
        success: { DEFAULT: '#00b42a', soft: 'rgba(0, 180, 42, 0.08)' },
        error: { DEFAULT: '#f53f3f', soft: 'rgba(245, 63, 63, 0.08)' },
        warning: { DEFAULT: '#ff7d00', soft: 'rgba(255, 125, 0, 0.08)' },
      },

      /* ===== 中性色 ===== */
      colors: {
        bg: {
          DEFAULT: '#f4f7fc',
          warm: '#f7f9fc',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt: '#f7f9fc',
          hover: '#f0f2f5',
        },
        border: {
          DEFAULT: '#eef0f5',
          hover: '#c9cdd4',
        },
        text: {
          DEFAULT: '#1d2129',
          secondary: '#4e5969',
          tertiary: '#86909c',
          quaternary: '#c9cdd4',
        },
      },

      /* ===== 圆角 ===== */
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },

      /* ===== 阴影 ===== */
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
        DEFAULT: '0 4px 10px rgba(0, 0, 0, 0.04)',
        md: '0 4px 15px rgba(0, 0, 0, 0.06)',
        lg: '0 8px 25px rgba(0, 0, 0, 0.08)',
        xl: '0 16px 40px rgba(0, 0, 0, 0.1)',
        brand: '0 4px 10px rgba(22, 93, 255, 0.2)',
      },

      /* ===== 响应式断点 ===== */
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1220px',
        '2xl': '1440px',
      },

      /* ===== 间距微调 ===== */
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
    },
  },
  plugins: [],
}
