"use client";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/pKXmcV85t8D
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"

export default function Component() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <UsersIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5,231</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">+10.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Sales Revenue</CardTitle>
          <DollarSignIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$25,678.00</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">+15.2% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Website Traffic</CardTitle>
          <BarChartIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12,345</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">+25.5% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
          <SmileIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">85%</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">+5% from last quarter</p>
        </CardContent>
      </Card>
    </div>
  )
}

function BarChartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  )
}


function DollarSignIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}


function SmileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  )
}


function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

// /**
//  * v0 by Vercel.
//  * @see https://v0.dev/t/Z0e6qNxS2Xf
//  * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
//  */
// "use client";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu";
// import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { CardDescription, CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
// import { ResponsiveBar } from "@nivo/bar";
// import { ResponsiveScatterPlot } from "@nivo/scatterplot";
// import { ResponsiveLine } from "@nivo/line";
// import { ResponsivePie } from "@nivo/pie";

// export default function Component() {
//   return (
//       <div className="flex flex-col w-full">

//         <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
//           <div className="flex items-center gap-4">
//             <Button
//               size="icon"
//               variant="outline">
//               <ArrowLeftIcon className="h-4 w-4" />
//               <span className="sr-only">Back</span>
//             </Button>
//             <h1 className="font-semibold text-lg md:text-xl">Analytics</h1>
//             <div className="ml-auto flex items-center gap-2">
//               <Button
//                 className="hidden sm:flex"
//                 variant="outline">
//                 Today
//               </Button>
//               <Button
//                 className="hidden md:flex"
//                 variant="outline">
//                 This Month
//               </Button>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     className="w-[280px] justify-start text-left font-normal"
//                     id="date"
//                     variant="outline">
//                     <CalendarClockIcon className="mr-2 h-4 w-4" />
//                     June 01, 2023 - June 30, 2023
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent
//                   align="end"
//                   className="w-auto p-0">
//                   <Calendar
//                     initialFocus
//                     mode="range"
//                     numberOfMonths={2}
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>
//           </div>
//           <div className="grid gap-6">
//             <div className="grid md:grid-cols-3 gap-6">
//               <Card>
//                 <CardHeader>
//                   <CardDescription>Total Sales</CardDescription>
//                   <CardTitle>$2389.00</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <StackedbarChart className="aspect-[4/3]" />
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <CardDescription>Sessions</CardDescription>
//                   <CardTitle>345</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <DotChart className="aspect-[4/3]" />
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <CardDescription>Returning Customers</CardDescription>
//                   <CardTitle>33.5%</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <GroupedbarChart className="aspect-[4/3]" />
//                 </CardContent>
//               </Card>
//             </div>
//             <div className="grid md:grid-cols-3 gap-6">
//               <Card>
//                 <CardHeader>
//                   <CardDescription>Visitors</CardDescription>
//                   <CardTitle>3,456</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <LineChart className="aspect-[4/3]" />
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <CardDescription>Page Views</CardDescription>
//                   <CardTitle>12,345</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <LabelledpieChart className="aspect-[4/3]" />
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <CardDescription>Visitors</CardDescription>
//                   <CardTitle>Top Referrers</CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid gap-4">
//                   <div className="flex items-center">
//                     <div>google.com</div>
//                     <div className="font-semibold ml-auto">3K</div>
//                   </div>
//                   <div className="flex items-center">
//                     <div>twitter.com</div>
//                     <div className="font-semibold ml-auto">1.2K</div>
//                   </div>
//                   <div className="flex items-center">
//                     <div>youtube.com</div>
//                     <div className="font-semibold ml-auto">1.1K</div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </main>
//       </div>
//   );
// }

// function ArrowLeftIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round">
//       <path d="m12 19-7-7 7-7" />
//       <path d="M19 12H5" />
//     </svg>
//   );
// }

// function BellIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round">
//       <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
//       <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
//     </svg>
//   );
// }

// function CalendarClockIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round">
//       <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
//       <path d="M16 2v4" />
//       <path d="M8 2v4" />
//       <path d="M3 10h5" />
//       <path d="M17.5 17.5 16 16.25V14" />
//       <path d="M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />
//     </svg>
//   );
// }

