import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

function initFirebaseAdmin() {
  if (!getApps().length) {
    try {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
        : undefined;

      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
      console.log("Firebase Admin initialized successfully.");
    } catch (error) {
      console.error('Firebase Admin initialization error', error);
    }
  }
}

export async function uploadBase64ToFirebase(base64Image: string, fileName: string, folder: string = 'generated-images') {
  initFirebaseAdmin();
  try {
    const bucket = getStorage().bucket();
    const filePath = `${folder}/${fileName}`;
    const file = bucket.file(filePath);

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    await file.save(buffer, {
      metadata: {
        contentType: 'image/png',
      },
    });

    const encodedFilePath = encodeURIComponent(filePath);
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedFilePath}?alt=media`;

    return publicUrl;
  } catch (error) {
    console.error("Gagal mengupload ke Firebase Storage:", error);
    throw new Error("Gagal mengupload gambar");
  }
}
