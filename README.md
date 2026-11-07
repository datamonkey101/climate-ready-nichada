# Climate Ready Nichada

A free, bilingual (English / Thai) web app that helps people in Nichada Thani prepare for extreme weather: floods, heat, haze and storms. Made by volunteers for the **Nichada Nature Network (NNN)**.

**Live at: https://climateready.app**

[ภาษาไทยอยู่ด้านล่าง](#ภาษาไทย)

---

## How it goes live

This repository is connected to Cloudflare. **When you save (commit) a change here, the website updates by itself within a minute or two.** There's nothing to upload.

If a change breaks something, open the **History** of the file on GitHub and put back the earlier version. Every version is kept.

## What's where

| Folder / file | What it is |
|---|---|
| `app/index.html` | **The whole app**: every screen, all the text in both languages, the styles and the script. This is the file you'll edit. |
| `app/logo.jpg` | The NNN logo. Replace it with a file of the same name to change it. |
| `app/icon*.png` | The icons people see on their phone's home screen. |
| `app/manifest.webmanifest` | The app's name and colour when installed on a phone. |
| `app/sw.js` | Makes the app work offline. You don't need to edit it. |
| `live-readings-worker/` | The small program that fetches ISB's air quality and lightning readings. **It doesn't update from GitHub.** See below. |
| `wrangler.jsonc` | Cloudflare's settings. You shouldn't need to change it. |

## Making a change

1. Open `app/index.html` on GitHub and click the **pencil** icon (Edit).
2. The top of the file is a **guide for editors**. Press **Ctrl+F** (or **Cmd+F** on a Mac) and search for a heading:
   - `SCREEN: ` followed by the screen name, e.g. `SCREEN: READY TO GO`
   - `SETTINGS: NICHADA NUMBERS` for local helpline numbers
   - `SETTINGS: COLOURS` for the app's colours
   - `SETTINGS: SUPPLY CALCULATOR` for how much water and food per person
   - `SETTINGS: AC SIMULATOR` for the air-conditioner power numbers
   - `SEASONS` for the "Right now in Nichada" card
3. Make your change, then click **Commit changes**. Write a short note about what you changed.

### Text in two languages

All visible text comes in pairs, one for each language:

```html
<span lang="en">Go bag</span><span lang="th">กระเป๋าฉุกเฉิน</span>
```

If you change the English, change the Thai next to it too, or ask a Thai speaker to.

## The live readings (ISB)

The "Live in Nichada" panel shows readings from the **International School Bangkok (ISB)** campus monitor, used **with ISB's permission**. Because of how ISB's data is set up, the app gets it through a small Cloudflare Worker called **nichada-live**.

To change the Worker:
1. Edit `live-readings-worker/worker.js` here, so there's a record of the change.
2. In Cloudflare, open **Workers & Pages → nichada-live → Edit code**, paste in the new version, and click **Deploy**.

If the app gets a new web address, add it to `ALLOWED_ORIGINS` near the top of `worker.js`, or the live readings will stop showing there.

If the Worker isn't available, the app automatically shows an estimate from Open-Meteo instead.

## Licence

© 2026 Nichada Nature Network. The app's content and code are shared under **[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)**: you may share and adapt them for **non-commercial** purposes, as long as you credit NNN and share your version under the same licence.

The **Nichada Nature Network name and logo are not covered** by this licence and may not be reused without permission. See [LICENSE.md](LICENSE.md).

---

## ภาษาไทย

**Climate Ready Nichada** คือแอปฟรีสองภาษา (อังกฤษ / ไทย) ที่ช่วยให้ผู้อยู่อาศัยในนิชดาธานีเตรียมพร้อมรับมือสภาพอากาศสุดขั้ว ทั้งน้ำท่วม ความร้อน ฝุ่นควัน และพายุ จัดทำโดยอาสาสมัครของ **Nichada Nature Network (NNN)**

**เว็บไซต์: https://climateready.app**

### การอัปเดตแอป

ที่เก็บโค้ดนี้เชื่อมต่อกับ Cloudflare แล้ว **เมื่อบันทึก (commit) การแก้ไขที่นี่ เว็บไซต์จะอัปเดตเองภายใน 1–2 นาที** ไม่ต้องอัปโหลดไฟล์ใด ๆ

หากแก้ไขแล้วเกิดปัญหา เปิด **History** ของไฟล์นั้นบน GitHub แล้วนำเวอร์ชันก่อนหน้ากลับมาได้ ทุกเวอร์ชันถูกเก็บไว้

### วิธีแก้ไข

1. เปิดไฟล์ `app/index.html` บน GitHub แล้วกดไอคอน **ดินสอ** (Edit)
2. ส่วนบนสุดของไฟล์เป็น **คู่มือสำหรับผู้แก้ไข** กด **Ctrl+F** (หรือ **Cmd+F** บน Mac) แล้วค้นหาหัวข้อ เช่น `SCREEN: READY TO GO` หรือ `SETTINGS: NICHADA NUMBERS` (เบอร์โทรนิชดา)
3. แก้ไข แล้วกด **Commit changes** พร้อมเขียนสั้น ๆ ว่าแก้อะไร

ข้อความทุกส่วนมีสองภาษาคู่กัน:

```html
<span lang="en">Go bag</span><span lang="th">กระเป๋าฉุกเฉิน</span>
```

หากแก้ข้อความภาษาอังกฤษ โปรดแก้ภาษาไทยที่อยู่ข้างกันด้วย

### ข้อมูลสด (ISB)

ค่าคุณภาพอากาศและฟ้าผ่าในแอปมาจากเครื่องวัดของ **โรงเรียนนานาชาติกรุงเทพ (ISB)** โดย **ได้รับอนุญาตจาก ISB** ผ่าน Cloudflare Worker ชื่อ **nichada-live** ซึ่ง **ไม่ได้อัปเดตอัตโนมัติจาก GitHub** หากต้องการแก้ไข ให้แก้ไฟล์ `live-readings-worker/worker.js` ที่นี่ แล้วนำไปวางใน Cloudflare (**Workers & Pages → nichada-live → Edit code → Deploy**)

### สัญญาอนุญาต

© 2569 Nichada Nature Network เนื้อหาและโค้ดเผยแพร่ภายใต้ **[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.th)** ใช้และดัดแปลงได้เพื่อ **วัตถุประสงค์ที่ไม่ใช่เชิงพาณิชย์** โดยต้องให้เครดิต NNN และเผยแพร่ภายใต้สัญญาอนุญาตเดียวกัน **ชื่อและโลโก้ของ Nichada Nature Network ไม่อยู่ภายใต้สัญญาอนุญาตนี้** และห้ามนำไปใช้โดยไม่ได้รับอนุญาต
