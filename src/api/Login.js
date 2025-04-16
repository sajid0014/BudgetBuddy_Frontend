import {API_URL} from "@env"
const apiUrl=API_URL

const login=async ({email,password})=>{
    if(!email||!password){
        console.log("Error","Please fill out all fields");
        return
    }

    const payload={
        email:email,
        password:password
    }

    console.log(payload)
    console.log(apiUrl)
    try{
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          return response;
    }catch(error){
        console.log("Error","Something went wrong. Please try again later.")
        console.error("Login error: ",error)
    }

}

export default login;