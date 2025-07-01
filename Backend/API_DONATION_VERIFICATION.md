# API Dokumentasi - Fitur Verifikasi Donasi

## Overview
Fitur ini memungkinkan user untuk upload bukti transaksi saat melakukan donasi, dan admin dapat melakukan verifikasi donasi tersebut.

## Endpoints

### 1. Create Donation dengan Upload Bukti Transaksi
**POST** `/donations`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
- `campaignId` (string, required): ID campaign
- `amount` (number, required): Jumlah donasi
- `isAnonymous` (boolean, optional): Apakah donasi anonim
- `bukti_transaksi` (file, required): File bukti transaksi (gambar, max 5MB)

**Response Success (201):**
```json
{
  "message": "Donasi berhasil dibuat dan menunggu verifikasi admin",
  "donation": {
    "donation_id": "DON001",
    "user_id": "USR001",
    "campaign_id": "CAM001",
    "amount": 100000,
    "is_anonymous": false,
    "status": "pending",
    "bukti_transaksi": "uploads/bukti-transaksi/bukti-1234567890.jpg",
    "createdAt": "2025-06-29T12:00:00.000Z",
    "updatedAt": "2025-06-29T12:00:00.000Z"
  }
}
```

### 2. Get Pending Donations (Admin Only)
**GET** `/admin/donations/pending`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response Success (200):**
```json
[
  {
    "donation_id": "DON001",
    "nama_donatur": "John Doe",
    "email_donatur": "john@example.com",
    "campaign_title": "Bantu Korban Bencana",
    "campaign_id": "CAM001",
    "jumlah": 100000,
    "bukti_transaksi": "uploads/bukti-transaksi/bukti-1234567890.jpg",
    "waktu_donasi": "2025-06-29T12:00:00.000Z",
    "status": "pending"
  }
]
```

### 3. Verify Donation (Admin Only)
**PATCH** `/admin/donations/:donationId/verify`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body:**
```json
{
  "status": "success", // atau "failed"
  "adminNotes": "Bukti transaksi valid, donasi diterima"
}
```

**Response Success (200):**
```json
{
  "message": "Donasi berhasil diverifikasi",
  "donation": {
    "donation_id": "DON001",
    "status": "success",
    "admin_notes": "Bukti transaksi valid, donasi diterima",
    "verified_at": "2025-06-29T12:30:00.000Z"
  }
}
```

### 4. Access Bukti Transaksi File
**GET** `/uploads/bukti-transaksi/:filename`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** File gambar bukti transaksi

## Flow Verifikasi Donasi

1. **User melakukan donasi:**
   - Upload bukti transaksi (wajib)
   - Status donasi otomatis menjadi "pending"
   - currentAmount campaign belum diupdate

2. **Admin melihat donasi pending:**
   - Akses endpoint `/admin/donations/pending`
   - Melihat daftar donasi yang perlu diverifikasi
   - Dapat melihat bukti transaksi

3. **Admin verifikasi donasi:**
   - Jika verifikasi berhasil: status menjadi "success", currentAmount campaign diupdate
   - Jika verifikasi gagal: status menjadi "failed", currentAmount campaign tidak diupdate

## Database Changes

### Tabel Donations - Kolom Baru:
- `bukti_transaksi` (STRING): Path file bukti transaksi
- `admin_notes` (TEXT): Catatan admin saat verifikasi
- `verified_at` (DATETIME): Waktu verifikasi oleh admin

## File Storage
- File bukti transaksi disimpan di folder `uploads/bukti-transaksi/`
- Nama file: `bukti-{timestamp}-{random}.{extension}`
- Format yang diizinkan: gambar (jpg, png, gif, dll)
- Maksimal ukuran: 5MB

## Error Handling
- File tidak diupload: "Bukti transaksi wajib diupload"
- File bukan gambar: "Hanya file gambar yang diizinkan!"
- File terlalu besar: "Ukuran file terlalu besar. Maksimal 5MB"
- Donasi sudah diverifikasi: "Donasi sudah diverifikasi"

## Admin Dashboard Stats

### GET /admin/dashboard/stats

Endpoint untuk mendapatkan statistik dashboard admin.

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "totalFundraisers": 12,
    "activeCampaigns": 5,
    "completedCampaigns": 8,
    "totalDonations": 150,
    "totalDonationAmount": 25000000
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**Response Error (403):**
```json
{
  "success": false,
  "message": "Forbidden - Admin access required"
}
```

**Response Error (500):**
```json
{
  "success": false,
  "message": "Terjadi kesalahan saat mengambil statistik dashboard",
  "error": "Error details"
}
```

**Deskripsi Data:**
- `totalFundraisers`: Jumlah total user dengan role 'fundraiser'
- `activeCampaigns`: Jumlah campaign dengan status 'active'
- `completedCampaigns`: Jumlah campaign dengan status 'completed'
- `totalDonations`: Jumlah total donasi yang telah dibuat
- `totalDonationAmount`: Total nominal donasi dalam rupiah 