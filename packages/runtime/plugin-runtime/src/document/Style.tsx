// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import {
  DOCUMENT_STYLE_PLACEHOLDER_START,
  DOCUMENT_STYLE_PLACEHOLDER_END,
} from './constants';

export function Style(props: { children?: string; content?: string }) {
  const { content, children } = props;
  const contentStr = children || content;
  const styleContent = encodeURIComponent(`${contentStr}`);
  return (
    <>
      {`${DOCUMENT_STYLE_PLACEHOLDER_START}`}
      {`${styleContent}`}
      {`${DOCUMENT_STYLE_PLACEHOLDER_END}`}
    </>
  );
}
