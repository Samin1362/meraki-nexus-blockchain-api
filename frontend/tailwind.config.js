/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // MerakiNexus Theme Colors
        "neon-purple": "#8B5CF6",
        "neon-blue": "#06B6D4",
        "neon-pink": "#EC4899",
        "dark-bg": "#0A0A0F",
        "dark-card": "#1A1A2E",
        "dark-border": "#2D2D44",
        "glass-bg": "rgba(255, 255, 255, 0.05)",
        "glass-border": "rgba(255, 255, 255, 0.1)",
      },
      backgroundImage: {
        "gradient-neon":
          "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #EC4899 100%)",
        "gradient-dark": "linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 100%)",
        "gradient-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      },
      boxShadow: {
        "neon-purple": "0 0 20px rgba(139, 92, 246, 0.5)",
        "neon-blue": "0 0 20px rgba(6, 182, 212, 0.5)",
        "neon-pink": "0 0 20px rgba(236, 72, 153, 0.5)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
        glow: "0 0 40px rgba(139, 92, 246, 0.3)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" },
          "100%": { boxShadow: "0 0 40px rgba(139, 92, 246, 0.8)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
