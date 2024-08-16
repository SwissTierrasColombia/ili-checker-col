'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  type MRT_ColumnDef, //if using TypeScript (optional, but recommended)
} from 'material-react-table';
import Button from '@mui/material/Button';
import { deleteModel, getModelsForUser } from '@/app/lib/model/actions';
import { useRouter } from 'next/navigation';
import { ContentResponse, type Models } from '@/app/types/types';
import Typography from '@mui/material/Typography';
import { useSelectedModelStore } from '@/app/context/store';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { toast } from 'sonner';

//mock data - strongly typed if you are using TypeScript (optional, but recommended)

export default function ModelsPage() {
  const [data, setData] = useState<Models[]>([]);
  const setSelectedModel = useSelectedModelStore(
    (state) => state.setSelectedModel,
  );
  const router = useRouter();

  async function getData() {
    const newData = await getModelsForUser();
    setData(newData);
  }

  useEffect(() => {
    getData();
  }, []);
  //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
  const columns = useMemo<MRT_ColumnDef<Models>[]>(
    () => [
      {
        accessorKey: 'nombre', //simple recommended way to define a column
        header: 'Nombre',
      },
      {
        accessorKey: 'descripcion', //simple recommended way to define a column
        header: 'Descripción',
      },
      {
        accessorKey: 'iliname', //simple recommended way to define a column
        header: 'Iliname',
      },
    ],
    [],
  );

  return (
    //pass table options to useMaterialReactTable
    <React.Fragment>
      <Typography
        variant="h4"
        component={'h1'}
        color="inherit"
        sx={{
          textAlign: 'center',
        }}
      >
        Modelos
      </Typography>
      <MaterialReactTable
        columns={columns}
        data={data}
        /* state={{
          isLoading: loading,
          showProgressBars: false,
          showSkeletons: false
        }} */
        enableRowSelection
        enableRowActions
        positionActionsColumn="last"
        enableSelectAll={false}
        enableMultiRowSelection={false}
        enableColumnResizing
        layoutMode="grid"
        positionToolbarAlertBanner="bottom"
        enableGlobalFilter // turn off a feature
        muiTableBodyRowProps={({ row }) => ({
          onClick: row.getToggleSelectedHandler(),
          sx: {
            cursor: 'pointer',
          },
        })}
        renderRowActions={({ row }) => (
          <Box component={'div'}>
            <Tooltip title="Editar modelo">
              <IconButton
                onClick={() => {
                  setSelectedModel(row.original);
                  router.push('/dashboard/models/edit');
                }}
              >
                <EditIcon color="info" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={({ table }) => {
          const handleDelete = () => {
            table.getSelectedRowModel().flatRows.map(async (row) => {
              // Mostrar Alerta
              if (window.confirm('¿Desea eliminar el modelo?')) {
                const res: ContentResponse = await deleteModel(row.original.id);
                if (res.error) {
                  toast.error(`${res.message}${res.error}`);
                } else {
                  toast.success(`${res.message}`);
                  getData();
                }
              }
            });
          };
          const handleEdit = () => {
            table.getSelectedRowModel().flatRows.map((row) => {
              setSelectedModel(row.original);
              // router.push('/dashboard/models/edit')
              router.push('/dashboard/rules');
            });
          };

          return (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                color="error"
                disabled={
                  data?.length <= 1
                    ? !table.getIsAllRowsSelected()
                    : !table.getIsSomeRowsSelected()
                }
                onClick={handleDelete}
                variant="contained"
                startIcon={<DeleteIcon />}
              >
                Eliminar
              </Button>

              <Button
                color="info"
                disabled={
                  data?.length <= 1
                    ? !table.getIsAllRowsSelected()
                    : !table.getIsSomeRowsSelected()
                }
                onClick={handleEdit}
                variant="contained"
                startIcon={<VisibilityIcon />}
              >
                Ver reglas
              </Button>

              <Button
                color="success"
                onClick={() => router.push('/dashboard/models/create')}
                variant="contained"
                endIcon={<AddIcon />}
              >
                Crear modelo
              </Button>
            </div>
          );
        }}
      />
    </React.Fragment>
  );
}
