import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTawkTo } from '../hooks/useTawkTo';
import { useAuth } from '../contexts/AuthContext';

interface TawkToWidgetProps {
  hideOnRoutes?: string[];
}

export const TawkToWidget = ({ hideOnRoutes = [] }: TawkToWidgetProps) => {
  const location = useLocation();
  const { user, profile } = useAuth();
  const { hideWidget, showWidget, setAttributes } = useTawkTo({
    onLoad: () => {
      console.log('Tawk.to widget loaded successfully');
    },
  });

  useEffect(() => {
    const shouldHide = hideOnRoutes.some(route => location.pathname.startsWith(route));

    if (shouldHide) {
      hideWidget();
    } else {
      showWidget();
    }
  }, [location.pathname, hideOnRoutes, hideWidget, showWidget]);

  useEffect(() => {
    if (user && profile) {
      const attributes: Record<string, string> = {
        name: profile.full_name || 'Unknown User',
        email: user.email || '',
        userId: user.id,
      };

      if (profile.role) {
        attributes.role = profile.role;
      }

      if (profile.company_name) {
        attributes.company = profile.company_name;
      }

      setAttributes(attributes);
    }
  }, [user, profile, setAttributes]);

  return null;
};
