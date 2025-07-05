
async function accessLocalObject() {

    let data = [];

    try {
        const response = await fetch("object.json");
        console.log("Object found");
        if (response.ok) {
            console.log("Response is okay");
            data = await response.json();
            console.log("Got the data");
            console.log(data.data[0]);
            return data;
        } else {
            console.log("The response is not okay");
        }
    } catch (error) {
        console.log(error);
    }
}



accessLocalObject();
