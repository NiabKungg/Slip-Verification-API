# SlipVerify API 🧾✨

![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![Flask](https://img.shields.io/badge/Flask-Web%20Framework-lightgrey)
![Tesseract](https://img.shields.io/badge/Tesseract-OCR-green)

[**🇹🇭 อ่านภาษาไทย (#ภาษาไทย)**](#ภาษาไทย) | [**🇬🇧 Read in English (#english)**](#english)

---

<a id="english"></a>
## 🇬🇧 English

**SlipVerify** is an intelligent web application and API designed to extract and verify data from Thai bank transfer slips using Optical Character Recognition (OCR). It features a modern, glassmorphism-inspired dashboard for easy manual testing and a robust Python backend.

### Features
- **OCR Data Extraction**: Automatically extracts the Transfer Amount, Date & Time, Reference Number, and Sender Name from bank slips.
- **Multi-Bank Support**: Optimized Regex patterns to handle various slip formats from major Thai banks (e.g., KBank, SCB, Krungthai, Bangkok Bank).
- **Flexible Language Parsing**: Supports OCR text in both Thai and English (including AM/PM time formats and various date formats).
- **Modern UI**: A premium, responsive glassmorphism Dashboard for drag-and-drop slip image testing.
- **RESTful API**: Can be integrated into other applications via standard JSON API endpoints.

### Technologies Used
- **Backend**: Python, Flask, OpenCV (`cv2`)
- **OCR Engine**: Tesseract OCR (`pytesseract`)
- **Frontend**: HTML5, CSS3 (Glassmorphism design), Vanilla JavaScript

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
   Open your browser and navigate to `http://127.0.0.1:5000`.

### API Usage
Endpoint: `POST /api/verify`

**Request:**
Send a `multipart/form-data` request with the image file under the `slip_image` key.

**Response (JSON):**
```json
{
  "success": true,
  "data": {
    "amount": "150.00",
    "date_time": "27 ก.พ. 67 14:30 น.",
    "reference_no": "01234567890ABCDEF",
    "sender": "นาย ทดสอบ ระบบ"
  },
  "raw_text": "...raw output from tesseract..."
}
```

---

<a id="ภาษาไทย"></a>
## 🇹🇭 ภาษาไทย

**SlipVerify** เป็นเว็บแอปพลิเคชันและ API อัจฉริยะที่ออกแบบมาเพื่อดึงข้อมูลและตรวจสอบสลิปโอนเงินของธนาคารในประเทศไทยโดยใช้เทคโนโลยี OCR (Optical Character Recognition) มาพร้อมกับหน้าแดชบอร์ดทดสอบสไตล์ Glassmorphism ที่ทันสมัยและระบบหลังบ้านที่พัฒนาด้วย Python

### ฟีเจอร์หลัก
- **ดึงข้อมูลด้วย OCR**: ดึงข้อมูลยอดเงิน (Amount), วันที่และเวลา (Date & Time), เลขที่อ้างอิง (Reference No.), และชื่อผู้โอน (Sender Name) ออกจากสลิปอัตโนมัติ
- **รองรับหลายธนาคาร**: มีการใช้ Regular Expression (Regex) ที่ปรับแต่งมาเพื่อจัดการกับรูปแบบสลิปที่หลากหลายของธนาคารชั้นนำในไทย (เช่น กสิกรไทย, ไทยพาณิชย์, กรุงไทย, กรุงเทพ)
- **รองรับทั้งสองภาษา**: สามารถอ่านสลิปและข้อมูลรูปแบบภาษาไทยและภาษาอังกฤษได้ (รองรับเวลาแบบ AM/PM และเลขปีทั้ง พ.ศ./ค.ศ.)
- **UI ทันสมัย**: หน้าแดชบอร์ดระดับพรีเมียม สวยงาม ใช้งานง่ายดายด้วยระบบลากแล้ววาง (Drag-and-Drop)
- **RESTful API**: พร้อมสำหรับการนำไปเชื่อมต่อกับแอปพลิเคชันอื่นผ่าน JSON API 

### เทคโนโลยีที่ใช้
- **Backend (ระบบหลังบ้าน)**: Python, Flask, OpenCV (`cv2`)
- **OCR Engine**: Tesseract OCR (`pytesseract`)
- **Frontend (หน้าบ้าน)**: HTML5, CSS3 (การออกแบบสไตล์ Glassmorphism), Vanilla JavaScript

### สิ่งที่ต้องติดตั้ง (Prerequisites)
1. **Python 3.8+**
2. **Tesseract OCR**: จำเป็นต้องติดตั้ง Tesseract OCR ในเครื่องของคุณ
   - สำหรับ Windows: ดาวน์โหลดจาก [UB-Mannheim/tesseract](https://github.com/UB-Mannheim/tesseract/wiki) และตรวจสอบให้แน่ใจว่าได้ระบุที่อยู่ของโปรแกรม (Path) ในไฟล์ `verify_slip.py` ไว้ถูกต้อง (ค่าเริ่มต้น: `C:\Program Files\Tesseract-OCR\tesseract.exe`)
   - ต้องมั่นใจว่าได้ติดตั้งชุดข้อมูลภาษาไทย (`tha`) และภาษาอังกฤษ (`eng`) แล้ว

### วิธีการติดตั้งและรันโปรแกรม

1. **โคลนโปรเจกต์ (Clone Repo):**
   ```bash
   git clone https://github.com/NiabKungg/Slip-Verification-API.git
   cd Slip-Verification-API
   ```

2. **ติดตั้งไลบรารีที่จำเป็น (Dependencies):**
   แนะนำให้อัปเดตและใช้สำหรับรันโปรเจกต์
   ```bash
   pip install -r requirements.txt
   ```

3. **รันแอปพลิเคชัน Flask:**
   ```bash
   python app.py
   ```

4. **เข้าใช้งาน Dashboard:**
   เปิดเว็บเบราว์เซอร์ไปที่ `http://127.0.0.1:5000`

### การเรียกใช้งาน API
Endpoint: `POST /api/verify`

**Request:**
ส่ง Request แบบ `multipart/form-data` โดยแนบไฟล์รูปสลิปมากับ Key ที่ชื่อว่า `slip_image`

**Response (JSON):**
```json
{
  "success": true,
  "data": {
    "amount": "150.00",
    "date_time": "27 ก.พ. 67 14:30 น.",
    "reference_no": "01234567890ABCDEF",
    "sender": "นาย ทดสอบ ระบบ"
  },
  "raw_text": "...ข้อมูลดิบจาก tesseract..."
}
```

---

*พัฒนาและต่อยอดเพื่อความสะดวกในการตรวจสอบสลิปโอนเงินอัตโนมัติ 🚀*
