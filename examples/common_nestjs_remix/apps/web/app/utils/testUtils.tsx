import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";

const MockThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

interface RenderWithOptions {
  withTheme?: boolean;
}

class TestRenderer {
  private providers: React.FC<{ children: React.ReactNode }>[] = [];

  withTheme() {
    this.providers.push(MockThemeProvider);
    return this;
  }

  render(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
    const AllProviders = ({ children }: { children: React.ReactNode }) => (
      <>
        {this.providers.reduceRight(
          (acc, Provider) => (
            <Provider>{acc}</Provider>
          ),
          children
        )}
      </>
    );

    return render(ui, { wrapper: AllProviders, ...options });
  }
}

export const renderWith = (options: RenderWithOptions = {}) => {
  const renderer = new TestRenderer();

  if (options.withTheme) {
    renderer.withTheme();
  }

  return renderer;
};
