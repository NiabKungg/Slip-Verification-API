# SlipVerify API 🧾✨

![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![Flask](https://img.shields.io/badge/Flask-Web%20Framework-lightgrey)
![Tesseract](https://img.shields.io/badge/Tesseract-OCR-green)

[**🇹🇭 อ่านภาษาไทย (#ภาษาไทย)**](#ภาษาไทย) | [**🇬🇧 Read in English (#english)**](#english)

---

<a id="english"></a>
## 🇬🇧 English

**SlipVerify** is an intelligent web application and API designed to extract and verify data from Thai bank transfer slips using Optical Character Recognition (OCR). It features a modern, glassmorphism-inspired dashboard for easy manual testing, a batch processing dashboard, and a robust Python backend.

### New Features 🚀
- **Batch Processing & Summary Dashboard**: Upload multiple slips at once to generate a comprehensive report.
- **Income/Expense Classification**: Intelligently classifies each slip as Income or Expense based on Thai transaction keywords and OCR heuristics. 
- **Account Name Matching**: Set your own "Account Name" inside the Batch Summary page to accurately classify transaction directions.
- **Receiver Extraction**: Now extracts Receiver Name in addition to the Sender Name.

### Core Features
- **OCR Data Extraction**: Automatically extracts the Transfer Amount, Date & Time, Reference Number, Sender, and Receiver Names from bank slips.
- **Multi-Bank Support**: Optimized Regex patterns to handle various slip formats from major Thai banks (e.g., KBank, SCB, Krungthai, Bangkok Bank).
- **Flexible Language Parsing**: Supports OCR text in both Thai and English.
- **Modern UI**: A premium, responsive glassmorphism Dashboard with file drag-and-drop.
- **RESTful API**: Ready to be integrated into other applications via standard JSON API endpoints.

### Technologies Used
- **Backend**: Python, Flask, OpenCV (`cv2`)
- **OCR Engine**: Tesseract OCR (`pytesseract`)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript

### Prerequisites
1. **Python 3.8+**
2. **Tesseract OCR**: You must install Tesseract OCR on your system.
   - For Windows: Download from [UB-Mannheim/tesseract](https://github.com/UB-Mannheim/tesseract/wiki) and ensure the executable path matches in `verify_slip.py` (`pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'`).
   - You must have the Thai (`tha`) and English (`eng`) language training data installed.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NiabKungg/Slip-Verification-API.git
   cd Slip-Verification-API
   ```

2. **Install dependencies:**
   It's recommended to use a virtual environment.
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask application:**
   ```bash
   python app.py
   ```

4. **Access the Dashboard:**
   - Single Slip Dashboard: `http://127.0.0.1:5000`
   - Batch Summary Dashboard: `http://127.0.0.1:5000/summary`

### API Usage
Endpoint: `POST /api/verify`

**Request:**
Send a `multipart/form-data` request with one or multiple image files under the `slip_images` key.

**Response (JSON):**
Returns a JSON object with a `results` array containing data for each slip.
```json
{
  "results": [
    {
      "filename": "slip.jpg",
      "status": "success",
      "data": {
        "amount": "150.00",
        "date_time": "27 ก.พ. 67 14:30 น.",
        "reference_no": "01234567890ABCDEF",
        "sender": "นาย ทดสอบ ระบบ",
        "receiver": "นาย รับเงิน",
        "type": "Income"
      },
      "raw_text": "...raw output from tesseract..."
    }
  ]
}
```

---

<a id="ภาษาไทย"></a>
## 🇹🇭 ภาษาไทย

**SlipVerify** เป็นเว็บแอปพลิเคชันและ API อัจฉริยะที่ออกแบบมาเพื่อดึงข้อมูลและตรวจสอบสลิปโอนเงินของธนาคารในประเทศไทยโดยใช้เทคโนโลยี OCR (Optical Character Recognition) มาพร้อมกับหน้าแดชบอร์ดทดสอบสไตล์ Glassmorphism ที่ทันสมัย ระบบการจัดกลุ่มสลิปหลายใบ และระบบหลังบ้านที่พัฒนาด้วย Python

### ฟีเจอร์ใหม่ล่าสุด 🚀
- **ระบบตรวจสอบแบบกลุ่ม (Batch Processing)**: อัปโหลดสลิปหลายใบพร้อมกันเพื่อคำนวณและสรุปยอด
- **จำแนกรายรับ/รายจ่าย (Income/Expense Classification)**: จำแนกสลิปว่าเป็นรายรับหรือรายจ่ายโดยอัตโนมัติจากชุดข้อความ (Keywords)
- **ตรวจสอบจากชื่อบัญชีส่วนตัว (Account Name Matching)**: สามารถตั้งชื่อบัญชีตัวเองในหน้า Batch Summary เพื่อเพิ่มความแม่นยำในการคัดแยกรับ/จ่าย
- **ดึงชื่อผู้รับเงิน (Receiver Extraction)**: ตอนนี้ระบบสามารถดึงชื่อผู้รับการโอนเงิน (Receiver) ได้แล้ว

### ฟีเจอร์หลัก
- **ดึงข้อมูลด้วย OCR**: ดึงข้อมูลยอดเงิน (Amount), วันที่และเวลา (Date & Time), เลขที่อ้างอิง (Reference No.), ชื่อผู้โอน (Sender) และชื่อผู้รับ (Receiver) ออกจากสลิปอัตโนมัติ
- **รองรับหลายธนาคาร**: มีการใช้ Regular Expression (Regex) ที่ปรับแต่งมาเพื่อจัดการกับรูปแบบสลิปที่หลากหลาย
- **รองรับทั้งสองภาษา**: สามารถอ่านสลิปและข้อมูลรูปแบบภาษาไทยและภาษาอังกฤษได้
- **UI ทันสมัย**: หน้าแดชบอร์ดระดับพรีเมียม สวยงาม รองรับระบบลากแล้ววางไฟล์ (Drag-and-Drop) ทั้งแบบใบเดียวและหลายใบ
- **RESTful API**: พร้อมสำหรับการนำไปเชื่อมต่อกับแอปพลิเคชันอื่นผ่าน JSON API คืนค่าเป็น Array รองรับหลายไฟล์พร้อมกัน

### เทคโนโลยีที่ใช้
- **Backend (ระบบหลังบ้าน)**: Python, Flask, OpenCV (`cv2`)
- **OCR Engine**: Tesseract OCR (`pytesseract`)
- **Frontend (หน้าบ้าน)**: HTML5, CSS3, Vanilla JavaScript

### สิ่งที่ต้องติดตั้ง (Prerequisites)
1. **Python 3.8+**
2. **Tesseract OCR**: จำเป็นต้องติดตั้ง Tesseract OCR ในเครื่องของคุณ
   - สำหรับ Windows: ดาวน์โหลดจาก [UB-Mannheim/tesseract](https://github.com/UB-Mannheim/tesseract/wiki) และระบุที่อยู่ของโปรแกรมใน `verify_slip.py`
   - ต้องติดตั้งชุดข้อมูลภาษาไทย (`tha`) และภาษาอังกฤษ (`eng`)

### วิธีการติดตั้งและรันโปรแกรม

1. **โคลนโปรเจกต์ (Clone Repo):**
   ```bash
   git clone https://github.com/NiabKungg/Slip-Verification-API.git
   cd Slip-Verification-API
   ```

2. **ติดตั้งไลบรารีที่จำเป็น (Dependencies):**
   ```bash
   pip install -r requirements.txt
   ```

3. **รันแอปพลิเคชัน Flask:**
   ```bash
   python app.py
   ```

4. **เข้าใช้งาน Dashboard:**
   - เช็คสลิปเดี่ยว (Single Scan): `http://127.0.0.1:5000`
   - สรุปยอดสลิปทั้งหมด (Batch Summary): `http://127.0.0.1:5000/summary`

### การเรียกใช้งาน API
Endpoint: `POST /api/verify`

**Request:**
ส่ง Request แบบ `multipart/form-data` โดยแนบไฟล์รูปแบบ Array มากับ Key ที่ชื่อว่า `slip_images` (สามารถส่งได้หลายไฟล์พร้อมกัน)

**Response (JSON):**
ระบบจะคืนค่าเป็น JSON ที่มี Key ชื่อ `results` ซึ่งมีข้อมูลผลสแกนของสลิปทั้งหมด
```json
{
  "results": [
    {
      "filename": "slip.jpg",
      "status": "success",
      "data": {
        "amount": "150.00",
        "date_time": "27 ก.พ. 67 14:30 น.",
        "reference_no": "01234567890ABCDEF",
        "sender": "นาย ทดสอบ ระบบ",
        "receiver": "นาย รับเงิน",
        "type": "Income"
      },
      "raw_text": "...ข้อมูลดิบจาก tesseract..."
    }
  ]
}
```

---

*พัฒนาและต่อยอดเพื่อความสะดวกในการตรวจสอบสลิปโอนเงินอัตโนมัติ 🚀*
