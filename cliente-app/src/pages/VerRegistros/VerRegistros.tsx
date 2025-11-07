import { useState, useEffect, useMemo } from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box, Paper, Typography, CircularProgress, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useNotification } from '../../contexts/NotificationContext';
import './VerRegistros.css';
import { clienteService } from '../../api/cliente.service';
import type { ClienteResponseEntity } from '../../../api-client';

export function VerRegistros() {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [registros, setRegistros] = useState<ClienteResponseEntity[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filteredRows, setFilteredRows] = useState<ClienteResponseEntity[]>([]);

  useEffect(() => {
    cargarRegistros();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredRows(registros);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtered = registros.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchLower)
        )
      );
      setFilteredRows(filtered);
    }
  }, [searchText, registros]);

  const cargarRegistros = async () => {
    setLoading(true);
    try {
      const data = await clienteService.clientes();
      setRegistros(data);
      setFilteredRows(data);
    } catch (error: any) {
      console.error('Error al cargar los registros:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al cargar los registros';
      showNotification('error', errorMessage, 'Error');
      setRegistros([]);
      setFilteredRows([]);
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'documento',
        headerName: 'Documento',
        width: 150,
        flex: 0,
      },
      {
        field: 'nombres',
        headerName: 'Nombres',
        width: 250,
        flex: 1,
      },
      {
        field: 'email',
        headerName: 'Email',
        width: 250,
        flex: 1,
      },
      {
        field: 'celular',
        headerName: 'Celular',
        width: 150,
        flex: 0,
      },
      {
        field: 'saldo',
        headerName: 'Saldo',
        width: 150,
        flex: 0,
        valueFormatter: (value: string | null | undefined) => {
          if (!value) return '$0';
          const saldoNum = parseFloat(value);
          if (isNaN(saldoNum)) return '$0';
          return `$${saldoNum.toLocaleString('es-CO')}`;
        },
        cellClassName: 'saldo-cell',
      },
      {
        field: 'createdAt',
        headerName: 'Fecha Registro',
        width: 180,
        flex: 0,
        valueFormatter: (value: string | null | undefined) => {
          if (!value) return '';
          return new Date(value).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        },
      },
    ],
    []
  );

  return (
    <Box className="ver-registros">
      <Box className="registros-header">
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>
          Registros de Clientes
        </Typography>
        <Typography variant="body1" sx={{ color: '#6b7280', mb: 3 }}>
          Lista de todos los clientes registrados en la billetera virtual
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar en todos los campos..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              '& fieldset': {
                borderColor: '#e5e7eb',
                borderWidth: '2px',
              },
              '&:hover fieldset': {
                borderColor: '#C8102E',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#C8102E',
                borderWidth: '2px',
              },
            },
            '& .MuiInputBase-input': {
              padding: '14px 16px',
              fontSize: '15px',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#6b7280' }} />
              </InputAdornment>
            ),
            endAdornment: searchText && (
              <InputAdornment position="end">
                <Box
                  component="button"
                  onClick={() => setSearchText('')}
                  sx={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    borderRadius: '50%',
                    '&:hover': {
                      backgroundColor: '#f3f4f6',
                    },
                  }}
                >
                  <ClearIcon sx={{ color: '#6b7280', fontSize: '20px' }} />
                </Box>
              </InputAdornment>
            ),
          }}
        />
        {searchText && (
          <Typography variant="body2" sx={{ mt: 1, color: '#6b7280', ml: 1 }}>
            {filteredRows.length} resultado{filteredRows.length !== 1 ? 's' : ''} encontrado{filteredRows.length !== 1 ? 's' : ''}
          </Typography>
        )}
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: 0,
          height: 650,
          width: '100%',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CircularProgress sx={{ color: '#C8102E' }} />
          </Box>
        ) : (
          <DataGrid
            rows={filteredRows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
              sorting: {
                sortModel: [{ field: 'createdAt', sort: 'desc' }],
              },
            }}
            getRowId={(row) => row.id.toString()}
            pageSizeOptions={[5, 10, 25, 50]}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f3f4f6',
                fontSize: '14px',
                padding: '16px',
                color: '#374151',
                '&:focus': {
                  outline: 'none',
                },
                '&:focus-within': {
                  outline: 'none',
                },
              },
              '& .MuiDataGrid-columnHeaders': {
                color: 'white',
                fontWeight: 700,
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                minHeight: '56px !important',
                '& .MuiDataGrid-columnHeader': {
                background: 'linear-gradient(357deg, rgb(165 52 64) 0%, rgb(225, 17, 28) 100%)',
                  padding: '0 16px',
                  '&:focus': {
                    outline: 'none',
                  },
                  '&:focus-within': {
                    outline: 'none',
                  },
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                },
                '& .MuiDataGrid-iconButtonContainer': {
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                  },
                },
                '& .MuiDataGrid-sortIcon': {
                  color: '#ffffff',
                },
                '& .MuiDataGrid-menuIcon': {
                  color: '#ffffff',
                },
              },
              '& .MuiDataGrid-row': {
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#fef2f2',
                  transform: 'translateX(2px)',
                  boxShadow: '0 2px 4px rgba(200, 16, 46, 0.1)',
                },
                '&:nth-of-type(even)': {
                  backgroundColor: '#fafafa',
                },
                '&:nth-of-type(even):hover': {
                  backgroundColor: '#fef2f2',
                },
                '&.Mui-selected': {
                  backgroundColor: '#fef2f2',
                  '&:hover': {
                    backgroundColor: '#fef2f2',
                  },
                },
              },
              '& .saldo-cell': {
                fontWeight: 700,
                color: '#059669',
                fontSize: '15px',
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '2px solid #e5e7eb',
                backgroundColor: '#ffffff',
                minHeight: '64px',
                '& .MuiTablePagination-root': {
                  color: '#374151',
                },
                '& .MuiTablePagination-selectLabel': {
                  fontSize: '14px',
                  fontWeight: 500,
                },
                '& .MuiTablePagination-displayedRows': {
                  fontSize: '14px',
                  fontWeight: 500,
                },
              },
              '& .MuiDataGrid-pagination': {
                '& .MuiIconButton-root': {
                  color: '#6b7280',
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                    color: '#C8102E',
                  },
                  '&.Mui-disabled': {
                    color: '#d1d5db',
                  },
                },
                '& .Mui-selected': {
                  backgroundColor: '#C8102E',
                  color: '#ffffff',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#a00d25',
                  },
                },
              },
              '& .MuiDataGrid-scrollbar': {
                '& .MuiDataGrid-scrollbar--vertical': {
                  '& .MuiDataGrid-scrollbar--thumb': {
                    backgroundColor: '#C8102E',
                    '&:hover': {
                      backgroundColor: '#a00d25',
                    },
                  },
                },
              },
            }}
          />
        )}
      </Paper>
    </Box>
  );
}

