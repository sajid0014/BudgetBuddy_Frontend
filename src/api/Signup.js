import { API_URL } from "@env";

const apiUrl = API_URL;

const signup = async ({ firstName, lastName, email, phoneNumber, password }) => {
  if (!firstName || !lastName || !email || !phoneNumber || !password) {
    console.log("Error", "Please fill out all fields");
    return;
  }

  const payload = {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
  };

  console.log(payload);
  console.log(apiUrl);

  try {
    const response = await fetch(`${apiUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response;
  } catch (error) {
    console.log("Error", "Something went wrong. Please try again later.");
    console.error("Signup error: ", error);
  }
};

export default signup;
