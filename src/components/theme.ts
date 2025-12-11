import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const customConfig = defineConfig({
  globalCss: {
    '*': {
      colorPalette: 'white',
      fontFamily:
        '"Apple SD Gothic Neo", "Noto Sans KR", "맑은 고딕", "Font Awesome 5 Free", monospace',
      fontStyle: 'normal',
      fontWeight: '400',
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
