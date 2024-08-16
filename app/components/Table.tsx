'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  type MRT_ColumnDef, //if using TypeScript (optional, but recommended)
} from 'material-react-table';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { getTaskForUser } from '../lib/history/actions';
import { useRouter } from 'next/navigation';
import { ContentResponse, type Task } from '../types/types';
import { deleteTask } from '../lib/history/actions';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import IconButton from '@mui/material/IconButton/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {
  BASE_URL_PUBLIC,
  PATH_GET_LOG,
  PATH_GET_REPORT_PDF,
} from '@/app/config';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LoopIcon from '@mui/icons-material/Loop';
import ErrorIcon from '@mui/icons-material/Error';
import { toast } from 'sonner';
import { keyframes } from '@emotion/react';
import { format } from '@formkit/tempo';

const TIMER_TO_OBTAIN_NEW_DATA = 60000; // 1 min

export enum StatusType {
  COMPLETED = 'Completado',
  PENDING = 'Pendiente',
  IN_PROCESS = 'En proceso',
  ERROR = 'Error',
}

export const spinerAnimation = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

export default function TableComponent() {
  const [data, setData] = useState<Task[]>([]);
  const router = useRouter();

  async function getData() {
    const fetchData = await getTaskForUser();
    if (fetchData?.error) {
      toast.error(`${fetchData.error}`);
      return;
    }
    setData(fetchData.data);
  }

  useEffect(() => {
    getData();

    const showData = setInterval(() => {
      getData();
    }, TIMER_TO_OBTAIN_NEW_DATA);
    return () => {
      clearInterval(showData);
    };
  }, []);

  const dataParser = data?.map((item) => {
    return {
      ...item,
      fecha_inicio: item.fecha_inicio
        ? format(item.fecha_inicio, 'dddd, MMMM D, YYYY HH:mm:ss', 'es')
        : '',
      fecha_finalizacion: item.fecha_finalizacion
        ? format(item.fecha_finalizacion, 'dddd, MMMM D, YYYY HH:mm:ss', 'es')
        : '',
    };
  });

  //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
  const columns = useMemo<MRT_ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: 'nombre', //simple recommended way to define a column
        header: 'Nombre tarea',
        /* enableHiding: false, */ //disable a feature for this column
      },
      {
        accessorKey: 'fecha_inicio', //simple recommended way to define a column
        header: 'Fecha inicio',
        /* enableHiding: false */ //disable a feature for this column
      },
      {
        accessorKey: 'fecha_finalizacion', //simple recommended way to define a column
        header: 'Fecha fin',
        /* enableHiding: false */ //disable a feature for this column
      },
      {
        accessorKey: 'estado', //simple recommended way to define a column
        header: 'Estado',
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                (cell.getValue<string>() === StatusType.COMPLETED &&
                  theme.palette.success.dark) ||
                (cell.getValue<string>() === StatusType.PENDING &&
                  theme.palette.warning.dark) ||
                (cell.getValue<string>() === StatusType.IN_PROCESS &&
                  theme.palette.info.dark) ||
                (cell.getValue<string>() === StatusType.ERROR &&
                  theme.palette.error.dark) ||
                '',
              borderRadius: '0.25rem',
              color: '#fff',
              maxWidth: '12ch',
              p: '0.25rem',
            })}
          >
            {cell.getValue<number>()?.toLocaleString?.('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Box>
        ),
        /* enableHiding: false */ //disable a feature for this column
      },
    ],
    [],
  );

  return (
    //pass table options to useMaterialReactTable
    <MaterialReactTable
      columns={columns}
      data={dataParser}
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
          {row.original.estado === StatusType.COMPLETED && (
            <>
              <Tooltip title="Descargar reporte">
                <IconButton
                  onClick={() => {
                    const anchorHTML = document.createElement('a');
                    anchorHTML.href = `${BASE_URL_PUBLIC}${PATH_GET_REPORT_PDF.replace('<pk>', row.original.id.toString())}`;
                    anchorHTML.download = '';
                    anchorHTML.click();
                  }}
                >
                  <PictureAsPdfIcon
                    sx={{
                      ':hover': {
                        color: 'red',
                      },
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Descargar Log">
                <IconButton
                  onClick={() => {
                    const anchorHTML = document.createElement('a');
                    anchorHTML.href = `${BASE_URL_PUBLIC}${PATH_GET_LOG.replace('<pk>', row.original.id.toString())}`;
                    anchorHTML.download = '';
                    anchorHTML.click();
                  }}
                >
                  <LibraryBooksIcon
                    sx={{
                      ':hover': {
                        color: 'red',
                      },
                    }}
                  />
                </IconButton>
              </Tooltip>
            </>
          )}
          {row.original.estado !== StatusType.ERROR &&
            row.original.estado !== StatusType.COMPLETED && (
              <Tooltip title="Trabajando...">
                <IconButton>
                  <LoopIcon
                    sx={{
                      animation: `${spinerAnimation} 1s linear infinite`,
                      animationDirection: 'reverse',
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}
          {row.original.estado === StatusType.ERROR && (
            <>
              <Tooltip title="Ocurrio un error">
                <IconButton>
                  <ErrorIcon color="error" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Descargar Log">
                <IconButton
                  onClick={() => {
                    const anchorHTML = document.createElement('a');
                    anchorHTML.href = `${BASE_URL_PUBLIC}${PATH_GET_LOG.replace('<pk>', row.original.id.toString())}`;
                    anchorHTML.download = '';
                    anchorHTML.click();
                  }}
                >
                  <LibraryBooksIcon
                    sx={{
                      ':hover': {
                        color: 'red',
                      },
                    }}
                  />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      )}
      renderTopToolbarCustomActions={({ table }) => {
        const handleDelete = () => {
          table.getSelectedRowModel().flatRows.map(async (row) => {
            // Mostrar Alerta
            if (window.confirm('¿Desea eliminar el modelo?')) {
              const res = (await deleteTask(
                row.original.id,
              )) as ContentResponse;
              if (res.error) {
                toast.error(`${res.message} ${res.error}`);
              } else {
                toast.success(`${res.message} ${row.original.nombre}`);
                getData();
              }
            }
            return null;
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
              color="success"
              disabled={table.getIsSomeRowsSelected()}
              onClick={() => router.push('/dashboard')}
              variant="contained"
              endIcon={<AddIcon />}
            >
              Nueva tarea
            </Button>
          </div>
        );
      }}
    />
  );
}
