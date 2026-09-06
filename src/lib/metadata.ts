const COPYRIGHT_START_YEAR = 2024;

export const getCopyrightYearLabel = (currentYear = new Date().getFullYear()) =>
  currentYear > COPYRIGHT_START_YEAR ? `${COPYRIGHT_START_YEAR} - ${currentYear}` : COPYRIGHT_START_YEAR.toString();
