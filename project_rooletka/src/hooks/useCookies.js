import { useState, useEffect } from 'react';

export const useCookies = () => {
  const [cookiesEnabled, setCookiesEnabled] = useState(false);

  useEffect(() => {
    const cookiesConsent = localStorage.getItem('cookie-consent');
    if (cookiesConsent === 'accepted') {
      setCookiesEnabled(true);
    }
  }, []);

  const enableCookies = () => {
    setCookiesEnabled(true);
    localStorage.setItem('cookie-consent', 'accepted');
  };

  const disableCookies = () => {
    setCookiesEnabled(false);
    localStorage.setItem('cookie-consent', 'rejected');
  };

  return {
    cookiesEnabled,
    enableCookies,
    disableCookies
  };
};

export const useCursorCookies = (initialCursor = 'default') => {
  const [cursorType, setCursorType] = useState(initialCursor);

  useEffect(() => {
    const savedCursor = localStorage.getItem('cursor-type');
    if (savedCursor) {
      setCursorType(savedCursor);
    }
  }, []);

  const setCursor = (cursor) => {
    setCursorType(cursor);
    localStorage.setItem('cursor-type', cursor);
  };

  return [cursorType, setCursor];
};