import { MAX_IMAGES_PER_PROJECT, MAX_IMAGE_SIZE, CATEGORIES } from './constants.js';

export class ProjectValidator {
    static validate(project) {
        const errors = [];

        // Validar título
        if (!project.title || typeof project.title !== 'string') {
            errors.push('Título é obrigatório');
        } else if (project.title.trim().length < 3) {
            errors.push('Título deve ter pelo menos 3 caracteres');
        } else if (project.title.trim().length > 255) {
            errors.push('Título deve ter no máximo 255 caracteres');
        }

        // Validar descrição
        if (!project.description || typeof project.description !== 'string') {
            errors.push('Descrição é obrigatória');
        } else if (project.description.trim().length < 10) {
            errors.push('Descrição deve ter pelo menos 10 caracteres');
        }

        // Validar categoria
        const allowedCategories = [
            CATEGORIES.RESIDENCIAL,
            CATEGORIES.COMERCIAL,
            CATEGORIES.REFORMA,
            CATEGORIES.FACHADA
        ];
        if (!project.category || !allowedCategories.includes(project.category)) {
            errors.push('Categoria inválida');
        }

        // Validar estilo (opcional)
        if (project.style && project.style.length > 100) {
            errors.push('Estilo deve ter no máximo 100 caracteres');
        }

        // Validar imagens
        if (!project.images || !Array.isArray(project.images)) {
            errors.push('Imagens devem ser um array');
        } else if (project.images.length === 0) {
            errors.push('Pelo menos uma imagem é obrigatória');
        } else if (project.images.length > MAX_IMAGES_PER_PROJECT) {
            errors.push(`Máximo de ${MAX_IMAGES_PER_PROJECT} imagens por projeto`);
        } else {
            // Validar cada imagem
            project.images.forEach((file, index) => {
                if (!(file instanceof File)) {
                    errors.push(`Imagem ${index + 1} deve ser um arquivo válido`);
                } else {
                    if (!file.type.startsWith('image/')) {
                        errors.push(`Arquivo ${index + 1} deve ser uma imagem`);
                    }
                    if (file.size > MAX_IMAGE_SIZE) {
                        errors.push(`Imagem ${index + 1} excede o tamanho máximo de 5MB`);
                    }
                }
            });
        }

        if (errors.length > 0) {
            throw new ValidationError(errors);
        }

        return {
            title: project.title.trim(),
            description: project.description.trim(),
            category: project.category,
            style: project.style ? project.style.trim() : null,
            images: project.images
        };
    }
}

export class ValidationError extends Error {
    constructor(errors) {
        super('Validation failed');
        this.name = 'ValidationError';
        this.errors = errors;
    }
}
