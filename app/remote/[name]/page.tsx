import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    name: string;
  };
}

export default async function ScriptPage({ params }: PageProps) {
  const { name } = params;
  const file = path.join(process.cwd(), "public/scripts", `${name}.ps1`);
  if (!fs.existsSync(file)) {
    return notFound();
  }

  const scriptContent = fs.readFileSync(file, "utf-8");

  return <pre style={{ whiteSpace: "pre-wrap" }}>{scriptContent}</pre>;
}
