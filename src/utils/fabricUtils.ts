import { Canvas, Image as FabricImage } from "fabric";

export const loadBackgroundImage = async (
  fabricCanvas: Canvas,
  imagePath: string
): Promise<void> => {
  return new Promise((resolve) => {
    FabricImage.fromURL(imagePath, (img) => {
      // Scale image to fit canvas while maintaining aspect ratio
      const scale = Math.min(
        (fabricCanvas.width! * 0.9) / img.width!,
        (fabricCanvas.height! * 0.9) / img.height!
      );
      
      img.scale(scale);
      
      // Center the image
      const center = fabricCanvas.getCenter();
      img.set({
        left: center.left,
        top: center.top,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
      });
      
      fabricCanvas.backgroundImage = img;
      fabricCanvas.renderAll();
      resolve();
    });
  });
};