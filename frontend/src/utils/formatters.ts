export const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/[^0-9]/g, "");

    if (cleaned.length <= 3) {
        return cleaned;
    } else if (cleaned.length <= 7) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else if (cleaned.length <= 11) {
        // 010-1234-5678 (11 digits) or 010-123-4567 (10 digits)
        // Always prefer 3-4-4 for 11 digits
        // For 8-10 digits, fill the second group first to 4 digits
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    } else {
        // Limit to 11 digits
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    }
};
