import { useEffect, useRef } from 'react';

function KitForm({ formId, className }) {
  const containerRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || scriptLoadedRef.current) return;

    const script = document.createElement('script');
    script.src = `https://leafjessicaroy.kit.com/${formId}.js`;
    script.async = true;
    script.setAttribute('data-uid', formId);

    container.appendChild(script);
    scriptLoadedRef.current = true;

    return () => {
      if (container && script.parentNode === container) {
        container.removeChild(script);
      }
      scriptLoadedRef.current = false;
    };
  }, [formId]);

  return <div ref={containerRef} className={className} />;
}

export default KitForm;
