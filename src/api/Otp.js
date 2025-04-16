import { API_URL } from "@env";

const apiUrl = API_URL;

const Otp = async ({ email, otp }) => {
  if (!email || !otp) {
    console.log("Error", "Please fill out all fields");
    return;
  }

  const payload = {
    email,
    otp
  };

  console.log("Inside OTP.js",payload);
  console.log(apiUrl);

  try {
    console.log("try ke andar")
    const response = await fetch(`${apiUrl}/email-verification/otp`, {
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

export default Otp;
