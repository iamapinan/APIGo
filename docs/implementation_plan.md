# Implementation Plan - Authentication & Landing Page

## ข้อกำหนดระบบและหลักการ
- **ภาษา**: ภาษาไทย
- **ไฟล์เอกสาร**: เก็บ Implementation Plan, System Flow ไว้ในโฟลเดอร์โปรเจกต์ (docs)
- **สถาปัตยกรรม**: เน้นแยกสัดส่วน (Clean Architecture)
- **ข้อมูลจำลอง**: ใช้ Mockup data เพื่อแสดงในส่วนของฟีเจอร์ในหน้า Landing Page
- **ภาพลักษณ์ของงาน**: ออกแบบเป็น Futuristic, ไม่มีอีโมจิ, ใส่เครดิตท้ายเว็บให้บริษัท

## แผนการพัฒนา (Execution Steps)

### 1. ติดตั้งและตั้งค่า Firebase (Authentication Layer)
- เพิ่มแพ็กเกจ `firebase` 
- สร้างไฟล์ `src/utils/firebase.ts` ติดตั้ง Configuration จาก `.env.local` และประกาศ Service `auth` และ `googleProvider`
- สร้างไฟล์ `src/context/AuthContext.tsx` สำหรับกระจาย State (User, Loading, signInWithGoogle, signOut) ครอบคลุมทั้งโปรเจกต์ (ทำหน้าที่เป็น Controller/State Manager)

### 2. สร้างหน้า Landing Page (View Layer)
- สร้างโฟลเดอร์ `src/components/landing` เพื่อแยกเอกเทศ
- สร้าง `<LandingPage />` เป็นไฟล์รวมและคุมลูกเล่นพื้นหลังแบบ Futuristic (ใช้เฉดสีนีออน ดำ-ม่วง-น้ำเงิน และแอนิเมชัน)
- สร้าง `<Hero />` แสดงคำเชิญชวนและปุ่ม "Start for Free" เพื่อทริกเกอร์ Google Login
- สร้าง `<Features />` โดยทำ Data วัตถุ Mockup ของฟีเจอร์โปรโมต แล้ววนลูป (Map) ด้วยดีไซน์การ์ด
- สร้าง `<Footer />` มีเครื่องหมายลิขสิทธิ์บริษัท Gracer Corp Co.,Ltd.

### 3. การผสานระบบเข้าด้วยกัน (Integration)
- อิมพอร์ต `AuthProvider` มาครอบใน `src/app/layout.tsx`
- แก้ไขลอจิกชั่วคราวใน `src/app/page.tsx`:
  - เรียกใช้ `useAuth()` เพื่อเช็ค state ปัจจุบัน
  - `if (loading)` -> แสดงวงแหวนโหลดแนวอนาคต
  - `if (!user)` -> return `<LandingPage />` คืนกลับไป
  - ถ้าระบบพร้อม -> แสดงแอปเดิม และใส่ปุ่ม Logout ข้างๆ การเลือก Environment 

## ข้อมูลที่ต้องการจากผู้ใช้งาน (Review Needed)
เพื่อให้การทำงานเป็นไปตามต้องการ หากแผนงานนี้ครอบคลุมครบถ้วน ผมจะเริ่มลงมือทำงาน กรุณากดดำเนินการต่อไปได้เลย หรือให้ความเห็นถ้ามีส่วนที่ต้องการปรับเปลี่ยน 
(คุณสามารถเตรียมค่า Firebase config ไว้ใน `.env.local` ภายหลังได้ ผมจะนำร่างโค้ดไปรับตัวแปรระบบไว้ให้)
