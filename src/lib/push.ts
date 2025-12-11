'use client';
import { toast } from '@/hooks/use-toast';
import { NEXT_PUBLIC_VAPID_PUBLIC_KEY } from './constants';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeToPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push messaging is not supported');
    return null;
  }
  
  try {
    const swRegistration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', swRegistration);
    
    let subscription = await swRegistration.pushManager.getSubscription();
    
    if (subscription === null) {
      console.log('No subscription found, checking permission state...');
      
      if (Notification.permission === 'denied') {
        console.warn('Notification permission was denied.');
        toast({
          variant: "destructive",
          title: "Notifications Blocked",
          description: "Please enable notification permissions in your browser settings to receive updates."
        });
        return null;
      }

      console.log('Requesting notification permission...');
      const permission = await window.Notification.requestPermission();

      if (permission !== 'granted') {
        console.log('Permission not granted for Notification');
        return null;
      }
      
      console.log('Permission granted, creating new subscription...');
      const applicationServerKey = urlBase64ToUint8Array(NEXT_PUBLIC_VAPID_PUBLIC_KEY);
      subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      console.log('New subscription created:', subscription);

      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch('http://127.0.0.1:8000/api/save-subscription/', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        console.log('Subscription sent to server.');
        toast({
          title: "Notifications Enabled!",
          description: "You will now receive updates via push notifications."
        });
      } else {
        console.warn('Access token not found. Subscription not sent to server.');
      }

    } else {
        console.log('Existing subscription found:', subscription);
    }
    
    return subscription;

  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
}
