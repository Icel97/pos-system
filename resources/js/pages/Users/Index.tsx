import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Branch, Role } from '@/types';
import { Edit, Plus, Trash } from 'lucide-react';
import usersRoutes from '@/routes/users';
import { useState, FormEventHandler, useEffect } from 'react';

// Users are paginated, so we define a paginated response type
interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    users: PaginatedUsers;
    branches: Branch[];
    roles: Role[];
}

export default function Index({ users, branches, roles }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        branch_id: '' as string | number,
        role: '',
    });

    useEffect(() => {
        if (editingUser) {
            setData({
                name: editingUser.name,
                email: editingUser.email,
                password: '',
                branch_id: editingUser.branch_id?.toString() || '',
                role: editingUser.roles?.[0]?.name || '',
            });
        } else {
            reset();
        }
    }, [editingUser]);

    const openCreateDialog = () => {
        setEditingUser(null);
        clearErrors();
        reset();
        setIsDialogOpen(true);
    };

    const openEditDialog = (user: User) => {
        setEditingUser(user);
        clearErrors();
        setIsDialogOpen(true);
    };

    const handleCloseDialog = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setTimeout(() => {
                setEditingUser(null);
                reset();
                clearErrors();
            }, 200);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (editingUser) {
            put(usersRoutes.update(editingUser.id).url, {
                onSuccess: () => handleCloseDialog(false),
            });
        } else {
            post(usersRoutes.store().url, {
                onSuccess: () => handleCloseDialog(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            destroy(usersRoutes.destroy(id).url);
        }
    };

    return (
        <>
            <Head title="Usuarios" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Catálogo de Usuarios</h1>
                    <Button onClick={openCreateDialog}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Usuario
                    </Button>
                </div>

                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Correo</TableHead>
                                <TableHead>Sucursal</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No hay usuarios registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.branch?.name || '-'}</TableCell>
                                        <TableCell>
                                            {user.roles && user.roles.length > 0 ? (
                                                <Badge variant="secondary">
                                                    {user.roles[0].name}
                                                </Badge>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    onClick={() => openEditDialog(user)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Editar</span>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => handleDelete(user.id)}
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

            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Contraseña {editingUser && <span className="text-muted-foreground text-xs">(Opcional)</span>}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="branch_id">Sucursal</Label>
                            <Select 
                                value={data.branch_id.toString()} 
                                onValueChange={(value) => setData('branch_id', value)}
                            >
                                <SelectTrigger id="branch_id">
                                    <SelectValue placeholder="Seleccione una sucursal" />
                                </SelectTrigger>
                                <SelectContent>
                                    {branches.map((branch) => (
                                        <SelectItem key={branch.id} value={branch.id.toString()}>
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.branch_id && <p className="text-sm text-destructive">{errors.branch_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Rol</Label>
                            <Select 
                                value={data.role} 
                                onValueChange={(value) => setData('role', value)}
                            >
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Seleccione un rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.name}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="button" variant="outline" className="mr-2" onClick={() => handleCloseDialog(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Usuarios',
            href: usersRoutes.index().url,
        },
    ],
};
