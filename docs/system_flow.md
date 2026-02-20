# System Flow: API Go! - Authentication & Landing Page

## ภาพรวมระบบ (System Overview)
ระบบจะทำการตรวจสอบสถานะการเข้าสู่ระบบของผู้ใช้งานเมื่อเปิดเข้าสู่แอปพลิเคชัน 
- หากยังไม่ได้เข้าสู่ระบบ จะแสดงหน้า Landing Page (แนว Futuristic) มีปุ่ม Call To Action (CTA) ให้เริ่มต้นใช้งานฟรี (Login ด้วย Google ผ่าน Firebase)
- หากเข้าสู่ระบบสำเร็จแล้ว จะข้ามไปแสดงหน้า Dashboard (หน้า API Testing หลัก)

## ตัวแทนการทำงาน (User Flow)
1. **เข้าสู่หน้าเว็บ** (URL: `/`)
2. **ระบบตรวจสอบสถานะ** (ผ่าน Firebase `onAuthStateChanged`)
3. **กรณีที่ยังไม่ได้ล็อกอิน (Guest):**
   - แสดงหน้า `<LandingPage />` ประกอบไปด้วย Hero Section, Features และ Footer
   - ผู้ใช้งานคลิกปุ่ม "Start for Free"
   - ระบบเรียกใช้ Firebase Popup Login ด้วยบัญชี Google
   - เมื่อล็อกอินผ่าน ระบบจะแสดง State สำหรับผู้ใช้และอัปเดตหน้าจอโดยอัตโนมัติเป็นหน้า Dashboard
4. **กรณีที่ล็อกอินแล้ว (Authenticated User):**
   - แสดงหน้า Main Application (ประกอบด้วย Sidebar, Request Composer, Response Viewer)
   - หน้า Header จะมีรูปโปรไฟล์และปุ่ม Log out บริเวณมุมบนขวา
   - หากคลิก Log out ระบบจะล้างค่า Session แล้วกลับมาหน้า Landing Page
5. **การแชร์ Collection (Sharing Flow):**
   - ผู้ใช้ (Owner) สามารถแชร์ Folder หรือ Collection ให้ผู้อื่นผ่าน Email
   - ระบบบันทึกการแชร์ในตาราง `CollectionShare`
   - ผู้ที่ได้รับแชร์ (Sharee) จะเห็น Collection นั้นใน Sidebar ของตนเอง
   - ระบบใช้ `Recursive CTE` ในการดึงข้อมูลทั้่ง Folder และ Requests ทั้งหมดภายใต้รายการที่ถูกแชร์
6. **Mockup API**: New feature using `MockEndpoint` and `MockResponse` models. Resolver at `/api/mock/[...path]` handles requests based on user ownership and path/method matching.

## สถาปัตยกรรมทาง UI (UI Architecture)
- **src/components/landing/**: จะโฟกัสแค่รหัสหน้า Landing ประกอบย่อยเป็น `<Hero />`, `<Features />` พร้อม Mockup ข้อมูล, `<Footer />`
- **src/context/AuthContext.tsx**: รับหน้าที่ดูแล State ตรงกลางของระบบ User Management
- **src/utils/firebase.ts**: ห่อหุ้มคลาสและการตั้งค่า Firebase (Clean Architecture)
