import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface ErrorModalProps {
    open: boolean;
    handleClose: () => void;
    message: string;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const ErrorModal: React.FC<ErrorModalProps> = ({ open, handleClose, message }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" color="error">
                    Error
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {message}
                </Typography>
                <Box textAlign="right" mt={3}>
                    <Button onClick={handleClose} variant="contained" color="primary">
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ErrorModal;
