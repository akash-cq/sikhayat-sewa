const cookiesConfig = {
  httpOnly: true, // JS can't access (security)
  secure: true, // only over HTTPS
  sameSite: "strict", // or 'lax', 'none'
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};
export { cookiesConfig };
