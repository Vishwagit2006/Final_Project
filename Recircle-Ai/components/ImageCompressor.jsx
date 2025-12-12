import * as ImageManipulator from 'expo-image-manipulator';

export const compressImage = async (uri) => {
  try {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipulatedImage.uri;
  } catch (error) {
    throw new Error('Failed to compress image');
  }
};