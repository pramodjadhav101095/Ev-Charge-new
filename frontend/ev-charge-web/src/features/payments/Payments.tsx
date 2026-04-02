import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HistoryIcon from '@mui/icons-material/History';

const Payments: React.FC = () => {
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
                                    <ListItemText primary="Visa ending in 4242" secondary="Expires 12/24" />
                                    <Button size="small" color="error">Remove</Button>
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemIcon><CreditCardIcon /></ListItemIcon>
                                    <ListItemText primary="Mastercard ending in 8888" secondary="Expires 10/25" />
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
                            <List>
                                <ListItem>
                                    <ListItemIcon><HistoryIcon /></ListItemIcon>
                                    <ListItemText primary="Tech Park Station A" secondary="Nov 20, 2023 - $15.00" />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemIcon><HistoryIcon /></ListItemIcon>
                                    <ListItemText primary="City Mall Charger" secondary="Nov 18, 2023 - $12.50" />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Payments;
