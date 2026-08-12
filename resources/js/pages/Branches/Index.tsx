import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Branch } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Trash } from 'lucide-react';
import branchRoutes from '@/routes/branches';

interface Props {
    branches: Branch[];
}

export default function Index({ branches }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta sucursal?')) {
            router.delete(branchRoutes.destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Sucursales" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Catálogo de Sucursales</h1>
                    <Button asChild>
                        <Link href={branchRoutes.create().url}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Sucursal
                        </Link>
                    </Button>
                </div>

                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>Dirección</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {branches.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No hay sucursales registradas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                branches.map((branch) => (
                                    <TableRow key={branch.id}>
                                        <TableCell className="font-medium">{branch.name}</TableCell>
                                        <TableCell>{branch.phone || '-'}</TableCell>
                                        <TableCell>{branch.address || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={branch.is_active ? 'default' : 'secondary'}>
                                                {branch.is_active ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                            {branch.is_warehouse && (
                                                <Badge variant="outline" className="ml-2">
                                                    Bodega
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="icon" asChild>
                                                    <Link href={branchRoutes.edit(branch.id).url}>
                                                        <Edit className="h-4 w-4" />
                                                        <span className="sr-only">Editar</span>
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleDelete(branch.id)}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                    <span className="sr-only">Eliminar</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Sucursales',
            href: branchRoutes.index().url,
        },
    ],
};
