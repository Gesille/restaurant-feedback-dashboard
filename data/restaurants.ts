import { BrandColor } from "@/lib/colors";
import { ActivityEvent, IRestaurant, ScanPoint, TableQR } from "@/types";



export const restaurantsData: IRestaurant[] = [
  {
    id: 1,
    name: "Maia South Point Restaurant & Lounge",
   
    menuViews: 1200,
    scansToday: 150,
    location: "English Harbour | Antigua",
    image: "/company/Maia logo.png",
    rating: 4.4,
    reviews: 1240,
    website: "https://maiasouthpoint.com/",
    status: "active",
    color: "violet",
    avgRating: undefined,
    totalScans: undefined,
    scansTrend: undefined
  },
  {
    id: 2,
    name: "South Point Real Estate",
  
    menuViews: 800,
    scansToday: 100,
    location: "English Harbour | Antigua",
    image: "/company/SPF_Logo_CMYK.png",
    rating: 4.5,
    reviews: 980,
    website: "https://southpointantigua.com/",
    status: "active",
    color: "blue",
    avgRating: undefined,
    totalScans: undefined,
    scansTrend: undefined
  },
  {
    id: 3,
    name: "charr'd",
  
    menuViews: 1000,
    scansToday: 120,
    location: "Town Park Plaza, Epicurean Drive",
    image: "/company/Charr'dLogo.png",
    rating: 4.3,
    reviews: 980,
    website: "https://charrdantigua.com/",
    status: "active",
    color: "coral",
    avgRating: undefined,
    totalScans: undefined,
    scansTrend: undefined
  },
  {
    id: 4,
    name: "Big Banana Downtown",
    location: "Lower Redcliffe St, Redcliffe Quay",
    image: "/company/BB_Logo_CMYK.png",
    rating: 4.1,
    reviews: 720,
    website: "https://bigbanana-antigua.com/",
    
    menuViews: 0,
    scansToday: 0,
    status: "paused",
    color: "amber",
    avgRating: undefined,
    totalScans: undefined,
    scansTrend: undefined
  },
  {
    id: 5,
    name: "Big Banana Airside + Landside",
    location: "Pavilion Dr, VC Bird International Airport",
    image: "/company/BB_Logo_CMYK.png",
    rating: 4.4,
    reviews: 1100,
    website: "https://bigbanana-antigua.com/",
    
    menuViews: 0,
    scansToday: 0,
    status: "paused",
    color: "amber",
    avgRating: undefined,
    totalScans: undefined,
    scansTrend: undefined
  },
  {
    id: 6,
    name: "Chef's World",
    
    menuViews: 0,
    scansToday: 0,
    location: "Gambles Centre, Friars Hill Rd, St John's, Antigua",
    image: "/company/ChefsWorld Logo CMYK.png",
    rating: 4.8,
    reviews: 1100,
    website: "https://chefsworld-antigua.com/",
    status: "paused",
    color: "pink",
    avgRating: undefined,
    totalScans: undefined,
    scansTrend: undefined
  },
  {
    id: 7,
    name: "Next International Ltd.",
   
    menuViews: 0,
    scansToday: 0,
    location: "Gambles Centre, Friars Hill Rd, St John's, Antigua",
    image: "/logo/NextID-Logo-CMYK.png",
    rating: 4.8,
    reviews: 1100,
    website: "https://nextintl.com/",
    status: "paused",
    color: "teal",
    avgRating: undefined,
    totalScans: undefined,
    scansTrend: undefined
  },
];

export const companyLogos = [
  "/company/ChefsWorld Logo CMYK.png",
  "/company/BB_Logo_CMYK.png",
  "/company/Charr'dLogo.png",
  "/company/SPF_Logo_CMYK.png",
  "/company/Maia logo.png",
  "/logo/NextID-Logo-CMYK.png",
];

export const recentActivity: ActivityEvent[] = [
  {
    id: "a1",
    restaurantId: "sakura-house",
    restaurantName: "Sakura House",
    color: "pink" as BrandColor,
    type: "scan",
    detail: "Table 7 scanned the menu QR",
    time: "2 min ago",
  },
  {
    id: "a2",
    restaurantId: "casa-roma",
    restaurantName: "Casa Roma",
    color: "violet" as BrandColor,
    type: "menu_view",
    detail: "Dessert menu viewed 14 times",
    time: "9 min ago",
  },
  {
    id: "a3",
    restaurantId: "le-bistro",
    restaurantName: "Le Bistro Doré",
    color: "violet" as BrandColor,
    type: "feedback",
    detail: "New 5-star feedback submitted",
    time: "24 min ago",
  },
  {
    id: "a4",
    restaurantId: "blue-anchor",
    restaurantName: "Blue Anchor",
    color: "blue" as BrandColor,
    type: "scan",
    detail: "Takeaway tag scanned 6 times",
    time: "41 min ago",
  },
  {
    id: "a5",
    restaurantId: "olive-branch",
    restaurantName: "Olive Branch",
    color: "teal" as BrandColor,
    type: "scan",
    detail: "Table 3 scanned the menu QR",
    time: "1h ago",
  },
];


export function getRestaurant(id: string): IRestaurant | undefined {
  return restaurantsData.find((r) => String(r.id) === id);
}



export function tableQRFor(restaurantId: string, tableCount: number): TableQR[] {
  const seed = restaurantId.length;
  return Array.from({ length: tableCount }).map((_, i) => ({
    tableNumber: i + 1,
    scans: 20 + ((seed * (i + 3)) % 65),
    lastScan: `${(i % 5) + 1}h ago`,
  }));
}


export const scanTrend: ScanPoint[] = [
  { date: "Jun 19", scans: 320 },
  { date: "Jun 20", scans: 410 },
  { date: "Jun 21", scans: 380 },
  { date: "Jun 22", scans: 460 },
  { date: "Jun 23", scans: 512 },
  { date: "Jun 24", scans: 470 },
  { date: "Jun 25", scans: 540 },
  { date: "Jun 26", scans: 610 },
  { date: "Jun 27", scans: 580 },
  { date: "Jun 28", scans: 650 },
  { date: "Jun 29", scans: 690 },
  { date: "Jun 30", scans: 720 },
  { date: "Jul 1", scans: 705 },
  { date: "Jul 2", scans: 714 },
];