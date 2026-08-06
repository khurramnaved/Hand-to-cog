// =============================================
// Hand-To-Cog AI — Sidebar Component
// =============================================

import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  MenuOpen,
  Menu as MenuIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

const DRAWER_WIDTH = 280;
const COLLAPSED_DRAWER_WIDTH = 80;

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { user } = useAuth();
  
  // Desktop collapsed state
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['teacher', 'admin', 'principal'] },
    { text: 'Students', icon: <PeopleIcon />, path: '/students', roles: ['teacher', 'admin', 'principal'] },
    { text: 'Screenings', icon: <AssessmentIcon />, path: '/screenings', roles: ['teacher', 'admin', 'principal'] },
    { text: 'User Management', icon: <SettingsIcon />, path: '/users', roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter((item) => user && item.roles.includes(user.role));

  const drawerContent = (
    <Box sx={{ h: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', height: 80 }}>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}
            >
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                ✋
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, whiteSpace: 'nowrap' }} className="gradient-text">
                Hand-To-Cog
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isMobile && (
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)} size="small">
            {isCollapsed ? <MenuIcon /> : <MenuOpen />}
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

      <List sx={{ px: 2, py: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {filteredNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={isMobile ? onMobileClose : undefined}
                sx={{
                  minHeight: 48,
                  justifyContent: isCollapsed && !isMobile ? 'center' : 'initial',
                  px: 2.5,
                  borderRadius: 2,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? '#fff' : 'text.secondary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isCollapsed && !isMobile ? 0 : 2,
                    justifyContent: 'center',
                    color: 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {(!isCollapsed || isMobile) && (
                  <ListItemText primary={<Typography sx={{ fontWeight: isActive ? 600 : 500 }}>{item.text}</Typography>} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH }, flexShrink: { md: 0 }, transition: 'width 0.3s ease' }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
            transition: 'width 0.3s ease',
            borderRight: '1px solid rgba(255,255,255,0.05)',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
