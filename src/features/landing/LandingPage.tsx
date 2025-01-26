import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container, Grid, Typography, Accordion, AccordionSummary, AccordionDetails, Divider, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import GroupIcon from '@mui/icons-material/Group';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import QrCodeIcon from '@mui/icons-material/QrCode';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { StarryBackground } from '../../components/StarryBackground';
import { AppBar } from './AppBar';
import { ReactElement } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Hero } from './Hero';
import { TitleUnderline } from '../../components/common/TitleUnderline';

interface Feature {
  icon: ReactElement;
  title: string;
  description: string;
}

const howItWorks = [
  {
    title: 'Create a Tab',
    description: 'Start a Tab in seconds—name it, add a description, and generate a unique QR code or Tab ID to share with friends.',
    icon: <QrCodeIcon className="text-4xl mb-4 text-purple-300" />
  },
  {
    title: 'Invite & Join',
    description: 'Friends can join your Tab by scanning the QR code or entering the Tab ID. They\'ll see their name and profile picture automatically when they join.',
    icon: <GroupIcon className="text-4xl mb-4 text-purple-300" />
  },
  {
    title: 'Add Expenses',
    description: 'Everyone in the Tab can input what they paid for. TidyTab does the math instantly, recalculating who owes what in real time.',
    icon: <ReceiptIcon className="text-4xl mb-4 text-purple-300" />
  },
  {
    title: 'Track Payments',
    description: 'The Tab stays open until the host closes it. Monitor who\'s paid, who hasn\'t, and send friendly reminders with just one click.',
    icon: <AutoGraphIcon className="text-4xl mb-4 text-purple-300" />
  }
];

const features: Feature[] = [
  {
    icon: <AutoGraphIcon />,
    title: 'Real-Time Splitting',
    description: 'No calculators needed. TidyTab recalculates everyone\'s share live, even if someone opts out of an expense.',
  },
  {
    icon: <QrCodeIcon />,
    title: 'Quick Join',
    description: 'Use a QR code or Tab ID to instantly join Tabs. It\'s simple, fast, and hassle-free.',
  },
  {
    icon: <ReceiptIcon />,
    title: 'Smart Bill Upload',
    description: 'Upload receipts, and TidyTab\'s AI will split itemized expenses automatically.',
  },
  {
    icon: <AutoGraphIcon />,
    title: 'Expense Analytics',
    description: 'See insights like who spends the most on drinks or who\'s the fastest payer. Make group expenses fun, not boring.',
  },
  {
    icon: <NotificationsActiveIcon />,
    title: 'Smart Reminders',
    description: 'Send automatic reminders to friends who still owe you. Friendly nudges, not awkward conversations.',
  },
  {
    icon: <CurrencyExchangeIcon />,
    title: 'Currency Support',
    description: 'Splitting expenses on an international trip? TidyTab handles currency conversions with ease.',
  }
];

const testimonials = [
  {
    quote: "TidyTab saved our road trip! We used TidyTab to split costs for gas, hotels, and food—it was so easy to keep track of everything.",
    author: "Sarah",
    title: "TidyTab User"
  },
  {
    quote: "I love the reminders feature. No more nagging my friends to pay me back!",
    author: "Emily",
    title: "TidyTab User"
  },
  {
    quote: "Our Tab recap said I spent the most on desserts 🍰. Guilty as charged!",
    author: "Timmy",
    title: "TidyTab User"
  }
];

const faqs = [
  {
    question: "How does TidyTab ensure privacy?",
    answer: "We use secure Firebase Authentication to protect your data, and all payment details are encrypted."
  },
  {
    question: "Can I track manual payments (e.g., cash)?",
    answer: "Yes! You can manually mark payments as completed in the app."
  },
  {
    question: "Is TidyTab free to use?",
    answer: "Absolutely. Core features are completely free, with optional upgrades coming soon."
  },
  {
    question: "Does it work internationally?",
    answer: "Yes, TidyTab supports multi-currency expenses and converts rates automatically."
  }
];

