// @ts-nocheck
import React from "react";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const customComponents = {
  h1: ({ node, ...props }) => (
    <h1
      className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4"
      {...props}
    />
  ),
  h2: ({ node, ...props }) => (
    <h2
      className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 mb-3"
      {...props}
    />
  ),
  h3: ({ node, ...props }) => (
    <h3
      className="scroll-m-20 text-2xl font-semibold tracking-tight mb-2"
      {...props}
    />
  ),
  h4: ({ node, ...props }) => (
    <h4
      className="scroll-m-20 text-xl font-semibold tracking-tight mb-2"
      {...props}
    />
  ),
  p: ({ node, ...props }) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />
  ),
  li: ({ node, ...props }) => <li className="mt-2" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote className="mt-6 border-l-2 pl-6 italic" {...props} />
  ),
  hr: ({ node, ...props }) => <Separator className="my-4" {...props} />,
  strong: ({ node, ...props }) => (
    <strong className="font-semibold" {...props} />
  ),
  em: ({ node, ...props }) => <em className="italic" {...props} />,
  code: ({ node, inline, ...props }) => {
    if (inline) {
      return (
        <code
          className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
          {...props}
        />
      );
    }
    return (
      <pre className="mb-4 mt-6 overflow-x-auto rounded-lg bg-muted p-4">
        <code className="relative font-mono text-sm" {...props} />
      </pre>
    );
  },
  table: ({ node, ...props }) => (
    <div className="my-6 w-full overflow-y-auto">
      <Table {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <TableHeader {...props} />,
  tbody: ({ node, ...props }) => <TableBody {...props} />,
  tr: ({ node, ...props }) => <TableRow {...props} />,
  th: ({ node, ...props }) => <TableHead {...props} />,
  td: ({ node, ...props }) => <TableCell {...props} />,
  img: ({ node, ...props }) => (
    <img
      className="rounded-md border my-4 max-w-full h-auto"
      alt={props.alt}
      {...props}
    />
  ),
  a: ({ node, ...props }) => (
    <Button variant="link" asChild className="p-0 h-auto">
      <a {...props} />
    </Button>
  ),
};

const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown components={customComponents}>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
