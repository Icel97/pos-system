import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { branches as branchRoutes } from '@/routes/branches';
import { FormEventHandler } from 'react';
import { Branch } from '@/types';

interface Props {
    branch: Branch;
}

export default function Edit({ branch }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: branch.name,
        phone: branch.phone || '',
        address: branch.address || '',
        is_active: branch.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(branchRoutes.update(branch.id).url);
    };

    return (
        <>
            <Head title="Editar Sucursal" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-2xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Editar Sucursal</h1>
                    <Button variant="outline" asChild>
                        <Link href={branchRoutes.index().url}>Cancelar</Link>
                    </Button>
                </div>

                <div className="rounded-md border bg-card p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre de la Sucursal</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono (Opcional)</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Dirección (Opcional)</Label>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                            />
                            {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                            />
                            <Label htmlFor="is_active">Activo</Label>
                            {errors.is_active && <p className="text-sm text-destructive">{errors.is_active}</p>}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                Actualizar Sucursal
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Sucursales', href: branchRoutes.index().url },
        { title: 'Editar Sucursal', href: '#' },
    ],
};