const Features = () => {
  return (
    <Box
      id="features"
      sx={{
        py: { xs: 8, md: 12 },
        px: 3,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(179, 157, 219, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} textAlign="center" mb={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Typography
                component="h2"
                variant="h2"
                className="gradient-text"
                sx={{ 
                  mb: 2, 
                  fontWeight: 700,
                  position: 'relative',
                  display: 'inline-block'
                }}
              >
                Key Features
                <TitleUnderline />
              </Typography>
              <Typography
                variant="h5"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  maxWidth: '800px', 
                  mx: 'auto',
                  mt: 3
                }}
              >
                Everything you need to manage group expenses efficiently
              </Typography>
            </motion.div>
          </Grid>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="glass-card"
                style={{
                  height: '100%',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Hover effect background */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(179, 157, 219, 0.05) 0%, rgba(111, 66, 193, 0.05) 100%)',
                    borderRadius: 'inherit',
                    zIndex: 0
                  }}
                />
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    mb: 3,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(179, 157, 219, 0.1)',
                      borderRadius: '12px',
                      padding: '10px',
                      '& .MuiSvgIcon-root': {
                        fontSize: '1.75rem',
                        color: 'rgba(179, 157, 219, 1)',
                        flexShrink: 0
                      }
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '1.125rem',
                      color: 'white',
                      lineHeight: 1.2
                    }}
                  >
                    {feature.title}
                  </Typography>
                </Box>
                <Typography 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    flex: 1,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  {feature.description}
                </Typography>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const Testimonials = () => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        px: 3,
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(179, 157, 219, 0.05) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(179, 157, 219, 0.2), transparent)'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(179, 157, 219, 0.2), transparent)'
        }}
      />
      
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} textAlign="center" mb={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Typography
                component="h2"
                variant="h2"
                className="gradient-text"
                sx={{ 
                  mb: 2, 
                  fontWeight: 700,
                  position: 'relative',
                  display: 'inline-block'
                }}
              >
                What People Are Saying
                <TitleUnderline />
              </Typography>
              <Typography
                variant="h5"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  maxWidth: '800px', 
                  mx: 'auto',
                  mt: 3
                }}
              >
                Join thousands of happy users who trust TidyTab
              </Typography>
            </motion.div>
          </Grid>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="glass-card"
                style={{
                  height: '100%',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Quote mark decoration */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    fontSize: '4rem',
                    lineHeight: 1,
                    fontFamily: 'serif',
                    color: 'rgba(179, 157, 219, 0.1)',
                    pointerEvents: 'none'
                  }}
                >
                  "
                </Box>
                
                {/* Hover effect background */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(179, 157, 219, 0.05) 0%, rgba(111, 66, 193, 0.05) 100%)',
                    borderRadius: 'inherit',
                    zIndex: 0
                  }}
                />
                
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    flex: 1,
                    mb: 4,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  "{testimonial.quote}"
                </Typography>
                
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography 
                    variant="h6" 
                    className="gradient-text" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '1.125rem',
                      mb: 0.5
                    }}
                  >
                    {testimonial.author}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.95rem'
                    }}
                  >
                    {testimonial.title}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const FAQ = () => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        px: 3,
        background: 'linear-gradient(180deg, rgba(179, 157, 219, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '-10%',
          width: '20rem',
          height: '20rem',
          background: 'radial-gradient(circle, rgba(179, 157, 219, 0.03) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          transform: 'rotate(-15deg)'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '-5%',
          width: '15rem',
          height: '15rem',
          background: 'radial-gradient(circle, rgba(111, 66, 193, 0.03) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          transform: 'rotate(15deg)'
        }}
      />
      
      <Container maxWidth="lg">
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} textAlign="center" mb={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Typography
                component="h2"
                variant="h2"
                className="gradient-text"
                sx={{ 
                  mb: 2, 
                  fontWeight: 700,
                  position: 'relative',
                  display: 'inline-block'
                }}
              >
                Frequently Asked Questions
                <TitleUnderline />
              </Typography>
              <Typography
                variant="h5"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  maxWidth: '800px', 
                  mx: 'auto',
                  mt: 3
                }}
              >
                Got questions? We've got answers
              </Typography>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={8}>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Accordion
                  className="glass-card"
                  sx={{
                    background: 'transparent',
                    mb: 2,
                    '&:before': {
                      display: 'none',
                    },
                    '& .MuiAccordionSummary-root': {
                      minHeight: 64,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.03)',
                      }
                    },
                    '& .MuiAccordionSummary-expandIconWrapper': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      transition: 'transform 0.3s ease',
                      '&.Mui-expanded': {
                        transform: 'rotate(180deg)'
                      }
                    },
                    '& .MuiCollapse-root': {
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <AccordionSummary 
                    expandIcon={
                      <ExpandMoreIcon 
                        sx={{
                          fontSize: '1.5rem',
                          color: 'rgba(179, 157, 219, 0.7)'
                        }}
                      />
                    }
                    sx={{
                      px: 3,
                      py: 1,
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white',
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        transition: 'color 0.3s ease',
                        '&:hover': {
                          color: 'rgba(179, 157, 219, 1)'
                        }
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails 
                    sx={{ 
                      px: 3, 
                      pb: 3,
                      background: 'rgba(255, 255, 255, 0.02)'
                    }}
                  >
                    <Typography 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.95rem',
                        lineHeight: 1.6
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export const LandingPage = () => {
  const { user } = useAuth();

  return (
    <Box className="min-h-screen relative">
      <StarryBackground />
      <CssBaseline />
      {!user && <AppBar />}
      
      <Hero />
      <Features />
      <Divider sx={{ opacity: 0.1 }} />
      <Testimonials />
      <Divider sx={{ opacity: 0.1 }} />
      <FAQ />
      
      {/* Final CTA Section */}
      <Box
        sx={{
          py: { xs: 10, md: 16 },
          px: 3,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(179, 157, 219, 0.05) 100%)',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card relative"
            style={{
              padding: '3rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              borderRadius: '24px',
              overflow: 'hidden'
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: '-50%',
                left: '-25%',
                width: '150%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(179, 157, 219, 0.1) 0%, rgba(179, 157, 219, 0) 70%)',
                pointerEvents: 'none',
                transform: 'rotate(-15deg)',
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="h2"
                className="hero-gradient-text"
                sx={{ 
                  mb: 3, 
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2
                }}
              >
                Ready to Get Started?
              </Typography>
              <Typography
                sx={{ 
                  mb: 5, 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Join thousands of users who trust TidyTab for their group expenses. Start splitting bills, not friendships today.
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 3, 
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}
              >
                <Link to="/login" className="primary-button">
                  Get Started Free
                </Link>
                <Link to="#features" className="glass-button">
                  See Features
                </Link>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}; 
