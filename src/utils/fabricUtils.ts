import { Canvas, Image } from "fabric";

export const loadBackgroundImage = async (
  fabricCanvas: Canvas,
  imagePath: string
): Promise<void> => {
  return new Promise((resolve) => {
    // Using the correct type for fabric.Image.fromURL options
    Image.fromURL(imagePath, {
      callback: (img) => {
        const scale = Math.min(
          (fabricCanvas.width! * 0.9) / img.width!,
          (fabricCanvas.height! * 0.9) / img.height!
        );
        
        img.scale(scale);
        
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
      }
    });
  });
};