// function DotChart(props: any) {
//   return (
//     <div {...props}>
//       <ResponsiveScatterPlot
//         data={[
//           {
//             id: "Desktop",
//             data: [
//               { x: "Jan", y: 43 },
//               { x: "Feb", y: 137 },
//               { x: "Mar", y: 61 },
//               { x: "Apr", y: 145 },
//               { x: "May", y: 26 },
//               { x: "Jun", y: 154 },
//             ],
//           },
//           {
//             id: "Mobile",
//             data: [
//               { x: "Jan", y: 60 },
//               { x: "Feb", y: 48 },
//               { x: "Mar", y: 177 },
//               { x: "Apr", y: 78 },
//               { x: "May", y: 96 },
//               { x: "Jun", y: 204 },
//             ],
//           },
//         ]}
//         margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
//         xScale={{ type: "point" }}
//         yScale={{ type: "linear" }}
//         blendMode="multiply"
//         axisTop={null}
//         axisRight={null}
//         axisBottom={{
//           tickSize: 0,
//           tickPadding: 16,
//         }}
//         axisLeft={{
//           tickSize: 0,
//           tickValues: 5,
//           tickPadding: 16,
//         }}
//         colors={["#2563eb", "#e11d48"]}
//         useMesh={true}
//         gridYValues={6}
//         theme={{
//           tooltip: {
//             chip: {
//               borderRadius: "9999px",
//             },
//             container: {
//               fontSize: "12px",
//               textTransform: "capitalize",
//               borderRadius: "6px",
//             },
//           },
//           grid: {
//             line: {
//               stroke: "#f3f4f6",
//             },
//           },
//         }}
//         role="application"
//       />
//     </div>
//   );
// }

// function GroupedbarChart(props: any) {
//   return (
//     <div {...props}>
//       <ResponsiveBar
//         data={[
//           { name: "Jan", desktop: 111, mobile: 99 },
//           { name: "Feb", desktop: 157, mobile: 87 },
//           { name: "Mar", desktop: 129, mobile: 89 },
//           { name: "Apr", desktop: 187, mobile: 151 },
//           { name: "May", desktop: 119, mobile: 127 },
//           { name: "Jun", desktop: 20, mobile: 121 },
//         ]}
//         keys={["desktop", "mobile"]}
//         indexBy="name"
//         groupMode="grouped"
//         margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
//         padding={0.3}
//         colors={["#2563eb", "#e11d48"]}
//         axisBottom={{
//           tickSize: 0,
//           tickPadding: 16,
//         }}
//         axisLeft={{
//           tickSize: 0,
//           tickValues: 4,
//           tickPadding: 16,
//         }}
//         gridYValues={4}
//         theme={{
//           tooltip: {
//             chip: {
//               borderRadius: "9999px",
//             },
//             container: {
//               fontSize: "12px",
//               textTransform: "capitalize",
//               borderRadius: "6px",
//             },
//           },
//           grid: {
//             line: {
//               stroke: "#f3f4f6",
//             },
//           },
//         }}
//         tooltipLabel={({ id }) => `${id}`}
//         enableLabel={false}
//         role="application"
//         ariaLabel="A grouped bar chart"
//       />
//     </div>
//   );
// }

// function HomeIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round">
//       <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
//       <polyline points="9 22 9 12 15 12 15 22" />
//     </svg>
//   );
// }

// function LabelledpieChart(props: any) {
//   return (
//     <div {...props}>
//       <ResponsivePie
//         data={[
//           { id: "Jan", value: 111 },
//           { id: "Feb", value: 157 },
//           { id: "Mar", value: 129 },
//           { id: "Apr", value: 150 },
//           { id: "May", value: 119 },
//           { id: "Jun", value: 72 },
//         ]}
//         sortByValue
//         margin={{ top: 30, right: 50, bottom: 30, left: 50 }}
//         innerRadius={0.5}
//         padAngle={1}
//         cornerRadius={3}
//         activeOuterRadiusOffset={2}
//         borderWidth={1}
//         arcLinkLabelsThickness={1}
//         enableArcLabels={false}
//         colors={["#2563eb"]}
//         theme={{
//           tooltip: {
//             chip: {
//               borderRadius: "9999px",
//             },
//             container: {
//               fontSize: "12px",
//               textTransform: "capitalize",
//               borderRadius: "6px",
//             },
//           },
//         }}
//         role="application"
//       />
//     </div>
//   );
// }

