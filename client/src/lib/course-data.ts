export const courses = {
  kids: [
    'ربوتيك و برمجة للصغار',
    'تصميم الرسومات المتحركة الثلاثية الابعاد للصغار (3D Animations)',
    'تطوير الالعاب الالكترونية للصغار (Video Games)',
    'تطوير مواقع و تطبيقات الواب',
    'تطوير تطبيقات الهاتف',
    'نادي الشطرنج'
  ],
  adults: [
    'شبكات الإعلام الآلي و الأمن السيبراني + التحضير لشهادة CISCO',
    'الإعلام الآلي المكتبي (Bureautique)',
    'بايثون و ذكاء اصطناعي',
    'أردوينو و برمجة المشاريع الالكترونية',
    'الطباعة الثلاثية الأبعاد'
  ],
  both: [
    'تطوير مواقع و تطبيقات الواب',
    'تطوير تطبيقات الهاتف',
    'مونتاج الفيديوهات (Video Editing)',
    'التصميم الجرافيكي (Graphic Design)',
    'نادي الشطرنج'
  ]
};

export function getAvailableCourses(age: number): string[] {
  if (age < 8) return [];
  
  let availableCourses: string[] = [];
  
  if (age >= 8 && age <= 17) {
    availableCourses = [...courses.kids, ...courses.both];
  } else if (age >= 18) {
    availableCourses = [...courses.adults, ...courses.both];
  }
  
  // Remove duplicates and sort
  return Array.from(new Set(availableCourses)).sort();
}

export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  return Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}
