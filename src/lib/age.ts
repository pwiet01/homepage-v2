export const BIRTHDAY = new Date(2001, 3, 18);

export function ageOn(date: Date): number {
  let age = date.getFullYear() - BIRTHDAY.getFullYear();
  if (date < new Date(date.getFullYear(), BIRTHDAY.getMonth(), BIRTHDAY.getDate())) age--;
  return age;
}
