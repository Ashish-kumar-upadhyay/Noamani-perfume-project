import { useState, useEffect } from 'react';

export const useCountry = () => {
  const [country, setCountry] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedCountry') || 'IN';
    }
    return 'IN';
  });

  useEffect(() => {
    const updateCountry = () => {
      const newCountry = localStorage.getItem('selectedCountry') || 'IN';
      setCountry(newCountry);
    };

    window.addEventListener('storage', updateCountry);
    window.addEventListener('countryChange', updateCountry);

    return () => {
      window.removeEventListener('storage', updateCountry);
      window.removeEventListener('countryChange', updateCountry);
    };
  }, []);

  const updateCountry = (newCountry: string) => {
    localStorage.setItem('selectedCountry', newCountry);
    setCountry(newCountry);
    window.dispatchEvent(new Event('countryChange'));
  };

  return { country, setCountry: updateCountry };
}; 