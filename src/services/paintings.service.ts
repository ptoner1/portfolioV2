/**
 * Loads all available paintings from S3 bucket
 */
export const loadPaintings = async () => {
    try {
        const paintings = await fetch('/api/paintings');
        return paintings.json();
    }

    catch (error) {
        console.error('Error fetching paintings:', error);
        return {
            success: false,
            message: 'There was a problem processing your request. Please try again later.'
        };
    }
};

export const loadPaintingPreviews = async () => {
  try {
    const response = await fetch(`/api/paintings/preview`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching preview paintings:', error);
    return {
      success: false,
      message: 'There was a problem processing your request. Please try again later.'
    };
  }
};