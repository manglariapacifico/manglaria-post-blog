"use client";

import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { Switch } from "@/components/ui/switch";

export type BlogPost = {
  _id: string;
  title: string;
  description: string;
  author: {
    name: string;
    profileImg: string;
  };
  isDeleted: boolean;
  slug?: string;
}

export const columns = (
  handleToggleDelete: (projectId: string, isDeleted: boolean) => void,
): ColumnDef<BlogPost>[] => [
  {
    accessorKey: "title",
    header: () => <div className="text-center">Titulo</div>,
    cell: ({ row }) => {
      const blogPost = row.original;
      return (
        <div className="flex flex-col items-center justify-center gap-1 h-full">{blogPost.title}</div>
      );
    },
  },
  {
    accessorKey: "author",
    header: () => <div className="text-center">Autor</div>,
    cell: ({ row }) => {
      const blogPost = row.original;
      return (
        <div className="flex flex-col items-center justify-center gap-1 h-full"> {/* Apilar elementos verticalmente y centrar */}
          <Avatar>
            <AvatarImage src={blogPost.author.profileImg} alt={blogPost.author.name} />
            <AvatarFallback>
              {blogPost.author.name?.split('')[0].toUpperCase()} {/* Mostrar la primera letra del nombre */}
            </AvatarFallback>
          </Avatar>
          <Badge variant="outline" className="text-xs"> {/* Reducir el tamaño de la letra */}
            {blogPost.author.name}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "isDeleted",
    header: "Feed",
    cell: ({ row }) => {
      const { data: session } = useSession();
      const blogPost = row.original;

      if (session?.user.role === "admin") {
        return (
          <Switch
            checked={!blogPost.isDeleted}
            onCheckedChange={(checked) => handleToggleDelete(blogPost._id, !checked)}
          />
        );
      }

      return (
        <Badge variant={blogPost.isDeleted ? "destructive" : "default"}>
          {blogPost.isDeleted ? "Privado" : "Publico"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { data: session } = useSession();
      const blogPost = row.original;
      const router = useRouter();

      if (session?.user?.role !== "admin") {
        return null;
      }

      const handleEdit = () => {
        router.push(`/editor/blogs/${blogPost._id}`);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(blogPost._id)}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleEdit}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit} disabled>
              Eliminar (Next Feature)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]