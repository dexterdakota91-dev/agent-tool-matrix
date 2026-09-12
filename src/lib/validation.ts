export function validateToolInput(data: {
  title: string;
  type: string;
  description?: string;
  markdownContent?: string;
  tags?: string[];
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required and must not be empty.');
  } else if (data.title.length > 100) {
    errors.push('Title must be at most 100 characters.');
  }

  const allowedTypes = ['prompt', 'skill', 'mcp'];
  if (!data.type || !allowedTypes.includes(data.type)) {
    errors.push(`Type must be one of: ${allowedTypes.join(', ')}.`);
  }

  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      errors.push('Tags must be an array.');
    } else {
      if (data.tags.length > 10) {
        errors.push('A maximum of 10 tags is allowed.');
      }
      for (let i = 0; i < data.tags.length; i++) {
        const tag = data.tags[i];
        if (typeof tag !== 'string' || tag.trim().length === 0) {
          errors.push('Each tag must be a non-empty string.');
          break;
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateWorkflowInput(data: {
  title: string;
  description?: string;
  toolIds: string[];
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required and must not be empty.');
  }

  if (!Array.isArray(data.toolIds)) {
    errors.push('toolIds must be an array.');
  } else {
    for (let i = 0; i < data.toolIds.length; i++) {
      const toolId = data.toolIds[i];
      if (typeof toolId !== 'string' || toolId.trim().length === 0) {
        errors.push('Each toolId must be a non-empty string.');
        break;
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function isValidUrl(url: string): boolean {
  if (typeof url !== 'string') {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}
