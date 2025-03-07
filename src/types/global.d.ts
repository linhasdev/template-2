interface MathJaxConfig {
  tex: {
    inlineMath: string[][];
    displayMath: string[][];
    processEscapes: boolean;
    processEnvironments: boolean;
    processRefs: boolean;
    tags: string;
    tagSide: string;
    tagIndent: string;
    multlineWidth: string;
    packages: string[];
  };
  svg: {
    fontCache: string;
  };
  options: {
    enableMenu: boolean;
    renderActions: {
      addMenu: any[];
      checkLoading: any[];
    };
    skipHtmlTags: string[];
    ignoreHtmlClass: string;
    processHtmlClass: string;
  };
  startup?: {
    ready?: () => void;
    defaultReady?: () => void;
  };
}

interface MathJaxObject {
  typeset?: (elements: HTMLElement[]) => void;
  typesetPromise?: (elements: HTMLElement[]) => Promise<any>;
  startup?: {
    defaultReady?: () => void;
  };
  tex?: {
    inlineMath: string[][];
    displayMath: string[][];
    processEscapes: boolean;
    processEnvironments: boolean;
  };
  options?: {
    skipHtmlTags: string[];
    ignoreHtmlClass: string;
    processHtmlClass: string;
  };
}

declare global {
  interface Window {
    MathJax?: MathJaxObject;
  }
}

// KaTeX types
interface KaTeX {
  renderToString: (
    tex: string, 
    options?: {
      displayMode?: boolean;
      throwOnError?: boolean;
      errorColor?: string;
      macros?: Record<string, string>;
      colorIsTextColor?: boolean;
      strict?: boolean;
      trust?: boolean;
      [key: string]: any;
    }
  ) => string;
  version?: string;
}

declare global {
  interface Window {
    katex: KaTeX;
  }
}

export {};

// KaTeX types (if needed)
declare module 'katex' {
  export interface KatexOptions {
    displayMode?: boolean;
    throwOnError?: boolean;
    errorColor?: string;
    macros?: Record<string, string>;
    colorIsTextColor?: boolean;
    strict?: boolean;
    trust?: boolean;
    output?: 'html' | 'mathml';
    maxSize?: number;
    maxExpand?: number;
    globalGroup?: boolean;
  }

  export function renderToString(
    math: string,
    options?: KatexOptions
  ): string;
}

declare module '*.css';

// Desmos API types
interface DesmosExpression {
  id: string;
  latex: string;
  color?: string;
  hidden?: boolean;
  [key: string]: any;
}

interface DesmosCalculator {
  setExpression: (expr: DesmosExpression) => void;
  removeExpression: (id: string) => void;
  setMathBounds: (bounds: { left: number; right: number; bottom: number; top: number }) => void;
  getExpressions: () => DesmosExpression[];
  destroy: () => void;
  [key: string]: any;
}

interface DesmosStatic {
  GraphingCalculator: (
    element: HTMLElement, 
    options?: {
      expressions?: boolean;
      settingsMenu?: boolean;
      zoomButtons?: boolean;
      expressionsTopbar?: boolean;
      border?: boolean;
      lockViewport?: boolean;
      expressionsCollapsed?: boolean;
      [key: string]: any;
    }
  ) => DesmosCalculator;
  [key: string]: any;
}

declare global {
  interface Window {
    katex: KaTeX;
    Desmos: DesmosStatic;
  }
}

export {}; 