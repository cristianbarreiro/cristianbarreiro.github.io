/**
 * Configuración general del sitio
 * Edita este archivo para personalizar tu portfolio
 */

export const siteConfig = {
    // Información personal
    name: 'CDEV',
    fullName: 'Cristian Barreiro',
    email: 'cristianbarreirofag@gmail.com',

    // Redes sociales y enlaces
    socialLinks: {
        github: 'https://github.com/cristianbarreiro',
        linkedin: 'https://www.linkedin.com/in/cristian-barreiro-dev',
        twitter: '',
        portfolio: 'https://cristianbarreiro.github.io/',
    },

    // Configuración del tema de Mantine
    // Puedes cambiar el color primario aquí
    // Opciones: blue, cyan, grape, green, indigo, lime, orange, pink, red, teal, violet, yellow
    primaryColor: 'blue',

    // Año de copyright
    copyrightYear: new Date().getFullYear(),

    // [Desactivadores de funcionalidad]
    // Cambia a false para desactivar una función.
    // features: {
    //   enableLightMode: false,  // false = oculta el botón de modo claro, fuerza modo oscuro
    // },
    features: {
        enableLightMode: false,
    },
};

export default siteConfig;
