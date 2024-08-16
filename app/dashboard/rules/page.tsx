'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  type MRT_ColumnDef, //if using TypeScript (optional, but recommended)
} from 'material-react-table';
import Button from '@mui/material/Button';
import { deleteRule, getRulesForModel } from '@/app/lib/rule/actions';
import { useRouter } from 'next/navigation';
import { type Rules } from '@/app/types/types';
import Typography from '@mui/material/Typography';
import {
  useSelectedModelStore,
  useSelectedRuleStore,
} from '@/app/context/store';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'sonner';

//mock data - strongly typed if you are using TypeScript (optional, but recommended)

export default function RulesPage() {
  const [data, setData] = useState<Rules[]>([]);
  const model = useSelectedModelStore((state) => state.model);
  const setSelectedRule = useSelectedRuleStore(
    (state) => state.setSelectedRule,
  );
  const router = useRouter();

  async function getData() {
    if (!model?.id) {
      return;
    }
    const newData = await getRulesForModel(model?.id);
    setData(newData);
  }

  useEffect(() => {
    if (!model?.id) {
      router.push('/dashboard/models');
      return;
    }
    getData();
  }, [model]);
  //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
  const columns = useMemo<MRT_ColumnDef<Rules>[]>(
    () => [
      {
        accessorKey: 'nombre', //simple recommended way to define a column
        header: 'Nombre',
      },
      {
        accessorKey: 'descripcion', //simple recommended way to define a column
        header: 'Descripción',
      },
    ],
    [],
  );

  return (
    //pass table options to useMaterialReactTable
    <React.Fragment>
      <Box
        component={'section'}
        sx={{
          my: 2,
          borderLeft: '2px solid green',
          pl: 2,
          textAlign: 'center',
        }}
      >
        <Card sx={{ minWidth: 275 }}>
          <CardContent
            sx={{
              display: 'flex',
            }}
          >
            <Box
              component={'div'}
              sx={{
                marginY: 'auto',
              }}
            >
              <Tooltip title="Regresar">
                <IconButton aria-label="Regresar" onClick={() => router.back()}>
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box
              component={'div'}
              sx={{
                flexGrow: 1,
                textAlign: 'center',
                mr: 7,
              }}
            >
              <Typography gutterBottom variant="h5" component="div">
                {model?.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Descripción:</strong> {model?.descripcion}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Iliname:</strong> {model?.iliname}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Typography
        variant="h4"
        component={'h1'}
        color="inherit"
        sx={{
          textAlign: 'left',
          my: 4,
        }}
      >
        Reglas
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
        renderTopToolbarCustomActions={({ table }) => {
          const handleDelete = () => {
            table.getSelectedRowModel().flatRows.map(async (row) => {
              // Mostrar Alerta
              if (window.confirm('¿Desea eliminar la regla?')) {
                const res = await deleteRule(row.original.id);
                if (res.error) {
                  toast.error(`${res.message}${res.error}`);
                } else {
                  toast.success(res.message);
                  getData();
                }
              }
            });
          };
          const handleEdit = () => {
            table.getSelectedRowModel().flatRows.map((row) => {
              setSelectedRule(row.original.id);
              router.push('/dashboard/rules/edit');
              return;
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
                startIcon={<EditIcon />}
              >
                Editar
              </Button>

              <Button
                color="success"
                onClick={() => router.push('/dashboard/rules/create')}
                variant="contained"
                endIcon={<AddIcon />}
              >
                Crear regla
              </Button>
            </div>
          );
        }}
      />
    </React.Fragment>
  );
}
