import { API_URL } from "@env";
import getToken from "./Token/GetToken";
const apiUrl = API_URL;

const profile = async () => {
    const token = await getToken();
    console.log(apiUrl);

  try {
    const response = await fetch(`${apiUrl}/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log("Error", "Something went wrong. Please try again later.");
    console.error("Signup error: ", error);
  }
};

export default profile;