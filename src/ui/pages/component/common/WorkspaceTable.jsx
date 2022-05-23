import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material';
import themeDefault from '../../../theme/theme';

const WorkspaceTable = () => {
    return (
        <ThemeProvider theme={themeDefault}>
            <Typography variant='body1'>Visit Workspaces</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant='subtitle2'>Name</Typography>
                            </TableCell>
                            <TableCell align="left">
                                <Typography variant='subtitle2'>Action</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    Workspace Name
                                </TableCell>
                                <TableCell align="left">
                                    <Button variant="contained">
                                        <Typography variant="button">View</Typography>
                                    </Button>
                                </TableCell>
                            </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </ThemeProvider>

    )
}

export default WorkspaceTable;