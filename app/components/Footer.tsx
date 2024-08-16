import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <Box
      component={'footer'}
      sx={{
        marginTop: 2,
      }}
    >
      <Box
        component={'div'}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography variant="caption" component={'p'} color="inherit">
          Desarrollado por
        </Typography>
        <Typography
          component={'a'}
          href="https://ceicol.com/"
          target="_blank"
          color="inherit"
          sx={{
            border: '1px solid currentColor',
            paddingY: 0.5,
            paddingX: 1.5,
            borderRadius: 50,
            backgroundColor: 'white',
          }}
        >
          <Typography
            component={'img'}
            src="/validador/logo.png"
            loading="lazy"
            alt="Logo ceicol"
            width={50}
          />
        </Typography>
      </Box>
      <Typography
        variant="caption"
        component={'p'}
        color="inherit"
        sx={{
          textAlign: 'center',
        }}
      >
        © {currentYear} CEICOL.
      </Typography>
    </Box>
  );
}
