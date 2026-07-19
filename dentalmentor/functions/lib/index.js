import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
initializeApp();
const db = getFirestore();
export const createClinicAndAssignAdmin = onCall(async (request) => {
    if (!request.auth?.uid) {
        throw new HttpsError('unauthenticated', 'Debes iniciar sesion.');
    }
    const role = request.auth.token.platformRole;
    if (role === 'superAdmin') {
        throw new HttpsError('permission-denied', 'superAdmin no debe registrarse como usuario de clinica.');
    }
    const { name, slug, phone, email, address, district, city, country } = request.data;
    if (!name || !slug || !phone || !email || !address || !district || !city || !country) {
        throw new HttpsError('invalid-argument', 'Faltan campos obligatorios para crear la clinica.');
    }
    const existing = await db.collection('clinics').where('slug', '==', slug).limit(1).get();
    if (!existing.empty) {
        throw new HttpsError('already-exists', 'El slug de la clinica ya existe.');
    }
    const clinicRef = db.collection('clinics').doc();
    const membershipRef = db.collection('clinicUsers').doc(`${clinicRef.id}_${request.auth.uid}`);
    await db.runTransaction(async (tx) => {
        tx.set(clinicRef, {
            name,
            slug,
            logoUrl: '',
            phone,
            email,
            address,
            district,
            city,
            country,
            status: 'active',
            subscriptionPlan: 'trial',
            createdBy: request.auth.uid,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });
        tx.set(membershipRef, {
            clinicId: clinicRef.id,
            userId: request.auth.uid,
            role: 'clinicAdmin',
            status: 'active',
            invitedBy: request.auth.uid,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });
    });
    return { clinicId: clinicRef.id };
});
