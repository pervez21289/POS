import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Button,
    Stack,
    Chip,
    Typography,
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';

const KOTManager = ({ open, onClose, drafts, onLoad, onDelete, onPrintKOT }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Saved Orders (KOTs)</DialogTitle>
            <DialogContent dividers>
                {drafts.length === 0 ? (
                    <Typography color="text.secondary">No saved orders</Typography>
                ) : (
                    <List>
                        {drafts.map((draft) => (
                            <ListItem
                                key={draft.tableNo}
                                secondaryAction={
                                    <Stack direction="row" spacing={1}>
                                        <IconButton
                                            edge="end"
                                            onClick={() => onPrintKOT?.({
                                                tableNo: draft.tableNo,
                                                items: draft.saleItems,
                                                kotNo: draft.kotNo,
                                            })}
                                            color="primary"
                                        >
                                            <PrintIcon />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            onClick={() => onLoad(draft.tableNo)}
                                        >
                                            <RestoreIcon />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            onClick={() => onDelete(draft.tableNo)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                }
                            >
                                <ListItemText
                                    primary={
                                        <Chip
                                            label={`Table ${draft.tableNo}`}
                                            size="small"
                                            color="primary"
                                        />
                                    }
                                    secondary={`${draft.saleItems?.length || 0} items • ${new Date(
                                        draft.savedAt
                                    ).toLocaleString()}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default KOTManager;