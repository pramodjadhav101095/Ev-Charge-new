import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, List, ListItem, ListItemText, ListItemIcon, Divider, CircularProgress } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HistoryIcon from '@mui/icons-material/History';
import { getUserTransactions } from '../../api/paymentApi';

interface Transaction {
    id: number;
    bookingId: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
}

const Payments: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Mock user ID 1
                const response = await getUserTransactions(1);
                setTransactions(response.data);
            } catch (err) {
                console.error('Failed to fetch transactions', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const formatDateTime = (dateTimeStr: string) => {
        try {
            const date = new Date(dateTimeStr);
            return date.toLocaleString();
        } catch {
            return dateTimeStr;
        }
    };

    return (
        <Box>
            <Typography variant="h4" mb={3}>Payments</Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Payment Methods</Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon><CreditCardIcon /></ListItemIcon>
                                    <ListItemText primary="Visa ending in 4242" secondary="Expires 12/26" />
                                    <Button size="small" color="error">Remove</Button>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemIcon><CreditCardIcon /></ListItemIcon>
                                    <ListItemText primary="Mastercard ending in 8888" secondary="Expires 10/27" />
                                    <Button size="small" color="error">Remove</Button>
                                </ListItem>
                            </List>
                            <Button variant="outlined" fullWidth sx={{ mt: 2 }} startIcon={<CreditCardIcon />}>
                                Add New Card
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Transaction History</Typography>
                            {loading ? (
                                <Box display="flex" justifyContent="center" my={4}>
                                    <CircularProgress size={30} />
                                </Box>
                            ) : transactions.length === 0 ? (
                                <Typography color="textSecondary" my={2}>No transactions found.</Typography>
                            ) : (
                                <List>
                                    {transactions.map((txn, index) => (
                                        <React.Fragment key={txn.id}>
                                            {index > 0 && <Divider />}
                                            <ListItem>
                                                <ListItemIcon><HistoryIcon /></ListItemIcon>
                                                <ListItemText 
                                                    primary={`Booking #${txn.bookingId}`} 
                                                    secondary={`${formatDateTime(txn.createdAt)} — ${txn.currency} ${txn.amount} [${txn.status}]`} 
                                                />
                                            </ListItem>
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Payments;
