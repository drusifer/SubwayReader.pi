import { UserProfile } from '../types';

declare const google: any;

export const initializeGoogleAuth = (clientId: string, callback: (response: any) => void) => {
  if (typeof google === 'undefined') {
    console.warn('Google Identity Services script not loaded');
    return;
  }
  
  google.accounts.id.initialize({
    client_id: clientId,
    callback: callback
  });
};

export const renderGoogleButton = (elementId: string) => {
   if (typeof google === 'undefined') return;
   
   const parent = document.getElementById(elementId);
   if (parent) {
     google.accounts.id.renderButton(parent, { 
       theme: "outline", 
       size: "large",
       width: "100%" // Responsive width
     });
   }
}

// Simple JWT decode without external library dependency for lightweight PWA
export const decodeJwt = (token: string): UserProfile | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    return {
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    };
  } catch (e) {
    console.error("Failed to decode JWT", e);
    return null;
  }
}