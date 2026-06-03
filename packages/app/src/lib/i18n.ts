import type { Messages } from '@lingui/core';
import { i18n } from '@lingui/core';
import catalog from '@/locales/en/messages.json';

const DEFAULT_LOCALE = 'en';

i18n.load(DEFAULT_LOCALE, catalog.messages as unknown as Messages);
i18n.activate(DEFAULT_LOCALE);

export { i18n };
