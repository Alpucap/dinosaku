import * as admin from 'firebase-admin';

// Mencegah inisialisasi ulang jika Next.js melakukan hot-reload
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Memastikan karakter \n dibaca sebagai enter/baris baru yang sebenarnya
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    console.log("Firebase Admin initialized successfully.");
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}

export const storage = admin.storage();
export const bucket = storage.bucket();

/**
 * Fungsi pembantu untuk mengunggah gambar base64 ke Firebase Storage
 * @param base64Image String gambar (bisa berawalan data:image/png;base64, atau murni base64)
 * @param fileName Nama file untuk disimpan, misal "story-123.png"
 * @param folder Nama folder di dalam storage (default: "generated-images")
 * @returns URL gambar publik yang bisa diakses langsung
 */
export async function uploadBase64ToFirebase(base64Image: string, fileName: string, folder: string = 'generated-images') {
  try {
    const filePath = `${folder}/${fileName}`;
    const file = bucket.file(filePath);

    // Hapus awalan data URI (data:image/...;base64,) jika ada, karena kita hanya butuh datanya saja
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Simpan file ke Firebase Storage
    await file.save(buffer, {
      metadata: {
        contentType: 'image/png', // Secara default anggap sebagai PNG
      },
    });

    // Menghasilkan URL publik standar format Firebase Storage
    // Agar bisa diakses, pastikan Security Rules di Firebase diset ke "allow read: if true;"
    const encodedFilePath = encodeURIComponent(filePath);
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedFilePath}?alt=media`;

    return publicUrl;
  } catch (error) {
    console.error("Gagal mengupload ke Firebase Storage:", error);
    throw new Error("Gagal mengupload gambar");
  }
}

