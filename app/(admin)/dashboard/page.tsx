import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import routes from "@/lib/links";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-8">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {routes.map((action) => (
          <Card key={action.href} className="hover:bg-accent transition-colors">
            <Link href={action.href}>
              <CardHeader>
                <CardTitle>{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
