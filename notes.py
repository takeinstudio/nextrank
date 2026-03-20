
import os
import re
import requests

SUPABASE_URL = "https://xazikmfsmtfvoofjqexd.supabase.co"
SERVICE_ROLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhemlrbWZzbXRmdm9vZmpxZXhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMyNTYxNywiZXhwIjoyMDg4OTAxNjE3fQ.ZDXAC8x0uZVn7IQ-HKfUPlTQDCh8g6pRIyS57OTPbwE"


BASE_FOLDER = "notes"
BUCKET = "notes"
DEFAULT_CLASS = 11
DEFAULT_SUBJECT = "Biology"


def get_title_from_filename(filename):

    base_name = os.path.splitext(filename)[0].lower()

    # Matches kebo101..kebo199 where the last two digits represent chapter number.
    chapter_match = re.fullmatch(r"kebo1(\d{2})", base_name)
    if chapter_match:
        chapter_num = int(chapter_match.group(1))
        return f"Class 11 Biology NCERT Chapter {chapter_num}"

    if base_name == "kebo1ps":
        return "Class 11 Biology NCERT Supplement"

    return base_name.replace("_", " ").title()

def upload_file(local_path, storage_path):

    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{storage_path}"

    with open(local_path, "rb") as f:

        res = requests.post(
            url,
            headers={
                "Authorization": f"Bearer {SERVICE_ROLE}",
                "Content-Type": "application/pdf"
            },
            data=f
        )

    if res.status_code not in [200,201]:
        print("Upload failed:", storage_path)
        print(res.text)

    return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{storage_path}"


def insert_resource(subject, class_num, title, file_url):

    url = f"{SUPABASE_URL}/rest/v1/resources"

    data = {
        "subject": subject,
        "class": class_num,
        "title": title,
        "file_path": file_url
    }

    res = requests.post(
        url,
        headers={
            "apikey": SERVICE_ROLE,
            "Authorization": f"Bearer {SERVICE_ROLE}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        json=data
    )

    if res.status_code not in [200, 201]:
        print("Insert failed:", title)
        print(res.text)
        return False

    return True


if not os.path.isdir(BASE_FOLDER):
    raise FileNotFoundError(f"Missing folder: {BASE_FOLDER}")

for class_folder in sorted(os.listdir(BASE_FOLDER)):
    class_path = os.path.join(BASE_FOLDER, class_folder)
    if not os.path.isdir(class_path):
        continue
    class_num = int(re.sub(r'[^0-9]', '', class_folder))  # Extract class number
    for subject_folder in sorted(os.listdir(class_path)):
        subject_path = os.path.join(class_path, subject_folder)
        if not os.path.isdir(subject_path):
            continue
        pdf_files = sorted([f for f in os.listdir(subject_path) if f.lower().endswith('.pdf')])
        if not pdf_files:
            print(f"No PDF files found in {subject_path}")
            continue
        print(f"Found {len(pdf_files)} PDF files in {subject_path}")
        for idx, file in enumerate(pdf_files, 1):
            local_path = os.path.join(subject_path, file)
            # Auto-generate title: Class {class} {subject} Chapter {idx}
            base_name = os.path.splitext(file)[0]
            if re.search(r'chapter|ch', base_name, re.IGNORECASE):
                title = f"Class {class_num} {subject_folder.title()} {base_name.title()}"
            else:
                title = f"Class {class_num} {subject_folder.title()} Chapter {idx}"
            storage_path = f"{class_folder}/{subject_folder}/{file}"
            print(f"\nUploading: {file} -> {storage_path}")
            public_url = upload_file(local_path, storage_path)
            inserted = insert_resource(
                subject_folder.title(),
                class_num,
                title,
                public_url
            )
            if inserted:
                print("Uploaded and inserted:", title)