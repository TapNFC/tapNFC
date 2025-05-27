import { routing } from '@/libs/i18nNavigation';
import { getI18nPath } from './Helpers';

describe('Helpers', () => {
  describe('getI18nPath function', () => {
    it('should not change the path for default language', () => {
      const url = '/random-url';
      const locale = routing.defaultLocale;

      expect(getI18nPath(url, locale)).toBe(url);
    });

    it('should handle the same locale as default', () => {
      const url = '/random-url';
      const locale = 'en';

      expect(getI18nPath(url, locale)).toBe(url);
    });
  });
});
