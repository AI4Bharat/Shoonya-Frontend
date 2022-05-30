import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material';
import themeDefault from '../../../theme/theme';
import { workspaceData } from '../../../../constants/workspaceData/workspaceData';
import CustomButton from '../../component/common/Button'

const WorkspaceTable = () => {
    return (
        // <ThemeProvider theme={themeDefault}>
            <TableContainer sx={{ width: window.innerWidth * 0.8, padding: 2 }} component={Paper}>
                <Table sx={{ width: window.innerWidth * 0.8 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant='subtitle2'>Name</Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography variant='subtitle2'>Action</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workspaceData.map((el, i) => {
                            return (
                                <TableRow
                                    key={el.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {el.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        <CustomButton
                                            label = "View"
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={10}
                                rowsPerPage={5}
                                page={1}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={() => null}
                                onRowsPerPageChange={() => null}
                                ActionsComponent={() => null}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        // </ThemeProvider>

    )
}

export default WorkspaceTable;