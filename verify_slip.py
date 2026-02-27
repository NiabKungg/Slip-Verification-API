import cv2
import pytesseract
import re
import argparse
import sys
import os

# Set tesseract path if it's not in your system PATH
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def preprocess_image(image_path):
    """
    Pre-process the image to improve OCR accuracy.
    """
    # Read the image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not open or find the image: {image_path}")

    # For complex colored backgrounds (like slip themes), simple adaptive thresholding 
    # often creates black smudges and destroys text. 
    # Converting BGR to RGB is usually enough, as Tesseract has excellent built-in binarization.
    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Resize the image to make small text larger and sharper for OCR
    resized_img = cv2.resize(rgb_img, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_CUBIC)

    return resized_img, img

def extract_text(preprocessed_image):
    """
    Extract text from the preprocessed image using Tesseract OCR.
    """
    # Specify the languages: Thai and English
    custom_config = r'-l tha+eng --oem 3 --psm 6'
    
    # Extract text
    text = pytesseract.image_to_string(preprocessed_image, config=custom_config)
    return text

def parse_slip_data(text):
    """
    Use Regular Expressions to extract relevant information from the OCR text.
    """
    data = {
        "amount": None,
        "date_time": None,
        "reference_no": None,
        "sender": None
    }

    # To handle multi-line matching, join text with spaces instead of splitting into lines first
    # Or, adjust the regexes to scan the entire raw text since values are sometimes broken into newlines
    
    # Match Amount: Allows any amount of whitespace, newlines, and non-digit characters (like OCR garbage "he") between label and the number
    # If the label-based matching is failing due to excessive garbage, 
    # capturing the number immediately before "บาท" is an extremely reliable fallback.
    amount_pattern_primary = r"(?:จํานวนเงิน|จำนวนเงิน|ยอดเงิน|ยอดรวม|จำนวน|Amount)\s*[:]?[\s\S]*?(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)"
    
    # Fallback pattern: Find a number followed by random spaces/garbage and then "บาท" or "THB"
    amount_pattern_fallback = r"(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*(?:บาท|THB|baht)"
    
    # Match Date/Time: Extract anything resembling a date after common keywords, or just generally match the pattern in the text
    all_months = r"ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.|มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม|มค|กพ|มีค|เมย|พค|มิย|กค|สค|กย|ตค|พย|ธค|กพ\.|มค\.|nw\.|n\.w\.|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December"
    date_pattern = r"(\d{1,2}\s+(?:/|-|\.|\s*(?:" + all_months + r")\s*)\s+\d{2,4}\s*(?:-|,)?\s*(?:เวลา\s*)?\d{1,2}[:\.]\d{2}\s*(?:น\.|AM|PM|am|pm)?(?:[:\.]\d{2})?)"
    
    # Match Reference number: Look for 10+ alphanumeric chars (must contain digits to avoid catching words like 'Transaction'), optionally after keywords
    ref_pattern = r"(?:เลขที่อ้างอิง|รหัสอ้างอิง|เลขทีรายการ|เลขที่รายการ|Ref|Reference|Transaction\s*[I1l]D|Transaction)\s*[:]?[\s\S]*?([A-Za-z]*\d[A-Za-z0-9]*\d[A-Za-z0-9]{8,})"
    
    # Clean up text (remove empty lines and extra whitespaces)
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    # Join text into a single space-separated string to avoid newline breakage issues that happen in OCR
    single_line_text = " ".join(lines)
    
    # Extract using regex search on the concatenated text string
    match_amount = re.search(amount_pattern_primary, single_line_text, re.IGNORECASE)
    if match_amount:
        data["amount"] = match_amount.group(1)
    else:
        match_amount_fallback = re.search(amount_pattern_fallback, single_line_text, re.IGNORECASE)
        if match_amount_fallback:
            data["amount"] = match_amount_fallback.group(1)

    match_date = re.search(date_pattern, single_line_text)
    if match_date:
        data["date_time"] = match_date.group(1)

    match_ref = re.search(ref_pattern, single_line_text, re.IGNORECASE)
    if match_ref:
        data["reference_no"] = match_ref.group(1)

    # Sender extraction is tricky
    # Look for "นาย", "นาง", "นางสาว" or "น.ส." in the first few lines as a heuristic
    for i, line in enumerate(lines):
        if i >= 10:
            break
        # Heuristic for cases where "จาก" might be on the line (e.g. SCB) or "From" (BBL)
        if ("จาก" in line or "From" in line) and not data["sender"]:
            # If the next word is a name, it's captured on this line. 
            # Often the name is on the same line or next line.
            # We'll just take this line and let UI clean it up, or if it's just "จาก", try next line.
            clean_line = line.replace("จาก", "").replace("From", "").strip()
            if len(clean_line) > 3:
                data["sender"] = line
            elif i + 1 < len(lines):
                 data["sender"] = lines[i+1]
            break
            
        # Heuristic for KBank & Krungthai where sender name might just start with a title
        # Allow some OCR garbage characters before the title, but ensure the title is near the start
        elif not data["sender"]:
            match_sender = re.search(r"(นาย|นาง|นางสาว|น\.ส\.|MR\.|MS\.|MRS\.|Mr\.|Ms\.|Mrs\.)\s*.*", line)
            if match_sender and line.find(match_sender.group(1)) < 10:
                data["sender"] = match_sender.group(0).strip()
                break
    return data

def main():
    parser = argparse.ArgumentParser(description="Slip Verification Tool")
    parser.add_argument("image_path", help="Path to the slip image file")
    args = parser.parse_args()

    if not os.path.exists(args.image_path):
        print(f"Error: File '{args.image_path}' not found.")
        sys.exit(1)

    try:
        print("Pre-processing image...")
        preprocessed_img, original_img = preprocess_image(args.image_path)
        
        # Optional: uncomment to show the preprocessed image for debugging
        # cv2.imshow("Preprocessed", preprocessed_img)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()

        print("Extracting text with OCR...")
        extracted_text = extract_text(preprocessed_img)
        print("\n--- Raw OCR Text ---")
        print(extracted_text)
        print("--------------------\n")

        print("Parsing data...")
        parsed_data = parse_slip_data(extracted_text)
        
        print("\n--- Extracted Information ---")
        for key, value in parsed_data.items():
            print(f"{key.capitalize()}: {value}")
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
