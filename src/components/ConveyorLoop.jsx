import { motion } from 'framer-motion';
import { useMantineColorScheme, Box } from '@mantine/core';

const MotionDiv = motion.div;

export const ConveyorLoop = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box
      w={64}
      h={12}
      style={{
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 999,
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.18)' : 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      <MotionDiv
        style={{
          display: 'flex',
          height: '100%',
          gap: 8,
          position: 'absolute',
          top: 0,
          alignItems: 'center',
        }}
        animate={{ x: [0, -32] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              backgroundColor: 'var(--mantine-primary-color-filled)',
              borderRadius: 999,
              flexShrink: 0,
            }}
          />
        ))}
      </MotionDiv>
    </Box>
  );
};
