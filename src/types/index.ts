import * as React from 'react';

export type ReactLeaf = 
  | React.ReactNode
  | React.ComponentType<any>
  | null
  | undefined;

export type Props = Record<string, ReactLeaf>;

export type Config = Record<string, Props>;

export type Options = {
  config?: Config;
};

export type VisitorState = {
  opts?: Options;
};
