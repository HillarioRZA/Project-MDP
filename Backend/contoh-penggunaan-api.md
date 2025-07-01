# Contoh Penggunaan API Verifikasi Donasi

## 1. User Login untuk Mendapatkan Token
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## 2. User Membuat Donasi dengan Upload Bukti Transaksi
```bash
curl -X POST http://localhost:3000/donations \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -F "campaignId=CAM001" \
  -F "amount=100000" \
  -F "isAnonymous=false" \
  -F "bukti_transaksi=@/path/to/bukti-transaksi.jpg"
```

## 3. Admin Login untuk Mendapatkan Token
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

## 4. Admin Melihat Donasi Pending
```bash
curl -X GET http://localhost:3000/admin/donations/pending \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 5. Admin Verifikasi Donasi (Success)
```bash
curl -X PATCH http://localhost:3000/admin/donations/DON001/verify \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "success",
    "adminNotes": "Bukti transaksi valid, donasi diterima"
  }'
```

## 6. Admin Verifikasi Donasi (Failed)
```bash
curl -X PATCH http://localhost:3000/admin/donations/DON001/verify \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "failed",
    "adminNotes": "Bukti transaksi tidak valid atau tidak sesuai"
  }'
```

## 7. Mengakses File Bukti Transaksi
```bash
curl -X GET http://localhost:3000/uploads/bukti-transaksi/bukti-1234567890.jpg \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output bukti-transaksi.jpg
```

## Catatan Penting:
1. Ganti `YOUR_USER_TOKEN` dan `YOUR_ADMIN_TOKEN` dengan token yang didapat dari login
2. Ganti `/path/to/bukti-transaksi.jpg` dengan path file bukti transaksi yang akan diupload
3. Ganti `DON001` dengan ID donasi yang akan diverifikasi
4. Pastikan server berjalan di `localhost:3000`
5. Pastikan sudah menginstall package `multer` dengan menjalankan `npm install multer`
6. Jalankan migration terlebih dahulu dengan `node run-migrations.js`

## Create Campaign dengan Upload Gambar

### POST /campaigns

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
```
title: "Judul Campaign"
description: "Deskripsi campaign"
targetAmount: 10000000
image: [file gambar]
```

**Contoh penggunaan dengan curl:**
```bash
curl -X POST http://localhost:3000/campaigns \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "title=Judul Campaign" \
  -F "description=Deskripsi campaign" \
  -F "targetAmount=10000000" \
  -F "image=@/path/to/your/image.jpg"
```

**Contoh penggunaan dengan Postman:**
1. Method: POST
2. URL: `http://localhost:3000/campaigns`
3. Headers: `Authorization: Bearer YOUR_TOKEN_HERE`
4. Body: Form-data
   - Key: `title`, Value: `Judul Campaign`
   - Key: `description`, Value: `Deskripsi campaign`
   - Key: `targetAmount`, Value: `10000000`
   - Key: `image`, Type: File, Value: pilih file gambar

**Response Success (201):**
```json
{
  "campaign_id": "US001",
  "user_id": "user123",
  "title": "Judul Campaign",
  "description": "Deskripsi campaign",
  "image_url": "uploads/campaign-images/campaign-1234567890-123456789.jpg",
  "target_amount": 10000000,
  "current_amount": 0,
  "status": "pending",
  "createdAt": "2025-06-30T02:30:00.000Z",
  "updatedAt": "2025-06-30T02:30:00.000Z"
}
```

**Response Error (400):**
```json
{
  "message": "Gambar campaign wajib diupload"
}
```

**Response Error (400):**
```json
{
  "message": "Hanya file gambar yang diizinkan!"
}
```

**Response Error (400):**
```json
{
  "message": "Ukuran file terlalu besar. Maksimal 5MB"
}
```

## Mengakses Gambar Campaign

### GET /uploads/campaign-images/:filename

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** File gambar langsung ditampilkan

**Contoh URL:**
```
http://localhost:3000/uploads/campaign-images/campaign-1234567890-123456789.jpg
```

**Catatan:**
- Format gambar yang didukung: JPG, PNG, GIF, dll
- Maksimal ukuran file: 5MB
- Gambar akan disimpan di folder `uploads/campaign-images/`
- Nama file akan digenerate otomatis dengan format: `campaign-{timestamp}-{random}.{extension}` 