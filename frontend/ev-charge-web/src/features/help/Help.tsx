import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Container, Paper, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const faqs = [
    { question: 'How do I book a charging slot?', answer: 'Navigate to the Dashboard or Stations page, select a station, and click "Book Slot". Follow the steps to choose a time and pay.' },
    { question: 'What payment methods are accepted?', answer: 'We accept all major credit and debit cards securely via Stripe.' },
    { question: 'Can I cancel my booking?', answer: 'Yes, you can cancel your booking from the "Bookings" page. Refunds are processed according to our cancellation policy.' },
    { question: 'How do I report a broken charger?', answer: 'Please use the "Contact Support" button below or email support@evcharge.com with the station name and issue.' },
];

const Help: React.FC = () => {
    return (
        <Container maxWidth="md">
            <Box textAlign="center" mb={5}>
                <Typography variant="h4" gutterBottom>Help Center</Typography>
                <Typography color="text.secondary">Frequently asked questions and support</Typography>
            </Box>

            <Box mb={4}>
                {faqs.map((faq, index) => (
                    <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography fontWeight="medium">{faq.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography color="text.secondary">{faq.answer}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <SupportAgentIcon sx={{ fontSize: 50, mb: 1 }} />
                <Typography variant="h6" gutterBottom>Still need help?</Typography>
                <Typography paragraph>Our support team is available 24/7 to assist you.</Typography>
                <Button variant="contained" color="secondary">Contact Support</Button>
            </Paper>
        </Container>
    );
};

export default Help;
