import { API_URL } from "@env";
const apiUrl = API_URL;

const UploadImage = async (image) => {
    console.log(apiUrl);

    try {
        const formdata = new FormData();
        console.log("Image type is: ", image.type);
        formdata.append('img', {
            uri: image.uri,
            name: 'image.jpg', // Change the filename if needed
            type: image.type || 'image/jpeg', // Change the type according to the image format
        });
        console.log("formdata here")
        console.log(formdata)
        let res = await fetch(`${API_URL}/upload`, {
            method: "POST",
            body: formdata,
            headers: {
                Accept: 'application/json',
            },
        })
        console.log("after fetch...")

        return res;
    } catch (error) {
        console.log("Error", "Something went wrong. Please try again later.");
        console.error("Signup error: ", error);
    }
};

export default UploadImage;