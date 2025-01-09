export function validateCNPJ(cnpj: string): boolean {
  // Remove non-digits
  cnpj = cnpj.replace(/[^\d]/g, '');

  // Check length
  if (cnpj.length !== 14) return false;

  // Check for repeated digits
  if (/^(\d)\1+$/.test(cnpj)) return false;

  // Validation multipliers
  const multiplier1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const multiplier2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  // Calculate first digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * multiplier1[i];
  }
  const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  // Validate first digit
  if (parseInt(cnpj.charAt(12)) !== digit1) return false;

  // Calculate second digit
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * multiplier2[i];
  }
  const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  // Validate second digit
  if (parseInt(cnpj.charAt(13)) !== digit2) return false;

  return true;
}

export function validateHttpsUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export function formatCNPJ(cnpj: string): string {
  // Remove non-digits and ensure max length of 14
  const digits = cnpj.replace(/\D/g, '').slice(0, 14);
  
  // Format as XX.XXX.XXX/XXXX-XX
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}
