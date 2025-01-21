import { Canvas, Image as FabricImage } from "fabric";

export const createCompositeImage = async (
  carImages: string[],
  mileageImage: string
): Promise<string> => {
  // Create a canvas with enough space for all images
  const canvas = new Canvas("c", {
    width: 1200,
    height: 800,
    backgroundColor: "white",
  });

  try {
    // Load all images
    const loadImage = (url: string): Promise<FabricImage> => {
      return new Promise((resolve, reject) => {
        FabricImage.fromURL(url, (img) => {
          if (img) {
            resolve(img);
          } else {
            reject(new Error("Failed to load image"));
          }
        });
      });
    };

    // Load car images
    const carImagesPromises = carImages.map(loadImage);
    const loadedCarImages = await Promise.all(carImagesPromises);

    // Load mileage image
    const mileageImg = await loadImage(mileageImage);

    // Calculate layout
    const maxImagesPerRow = 3;
    const imageWidth = 300;
    const imageHeight = 200;
    const padding = 20;

    // Place car images in a grid
    loadedCarImages.forEach((img, index) => {
      const row = Math.floor(index / maxImagesPerRow);
      const col = index % maxImagesPerRow;

      img.scaleToWidth(imageWidth);
      img.scaleToHeight(imageHeight);
      img.set({
        left: col * (imageWidth + padding) + padding,
        top: row * (imageHeight + padding) + padding,
      });

      canvas.add(img);
    });

    // Place mileage image at the bottom
    mileageImg.scaleToWidth(imageWidth);
    mileageImg.scaleToHeight(imageHeight);
    mileageImg.set({
      left: padding,
      top: Math.ceil(loadedCarImages.length / maxImagesPerRow) * (imageHeight + padding) + padding,
    });
    canvas.add(mileageImg);

    // Convert canvas to data URL
    return canvas.toDataURL();
  } catch (error) {
    console.error("Error creating composite image:", error);
    throw error;
  }
};