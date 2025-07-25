// src/styles/commonStyles.js

export const mobileStickyBottomBarStyles = {
    position: {
        xs: 'fixed',
        sm: 'fixed',
        md: 'sticky',
    },
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 10,
    py: 2,
    px: 2,
    backgroundColor: '#fff',
    borderTop: '1px solid #ccc',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
    paddingBottom: {
        xs: 'calc(env(safe-area-inset-bottom, 0px) + 50px)',
        sm: 2,
    },
    display: {
        xs: 'flex',
    },
    gap: 2,
};
