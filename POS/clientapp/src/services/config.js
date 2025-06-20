const Env = {
    baseurl: import.meta.env.VITE_APP_API_URL,
    appUrl: import.meta.env.REACT_APP_APP_URL,
    chatUrl: import.meta.env.REACT_APP_CHAT_URL,

  //baseurl: "https://imeshma.com/api/",
  //appUrl: "https://imeshma.com",

  //baseurl: "https://localhost:1301/api/",
  //appUrl: "https://localhost:1301",

  //baseurl: "https://services.trustcab.in",
  //appUrl: "https://services.trustcab.in",
  THEME_COLORS: {
    PRIMARY: '#007bff',
    SECONDARY: '#fc3'
  }
};

export default Env;
