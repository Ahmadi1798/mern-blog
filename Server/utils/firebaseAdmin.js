import admin from 'firebase-admin';

const privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (!privateKey) {
  throw new Error('FIREBASE_PRIVATE_KEY env variable is not set!');
}

const serviceAccount = {
  type: 'service_account',
  project_id: 'mern-blog-2a6fc',
  private_key_id: '0b762b298dc5399f2b29ae02dcbbbd72f18ec0a9',
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email:
    'firebase-adminsdk-fbsvc@mern-blog-2a6fc.iam.gserviceaccount.com',
  client_id: '105798712120353480043',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mern-blog-2a6fc.iam.gserviceaccount.com',
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
