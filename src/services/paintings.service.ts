import { getUrl, list, getProperties } from 'aws-amplify/storage';
const painting1 = import.meta.env.VITE_PAULS_FAV_Painting1;
const painting2 = import.meta.env.VITE_PAULS_FAV_Painting2;
const painting3 = import.meta.env.VITE_PAULS_FAV_Painting3;
import { GalleryImage } from '@/components/Paintings/PaintingsPage/ImageGallery';

var paintings: GalleryImage[] = [];

export const loadPaintingPreviews = async (): Promise<GalleryImage[]> => {
  try {
    const photoKeys = [painting1, painting2, painting3];

    const photos = await Promise.all(
      photoKeys.map(async (key) => {
        const fullPath = `public/${key}`; // Construct the full path

        // Fetch the image URL and metadata in parallel
        const [urlResult, propertiesResult] = await Promise.all([
          getUrl({ path: fullPath }),
          getProperties({ path: fullPath }),
        ]);

        const imageUrl = urlResult.url;
        const metaData = propertiesResult.metadata;

        return {
          key: key as string, // Original key
          url: imageUrl.href,
          title: metaData?.title,
          createdDate: metaData?.createddate,
          description: metaData?.description,
        };
      })
    );

    return photos;
  } catch (error) {
    console.error("Error loading painting previews:", error);
    // Handle the error appropriately, e.g., return an empty array or rethrow
    return [];
  }
};

export const loadPaintings = async (): Promise<GalleryImage[]> => {
  try {
    const { items } = await list({ path: 'public/paintings_webp/' });
    // Filter out the "folder" entry with size 0
    const imageUrls = items.filter(item => item.size != 0);

    // If we already have all the paintings, return them
    if (paintings.length == imageUrls.length) {
      return paintings;
    }
    

    // Concurrently fetch the URL and metadata for each image
    const photos = await Promise.all(
      imageUrls.map(async (item) => {
        const [urlResult, propertiesResult] = await Promise.all([
          getUrl({ path: item.path }),
          getProperties({ path: item.path }),
        ]);

        const imageUrl = urlResult.url;
        const metadata = propertiesResult.metadata;

        return {
          key: item.path,
          url: imageUrl.href,
          title: metadata?.title,
          createdDate: metadata?.createddate,
          description: metadata?.description,
        };
      })
    );

    paintings = photos;
    return photos;
  } catch (error) {
    console.error("Error loading all painting previews:", error);
    return [];
  }
};
