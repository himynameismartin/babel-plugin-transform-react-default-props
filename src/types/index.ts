import * as React from 'react';

export type ReactLeaf = 
  | React.ReactNode
  | React.ComponentType<any>
  | null
  | undefined;

export type Props = {
  [key: string]: ReactLeaf;
}

export type Config = {
  [key: string]: Props;
}

export type Options = {
  config?: Config;
}

export type VisitorState = {
  opts?: Options;
}
