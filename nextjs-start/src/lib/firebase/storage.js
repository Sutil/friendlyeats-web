import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

import { storage } from "@/src/lib/firebase/firebase";

import { updateRestaurantImageReference } from "@/src/lib/firebase/firestore";

// Replace the two functions below
export async function updateRestaurantImage(restaurantId, image) {
    try {
        if (!restaurantId)
                throw new Error("No restaurant ID has been provided.");

        if (!image || !image.name)
                throw new Error("A valid image has not been provided.");

        const publicImageUrl = await uploadImage(restaurantId, image);
        await updateRestaurantImageReference(restaurantId, publicImageUrl, image.name);

        return {imageURL: publicImageUrl, imageName: image.name};
    } catch (error) {
            console.error("Error processing request:", error);
    }
}

async function uploadImage(restaurantId, image) {
    const filePath = `images/${restaurantId}/${image.name}`;
    const newImageRef = ref(storage, filePath);

    
    await uploadBytesResumable(newImageRef, image);

    return await getDownloadURL(newImageRef);
}

export async function deleteImage(restaurantId, imageName) {
    const filePath = `images/${restaurantId}/${imageName}`;

    const newImageRef = ref(storage, filePath);

    await deleteObject(newImageRef);

    const theNumber = Math.floor(Math.random() * (22 - 1 + 1) + 1)

    const defaultImageName = `food_${theNumber}.png`

    const defualtImageURL = `https://storage.googleapis.com/firestorequickstarts.appspot.com/${defaultImageName}`

    await updateRestaurantImageReference(restaurantId, defualtImageURL, defaultImageName);

    return {imageURL: defualtImageURL, imageName: defaultImageName};

}
// Replace the two functions above