// function LineChart(props: any) {
//   return (
//     <div {...props}>
//       <ResponsiveLine
//         data={[
//           {
//             id: "Desktop",
//             data: [
//               { x: "Jan", y: 43 },
//               { x: "Feb", y: 137 },
//               { x: "Mar", y: 61 },
//               { x: "Apr", y: 145 },
//               { x: "May", y: 26 },
//               { x: "Jun", y: 154 },
//             ],
//           },
//           {
//             id: "Mobile",
//             data: [
//               { x: "Jan", y: 60 },
//               { x: "Feb", y: 48 },
//               { x: "Mar", y: 177 },
//               { x: "Apr", y: 78 },
//               { x: "May", y: 96 },
//               { x: "Jun", y: 204 },
//             ],
//           },
//         ]}
//         margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
//         xScale={{
//           type: "point",
//         }}
//         yScale={{
//           type: "linear",
//         }}
//         axisTop={null}
//         axisRight={null}
//         axisBottom={{
//           tickSize: 0,
//           tickPadding: 16,
//         }}
//         axisLeft={{
//           tickSize: 0,
//           tickValues: 5,
//           tickPadding: 16,
//         }}
//         colors={["#2563eb", "#e11d48"]}
//         pointSize={6}
//         useMesh={true}
//         gridYValues={6}
//         theme={{
//           tooltip: {
//             chip: {
//               borderRadius: "9999px",
//             },
//             container: {
//               fontSize: "12px",
//               textTransform: "capitalize",
//               borderRadius: "6px",
//             },
//           },
//           grid: {
//             line: {
//               stroke: "#f3f4f6",
//             },
//           },
//         }}
//         role="application"
//       />
//     </div>
//   );
// }

// function LineChartIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round">
//       <path d="M3 3v18h18" />
//       <path d="m19 9-5 5-4-4-3 3" />
//     </svg>
//   );
// }

// function LogOutIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round">
//       <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//       <polyline points="16 17 21 12 16 7" />
//       <line
//         x1="21"
//         x2="9"
//         y1="12"
//         y2="12"
//       />
//     </svg>
//   );
// }

// function Package2Icon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round">
//       <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
//       <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
//       <path d="M12 3v6" />
//     </svg>
//   );
// }

// function PackageIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round">
//       <path d="m7.5 4.27 9 5.15" />
//       <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
//       <path d="m3.3 7 8.7 5 8.7-5" />
//       <path d="M12 22V12" />
//     </svg>
//   );
// }

// function SearchIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round">
//       <circle
//         cx="11"
//         cy="11"
//         r="8"
//       />
//       <path d="m21 21-4.3-4.3" />
//     </svg>
//   );
// }

// function SettingsIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round">
//       <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
//       <circle
//         cx="12"
//         cy="12"
//         r="3"
//       />
//     </svg>
//   );
// }

// function ShoppingCartIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round">
//       <circle
//         cx="8"
//         cy="21"
//         r="1"
//       />
//       <circle
//         cx="19"
//         cy="21"
//         r="1"
//       />
//       <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
//     </svg>
//   );
// }

// function StackedbarChart(props: any) {
//   return (
//     <div {...props}>
//       <ResponsiveBar
//         data={[
//           { name: "Jan", desktop: 111, mobile: 99 },
//           { name: "Feb", desktop: 157, mobile: 87 },
//           { name: "Mar", desktop: 129, mobile: 89 },
//           { name: "Apr", desktop: 187, mobile: 151 },
//           { name: "May", desktop: 119, mobile: 127 },
//           { name: "Jun", desktop: 20, mobile: 121 },
//         ]}
//         keys={["desktop", "mobile"]}
//         indexBy="name"
//         margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
//         padding={0.3}
//         colors={["#2563eb", "#e11d48"]}
//         axisBottom={{
//           tickSize: 0,
//           tickPadding: 16,
//         }}
//         axisLeft={{
//           tickSize: 0,
//           tickValues: 4,
//           tickPadding: 16,
//         }}
//         gridYValues={4}
//         theme={{
//           tooltip: {
//             chip: {
//               borderRadius: "9999px",
//             },
//             container: {
//               fontSize: "12px",
//               textTransform: "capitalize",
//               borderRadius: "6px",
//             },
//           },
//           grid: {
//             line: {
//               stroke: "#f3f4f6",
//             },
//           },
//         }}
//         tooltipLabel={({ id }) => `${id}`}
//         enableLabel={false}
//         role="application"
//         ariaLabel="A stacked bar chart"
//       />
//     </div>
//   );
// }
