/**
 * Nepal Calendar & Currency Utilities
 * Formats currency in Nepalese Rupees (NPR / Rs.) and calculates Bikram Sambat (BS) dates.
 */

// Nepali Months in English transliteration and Devanagari
export const NEPALI_MONTHS = [
  { en: 'Baisakh', np: 'बैशाख' },
  { en: 'Jestha', np: 'जेठ' },
  { en: 'Ashadh', np: 'असार' },
  { en: 'Shrawan', np: 'साउन' },
  { en: 'Bhadra', np: 'भदौ' },
  { en: 'Ashwin', np: 'असोज' },
  { en: 'Kartik', np: 'कार्तिक' },
  { en: 'Mangsir', np: 'मंसिर' },
  { en: 'Poush', np: 'पुष' },
  { en: 'Magh', np: 'माघ' },
  { en: 'Falgun', np: 'फागुन' },
  { en: 'Chaitra', np: 'चैत' },
];

/**
 * Format number into Nepalese Rupee standard format (e.g. Rs. 1,450.00)
 */
export function formatNPR(amount: number): string {
  const parts = Math.abs(amount).toFixed(2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  // South Asian Numbering System (Last 3 digits, then pairs of 2 digits)
  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    integerPart = formattedOther + ',' + lastThree;
  }

  const sign = amount < 0 ? '-' : '';
  return `${sign}Rs. ${integerPart}.${decimalPart}`;
}

/**
 * Returns current Bikram Sambat (BS) date string and Nepali Fiscal Year
 * Gregorian AD to Bikram Sambat (BS) approximation (~56 years, 8 months, 17 days difference)
 */
export function getNepaliDate(date: Date = new Date()): {
  yearBS: number;
  monthBS: string;
  monthIndex: number;
  dayBS: number;
  formattedBS: string;
  formattedAD: string;
  fiscalYear: string;
} {
  // Approximate standard conversion offset:
  // Mid-April is Baisakh 1.
  const adYear = date.getFullYear();
  const adMonth = date.getMonth(); // 0-indexed (0 = Jan, 8 = Sep)
  const adDay = date.getDate();

  // Basic accurate table for current era (2024-2027 AD => 2081-2084 BS)
  let bsYear = adYear + 57;
  // If before April 13/14, year is +56
  if (adMonth < 3 || (adMonth === 3 && adDay < 13)) {
    bsYear = adYear + 56;
  }

  // Nepali month mapping from Gregorian
  // Jan (mid Poush - mid Magh), Feb (mid Magh - mid Falgun), etc.
  let monthIdx = 0;
  let bsDay = adDay;

  // For September (Bhadra / Ashwin):
  if (adMonth === 8) { // September
    if (adDay < 16) {
      monthIdx = 4; // Bhadra
      bsDay = adDay + 15;
    } else {
      monthIdx = 5; // Ashwin
      bsDay = adDay - 16;
    }
  } else if (adMonth === 0) { // Jan
    monthIdx = adDay < 15 ? 8 : 9; // Poush / Magh
    bsDay = adDay < 15 ? adDay + 16 : adDay - 14;
  } else {
    // General fallback
    monthIdx = (adMonth + 8) % 12;
    bsDay = Math.min(32, Math.max(1, (adDay + 14) % 31 + 1));
  }

  const monthObj = NEPALI_MONTHS[monthIdx] || NEPALI_MONTHS[4];
  const formattedBS = `${bsYear} ${monthObj.en} ${bsDay} (${monthObj.np} ${bsDay}, ${bsYear})`;

  // Nepal Fiscal Year runs from Shrawan 1 to Ashadh 31
  const fyStart = monthIdx >= 3 ? bsYear : bsYear - 1;
  const fyEnd = (fyStart + 1) % 100;
  const fiscalYear = `${fyStart}/${String(fyEnd).padStart(2, '0')}`;

  const formattedAD = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return {
    yearBS: bsYear,
    monthBS: monthObj.en,
    monthIndex: monthIdx,
    dayBS: bsDay,
    formattedBS,
    formattedAD,
    fiscalYear,
  };
}

/**
 * Generate unique IRD compliant sequential tax invoice number
 */
export function generateInvoiceNumber(orderNum: number, fiscalYear: string): string {
  return `INV-${fiscalYear.replace('/', '-')}-${String(orderNum).padStart(5, '0')}`;
}
