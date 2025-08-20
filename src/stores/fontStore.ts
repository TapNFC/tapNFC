import { create } from 'zustand';

export type Font = {
  id: string;
  name: string;
  family: string;
  file: string; // Path to font file
  category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
};

type FontStore = {
  fonts: Font[];
  selectedFont: string;
  setSelectedFont: (fontId: string) => void;
  addFont: (font: Font) => void;
  removeFont: (fontId: string) => void;
  getFontById: (fontId: string) => Font | undefined;
  getFontsByCategory: (category: Font['category']) => Font[];
};

// Default fonts that match the current FONT_FAMILIES in TextToolbar
const defaultFonts: Font[] = [
  // System fonts (web-safe)
  {
    id: 'arial',
    name: 'Arial',
    family: 'Arial, sans-serif',
    file: '/fonts/arial.ttf',
    category: 'sans-serif',
  },
  {
    id: 'georgia',
    name: 'Georgia',
    family: 'Georgia, serif',
    file: '/fonts/georgia.ttf',
    category: 'serif',
  },
  {
    id: 'times-new-roman',
    name: 'Times New Roman',
    family: 'Times New Roman, serif',
    file: '/fonts/times-new-roman.ttf',
    category: 'serif',
  },
  {
    id: 'courier-new',
    name: 'Courier New',
    family: 'Courier New, monospace',
    file: '/fonts/courier-new.ttf',
    category: 'monospace',
  },
  {
    id: 'verdana',
    name: 'Verdana',
    family: 'Verdana, sans-serif',
    file: '/fonts/verdana.ttf',
    category: 'sans-serif',
  },
  {
    id: 'helvetica',
    name: 'Helvetica',
    family: 'Helvetica, sans-serif',
    file: '/fonts/helvetica.ttf',
    category: 'sans-serif',
  },
  {
    id: 'impact',
    name: 'Impact',
    family: 'Impact, sans-serif',
    file: '/fonts/impact.ttf',
    category: 'display',
  },
  {
    id: 'comic-sans-ms',
    name: 'Comic Sans MS',
    family: 'Comic Sans MS, cursive',
    file: '/fonts/comic-sans-ms.ttf',
    category: 'handwriting',
  },
  {
    id: 'trebuchet-ms',
    name: 'Trebuchet MS',
    family: 'Trebuchet MS, sans-serif',
    file: '/fonts/trebuchet-ms.ttf',
    category: 'sans-serif',
  },
  {
    id: 'lucida-console',
    name: 'Lucida Console',
    family: 'Lucida Console, monospace',
    file: '/fonts/lucida-console.ttf',
    category: 'monospace',
  },

  // Google Fonts (web fonts)
  {
    id: 'inter',
    name: 'Inter',
    family: 'Inter, sans-serif',
    file: '/fonts/inter.ttf',
    category: 'sans-serif',
  },
  {
    id: 'roboto',
    name: 'Roboto',
    family: 'Roboto, sans-serif',
    file: '/fonts/roboto.ttf',
    category: 'sans-serif',
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    family: 'Open Sans, sans-serif',
    file: '/fonts/open-sans.ttf',
    category: 'sans-serif',
  },
  {
    id: 'lato',
    name: 'Lato',
    family: 'Lato, sans-serif',
    file: '/fonts/lato.ttf',
    category: 'sans-serif',
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    family: 'Montserrat, sans-serif',
    file: '/fonts/montserrat.ttf',
    category: 'sans-serif',
  },
  {
    id: 'poppins',
    name: 'Poppins',
    family: 'Poppins, sans-serif',
    file: '/fonts/poppins.ttf',
    category: 'sans-serif',
  },
  {
    id: 'source-sans-pro',
    name: 'Source Sans Pro',
    family: 'Source Sans Pro, sans-serif',
    file: '/fonts/source-sans-pro.ttf',
    category: 'sans-serif',
  },
  {
    id: 'oswald',
    name: 'Oswald',
    family: 'Oswald, sans-serif',
    file: '/fonts/oswald.ttf',
    category: 'display',
  },
  {
    id: 'raleway',
    name: 'Raleway',
    family: 'Raleway, sans-serif',
    file: '/fonts/raleway.ttf',
    category: 'sans-serif',
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu',
    family: 'Ubuntu, sans-serif',
    file: '/fonts/ubuntu.ttf',
    category: 'sans-serif',
  },
  {
    id: 'edwardian-script-itc',
    name: 'Edwardian Script ITC',
    family: 'Edwardian Script ITC, cursive',
    file: '/fonts/edwardian-script-itc.ttf',
    category: 'handwriting',
  },
];

export const useFontStore = create<FontStore>((set, get) => ({
  fonts: defaultFonts,
  selectedFont: 'inter', // Default to Inter

  setSelectedFont: (fontId: string) => {
    set({ selectedFont: fontId });
  },

  addFont: (font: Font) => {
    set(state => ({
      fonts: [...state.fonts, font],
    }));
  },

  removeFont: (fontId: string) => {
    set(state => ({
      fonts: state.fonts.filter(font => font.id !== fontId),
    }));
  },

  getFontById: (fontId: string) => {
    return get().fonts.find(font => font.id === fontId);
  },

  getFontsByCategory: (category: Font['category']) => {
    return get().fonts.filter(font => font.category === category);
  },
}));

// Helper function to load custom fonts
export const loadCustomFont = (font: Font) => {
  if (font.file) {
    const link = document.createElement('link');
    link.href = font.file;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

// Helper function to get font family string
export const getFontFamily = (fontId: string): string => {
  const font = useFontStore.getState().getFontById(fontId);
  return font?.family || 'Inter, sans-serif';
};
