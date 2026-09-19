export function sanitizeText(input: string): string {
  if (!input) return "";
  // Basic stripping of HTML tags to prevent XSS
  return input.replace(/<\/?[^>]+(>|$)/g, "");
}

export function sanitizeSearchQuery(input: string): string {
  if (!input) return "";
  // Remove special chars for search, keeping only alphanumeric and spaces
  return input.replace(/[^a-zA-Z0-9\s]/g, "").trim();
}

export async function validateFileUpload(
  file: File, 
  type: 'profile_photo' | 'cover' | 'video'
): Promise<{ isValid: boolean; error?: string }> {
  
  const MAX_SIZES = {
    'profile_photo': 5 * 1024 * 1024,
    'cover': 10 * 1024 * 1024,
    'video': 200 * 1024 * 1024,
  };

  if (file.size > MAX_SIZES[type]) {
    return { 
      isValid: false, 
      error: `File exceeds maximum size of ${MAX_SIZES[type] / (1024 * 1024)}MB` 
    };
  }

  // Read first 8 bytes for magic number validation
  const buffer = await file.slice(0, 8).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

  if (type === 'profile_photo' || type === 'cover') {
    // Check for JPEG (FF D8 FF) or PNG (89 50 4E 47)
    if (hex.startsWith('FFD8FF') || hex.startsWith('89504E47')) {
      return { isValid: true };
    }
    return { isValid: false, error: "Invalid image format. Only JPEG and PNG are allowed." };
  }

  if (type === 'video') {
    // Check for MP4 ('ftyp' box at offset 4, which is 66 74 79 70)
    const ftypHex = Array.from(bytes.slice(4, 8)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    if (ftypHex === '66747970') {
      return { isValid: true };
    }
    return { isValid: false, error: "Invalid video format. Only MP4 is allowed." };
  }

  return { isValid: false, error: "Unknown file type" };
}
