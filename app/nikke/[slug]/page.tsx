// // import React from "react";

// // export default async function page({ params }: { params: { slug: string } }) {
// //   return (
// //     <div className="flex-col">
// //       <h1>{params.slug}</h1>
// //     </div>
// //   );
// // }

// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import TeamList from "@/components/team-list";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
// import SubmitTeamModal from "@/components/submit-team-modal";

// export default function Page({ params }: { params: { slug: string } }) {
//   const { slug } = params;

//   return (
//     <main className="flex-1 relative space-y-4">
//       <div className="flex flex-row w-full justify-between items-center">
//         <div className="flex flex-col w-full">
//           <Breadcrumb className="px-8">
//             <BreadcrumbList>
//               <BreadcrumbItem>
//                 <BreadcrumbLink href="/">Home</BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbItem>
//                 <BreadcrumbLink href="/story">Story</BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbItem>
//                 <BreadcrumbPage className="capitalize font-bold">
//                   Chapter {chapter} ({difficulty})
//                 </BreadcrumbPage>
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>

//           <div className="px-8 flex flex-wrap flex-col">
//             <h1 className="text-2xl">Story</h1>
//             <p className="text-muted-foreground mt-0 capitalize text-sm">
//               Level: {difficulty} - Chapter: {chapter}
//             </p>
//           </div>
//         </div>
//       </div>

//       <Separator />

//       <Card className="container mx-auto w-full  p-0">
//         <CardHeader className="flex flex-row items-center justify-between pb-2">
//           <CardTitle>Teams</CardTitle>
//           <SubmitTeamModal
//             modeId={mode.id}
//             modeName={mode.name}
//             chapterId={chapterData.id}
//             numberOfTeams={1}
//             allowCharacterRepeat={false}
//             versions={versions}
//           />
//         </CardHeader>
//         <CardContent className="p-4 pt-0 xl:p-6">
//           <TeamList
//             initialTeams={teams}
//             versions={versions}
//             chapterId={chapterData.id}
//             difficulty={difficulty}
//             modeId={mode.id}
//             modeName={mode.name}
//           />
//         </CardContent>
//       </Card>
//     </main>
//   );
// }
