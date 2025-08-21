// return (
//     <Box display="flex" minHeight="100vh">
//       <Sidebar />
//       <Box flex={1} display="flex" flexDirection="column" sx={{ minWidth: 0 }}>
//         <NavBar notificationCount={5} />
        
//         <Box component="main" sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, backgroundColor: mode === 'dark' ? '#1a1a1a' : '#f5f5f5' }}>
//           {/* Dashboard Statistics Cards */}
          
//           <Box display="flex" flexDirection="row" gap={3} mb={4} sx={{ ml: { xs: 0, md: '260px' } }}>
//             {getCardData().map((cardData) => (
//               <DashboardCard
//                 key={cardData.id}
//                 {...cardData}
//                 isLoading={loading}
//                 animateValue={true}
//               />
//             ))}
//           </Box>
//           <Box display="flex" justifyContent="flex-end" sx={{ ml: { xs: 0, md: '260px' } }}>
//            <Box sx={{ width: '100%', maxWidth: 400 }}>
//             <Notification />
//            </Box>
//          </Box>



//           {/* Error state display */}
//           {error && !loading && (
//             <Box
//               sx={{
//                 mt: 3,
//                 p: 3,
//                 backgroundColor: theme.palette.error.light,
//                 borderRadius: 2,
//                 border: `1px solid ${theme.palette.error.main}`,
//               }}
//             >
//               <Typography variant="body1" color="error">
//                 Error loading dashboard data. Please try refreshing the page.
//               </Typography>
//             </Box>
//           )}
//         </Box>
//       </Box>
//     </Box>
//   );