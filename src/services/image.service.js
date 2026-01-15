import { storage } from '../lib/supabase/storage.js';
import { MAX_IMAGE_SIZE } from '../lib/utils/constants.js';

export class ImageService {
    async uploadImages(files, projectId) {
        try {
            // Validar arquivos
            const validFiles = Array.from(files).filter(file => {
                if (!file.type.startsWith('image/')) {
                    console.warn(`File ${file.name} is not an image, skipping`);
                    return false;
                }
                if (file.size > MAX_IMAGE_SIZE) {
                    console.warn(`File ${file.name} exceeds size limit, skipping`);
                    return false;
                }
                return true;
            });

            if (validFiles.length === 0) {
                throw new Error('Nenhuma imagem válida encontrada');
            }

            const results = await storage.uploadMultipleImages(validFiles, projectId);
            return {
                success: true,
                data: results
            };
        } catch (error) {
            console.error('Error uploading images:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteImage(imagePath) {
        try {
            await storage.deleteImage(imagePath);
            return {
                success: true
            };
        } catch (error) {
            console.error('Error deleting image:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    optimizeImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1920;
                    const MAX_HEIGHT = 1080;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const optimizedFile = new File([blob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: Date.now()
                                });
                                resolve(optimizedFile);
                            } else {
                                reject(new Error('Failed to optimize image'));
                            }
                        },
                        'image/jpeg',
                        0.85
                    );
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

export const imageService = new ImageService();
