export type VCardData = {
  firstName?: string;
  lastName?: string;
  company?: string;
  jobTitle?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
};

export function generateVCard(data: VCardData): string {
  const lines: string[] = [];

  // vCard header
  lines.push('BEGIN:VCARD');
  lines.push('VERSION:3.0');

  // Generate unique ID
  const uid = `uid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  lines.push(`UID:${uid}`);

  // Name
  if (data.firstName || data.lastName) {
    const fullName = `${data.lastName || ''};${data.firstName || ''};;;`;
    lines.push(`FN:${data.firstName || ''} ${data.lastName || ''}`);
    lines.push(`N:${fullName}`);
  }

  // Organization
  if (data.company) {
    lines.push(`ORG:${escapeVCardValue(data.company)}`);
  }

  // Job title
  if (data.jobTitle) {
    lines.push(`TITLE:${escapeVCardValue(data.jobTitle)}`);
  }

  // Birthday
  if (data.dateOfBirth) {
    const date = new Date(data.dateOfBirth);
    const dateString = date.toISOString().split('T')[0];
    if (dateString) {
      const formattedDate = dateString.replace(/-/g, '');
      lines.push(`BDAY:${formattedDate}`);
    }
  }

  // Phone
  if (data.phone) {
    lines.push(`TEL;TYPE=CELL:${escapeVCardValue(data.phone)}`);
  }

  // Email
  if (data.email) {
    lines.push(`EMAIL:${escapeVCardValue(data.email)}`);
  }

  // Website
  if (data.website) {
    lines.push(`URL:${escapeVCardValue(data.website)}`);
  }

  // Address (stored in note field)
  if (data.address) {
    lines.push(`NOTE:${escapeVCardValue(data.address)}`);
  }

  // No profile picture support

  // vCard footer
  lines.push('END:VCARD');

  return lines.join('\r\n');
}

function escapeVCardValue(value: string): string {
  // Escape special characters in vCard values
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}
