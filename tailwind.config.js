export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      aspectRatio: {
        "4/3": "4 / 3",
      },
      keyframes: {
        updown: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        updown: "updown 2s ease-in-out infinite", // 3초 동안 애니메이션 반복
      },
    },
  },
  corePlugins: {},
  plugins: [],
};
