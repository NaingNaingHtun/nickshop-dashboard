import api from "./api";
export const isAdmin = async (navigate) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) {
    navigate("/login");
    return;
  }
  await api
    .post("/auth/validateAdmin", { _id: user._id, token: user.accessToken })
    .catch(() => {
      //invalid user
      navigate("/login");
    });
};
