declare namespace Desmos {
  interface Expression {
    id: string;
    latex: string;
    color?: string;
    hidden?: boolean;
    [key: string]: any;
  }

  interface Calculator {
    setExpression: (expr: Expression) => void;
    removeExpression: (id: string) => void;
    setMathBounds: (bounds: { left: number; right: number; bottom: number; top: number }) => void;
    getExpressions: () => Expression[];
    destroy: () => void;
    [key: string]: any;
  }

  interface GraphingCalculatorOptions {
    expressions?: boolean;
    settingsMenu?: boolean;
    zoomButtons?: boolean;
    expressionsTopbar?: boolean;
    border?: boolean;
    lockViewport?: boolean;
    expressionsCollapsed?: boolean;
    [key: string]: any;
  }

  function GraphingCalculator(
    element: HTMLElement, 
    options?: GraphingCalculatorOptions
  ): Calculator;
}

declare global {
  interface Window {
    Desmos: typeof Desmos;
  }
}

export {}; 