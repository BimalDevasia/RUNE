module.exports = {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        sen: ["Sen", 'sans-serif'],
        ubuntu_mono:['Ubuntu Mono','monospace']
      },
      colors:{
        primary_green:"#3EB489",
        primary_grey:"#252628"
      }
    },
  },
  plugins: [],
};
