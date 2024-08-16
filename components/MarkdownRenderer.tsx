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
  h1: ({ node, ...props }: { node: Element }) => (
    <h1
      className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4"
      {...props}
    />
  ),
  h2: ({ node, ...props }: { node: Element }) => (
    <h2
      className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 mb-3"
      {...props}
    />
  ),
  h3: ({ node, ...props }: { node: Element }) => (
    <h3
      className="scroll-m-20 text-2xl font-semibold tracking-tight mb-2"
      {...props}
    />
  ),
  p: ({ node, ...props }: { node: Element }) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
  ),
  ul: ({ node, ...props }: { node: Element }) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
  ),
  ol: ({ node, ...props }: { node: Element }) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />
  ),
  li: ({ node, ...props }: { node: Element }) => <li {...props} />,
  blockquote: ({ node, ...props }: { node: Element }) => (
    <Alert className="my-4">
      <AlertDescription {...props} />
    </Alert>
  ),
  hr: ({ node, ...props }: { node: Element }) => (
    <Separator className="my-4" {...props} />
  ),
  strong: ({ node, ...props }: { node: Element }) => (
    <strong className="font-bold" {...props} />
  ),
  em: ({ node, ...props }: { node: Element }) => (
    <em className="italic" {...props} />
  ),
  code: ({ node, ...props }: { node: Element }) => {
    return (
      <code
        className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
        {...props}
      />
    );
  },
  table: ({ node, ...props }: { node: Element }) => (
    <div className="my-6 w-full overflow-y-auto">
      <Table {...props} />
    </div>
  ),
  thead: ({ node, ...props }: { node: Element }) => <TableHeader {...props} />,
  tbody: ({ node, ...props }: { node: Element }) => <TableBody {...props} />,
  tr: ({ node, ...props }: { node: Element }) => <TableRow {...props} />,
  th: ({ node, ...props }: { node: Element }) => <TableHead {...props} />,
  td: ({ node, ...props }: { node: Element }) => <TableCell {...props} />,
  img: ({ node, ...props }: { node: Element }) => (
    console.log(props),
    (
      <img
        className="rounded-md shadow-sm my-4 max-w-full h-auto"
        alt={props.alt}
        {...props}
      />
    )
  ),
  a: ({ node, ...props }: { node: Element }) => (
    <Button variant="link" asChild>
      <a {...props} />
    </Button>
  ),
};

const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <ScrollArea className="w-full h-full">
      <div className="p-4">
        <ReactMarkdown components={customComponents}>{content}</ReactMarkdown>
      </div>
    </ScrollArea>
  );
};

export default MarkdownRenderer;
