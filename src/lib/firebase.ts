/**
 * Firebase Configuration
 *
 * Inicializa Firebase con variables de entorno.
 * Las variables deben tener el prefijo  para que Vite las exponga al cliente.
 */

import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { persistentLocalCache, initializeFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

// Validar que todas las variables de entorno requeridas estén presentes
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Faltan las siguientes variables de entorno:\n${missingVars.join('\n')}\n\n` +
    `Asegúrate de:\n` +
    `1. Crear un archivo .env en la raíz del proyecto\n` +
    `2. Copiar los valores de .env.example\n` +
    `3. Reemplazar con tus credenciales de Firebase Console\n` +
    `4. Reiniciar el servidor de desarrollo (npm run dev)`
  );
}

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Inicializar servicios
const auth: Auth = getAuth(app);

// Inicializar Firestore con persistencia offline habilitada
// Esto permite que la app funcione sin conexión y sincronice cuando vuelva online
const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({}),
});

// Exportar instancias para usar en toda la app
export { app, auth, db };