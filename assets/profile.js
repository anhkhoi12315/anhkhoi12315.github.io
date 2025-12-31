// ✅ CHỈ CẦN SỬA FILE NÀY LÀ XONG (đổi thông tin cá nhân)
// Sau khi sửa: refresh trang (Ctrl+R)
window.PROFILE = {
  name: "Nguyễn Anh Khôi",
  birthYear: 2004,
  school: "Đại học HUTECH",

  major: "Công Nghệ Thông Tin",
  className: "",
  location: "Thành phố Hồ Chí Minh",
  email: "anhkhoi12315@gmail.com",
  phone: "0369604155",
  social: "https://www.facebook.com/khoi.12315/",

  tagline: "Sinh viên • Cầu tiến • Thích học hỏi",
  motto: "Mỗi ngày tiến một chút.",

  // Phần giới thiệu kiểu “bài hoàn chỉnh” (trang about.html)
  introBio:
    "Mình là một Sinh viên năm 4 ngành Công Nghệ Thông Tin với đam mê xây dựng các ứng dụng di động thực tế. " +
    "Mình sở hữu tư duy logic tốt, khả năng tự học bền bỉ và sự kỷ luật cao trong công việc.",
  introGoal:
    "Trong 1-3 năm tới, mình hướng tới vị trí Senior Flutter Developer, làm chủ kiến thức về kiến trúc ứng dụng " +
    "và tối ưu hoá hiệu năng.",
  introStrength:
    "Tự học tốt, chăm chỉ và có kinh nghiệm thực tế về vận hành sản phẩm. (TODO: chỉnh lại cho đúng bạn)",

  // Thanh kỹ năng (bên phải trang giới thiệu) - chỉnh % theo bạn
  skillBars: [
    { label: "HTML, CSS & JavaScript", value: 88 },
    { label: "Java & OOP", value: 82 },
    { label: "Firebase & Firestore", value: 78 },
    { label: "Git, GitHub, Figma", value: 72 }
  ],

  hobbies: ["Nghe nhạc", "Thể thao", "Tự học"],
  skills: ["Làm việc nhóm", "Thuyết trình", "Tin học văn phòng", "Tư duy logic", "Tự học"],

  // Chứng chỉ (có thể thêm/bớt)
  certificates: [
    { 
      title: "Networking Basics",
      issuer: "Information Technology College, Ho Chi Minh City (ITC)",
      date: "Dec 31, 2025",
      status: "Đã hoàn thành",
      skills: "Kiến thức cơ bản về mạng máy tính (networking fundamentals)",
      hours: 22,
      instructor: "Tan Dung Vo",
      proof: "assets/cert-networking-basics.png",
      verifyUrl: "https://www.credly.com/badges/002f0986-34b6-4609-a70f-b8f6d7d857b9"
    }
  ]
};
