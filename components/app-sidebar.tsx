import Image from "next/image";
import { User2, ChevronUp } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { sidebarItems } from "@/constants/navLinks";
import SignoutBtn from "./SignoutBtn";
import Link from "next/link";

export function AppSidebar() {
	return (
		<Sidebar className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
			<SidebarHeader>
				<div className="px-4 py-4 flex items-center space-x-3">
					<Image
						src="/images/logo.png"
						width={36}
						height={36}
						alt="logo"
						priority
						className="rounded-md"
					/>
					<div>
						<p className="font-bold text-base tracking-wide text-gray-900 dark:text-white">
							BatStateU
						</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							Marketplace
						</p>
					</div>
				</div>
				<Separator className="my-2" />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
						Main
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								{sidebarItems.map((item) => (
									<SidebarMenuButton
										key={item.title}
										asChild
										className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
									>
										<Link
											href={item.url}
											className="flex items-center space-x-3 px-4 py-2 rounded-md"
										>
											<item.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
											<span className="font-medium text-gray-700 dark:text-gray-200">
												{item.title}
											</span>
										</Link>
									</SidebarMenuButton>
								))}
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="mt-auto">
				<Separator className="my-2" />
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
									<div className="flex items-center space-x-3">
										<User2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
										<span className="flex-grow text-left text-gray-700 dark:text-gray-200">
											Marketplace Admin
										</span>
										<ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
									</div>
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="top" className="w-56">
								<DropdownMenuItem>
									<span>Account</span>
								</DropdownMenuItem>
								<div className="px-2">
									<SignoutBtn />
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
