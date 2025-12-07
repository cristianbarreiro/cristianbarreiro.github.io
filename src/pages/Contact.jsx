/**
 * Página Contact
 * Formulario de contacto con validación básica
 * Conectado a EmailJS para envío de emails
 */

import { useState } from 'react';
import emailjs from '@emailjs/browser';
import {
    Title,
    Text,
    Stack,
    Grid,
    Paper,
    TextInput,
    Textarea,
    Button,
    Group,
    Alert,
    Anchor,
    ThemeIcon,
} from '@mantine/core';
import {
    IconMail,
    IconSend,
    IconCheck,
    IconBrandGithub,
    IconBrandLinkedin,
    IconBrandTwitter,
    IconAlertCircle,
} from '@tabler/icons-react';
import { siteConfig } from '../config/siteConfig';

// Credenciales de EmailJS
const EMAILJS_SERVICE_ID = 'service_0hsjser';
const EMAILJS_TEMPLATE_ID = 'template_pzhzwlq';
const EMAILJS_PUBLIC_KEY = '9JkBfQC-lLp997XZX';

// Estado inicial del formulario
const initialFormState = {
    name: '',
    email: '',
    message: '',
};

function Contact() {
    // Estado del formulario
    const [formData, setFormData] = useState(initialFormState);

    // Estado para errores de validación
    const [errors, setErrors] = useState({});

    // Estado para indicar envío exitoso
    const [submitted, setSubmitted] = useState(false);

    // Estado para indicar error en el envío
    const [submitError, setSubmitError] = useState(false);

    // Estado de carga mientras se envía
    const [loading, setLoading] = useState(false);

    /**
     * Valida el formulario
     * Retorna un objeto con errores (vacío si todo está bien)
     */
    const validateForm = () => {
        const newErrors = {};

        // Validar nombre
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        // Validar email
        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        // Validar mensaje
        if (!formData.message.trim()) {
            newErrors.message = 'El mensaje es requerido';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
        }

        return newErrors;
    };

    /**
     * Manejador de cambio en inputs
     */
    const handleChange = (field) => (event) => {
        setFormData((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));

        // Limpia el error de ese campo cuando el usuario escribe
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }

        // Limpia el error de envío cuando el usuario escribe
        if (submitError) {
            setSubmitError(false);
        }
    };

    /**
     * Manejador de envío del formulario
     * Envía el email usando EmailJS
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validar formulario
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setSubmitError(false);

        try {
            // Enviar email con EmailJS
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                formData,
                EMAILJS_PUBLIC_KEY
            );

            // Éxito
            setSubmitted(true);
            setFormData(initialFormState);

            // Ocultar mensaje de éxito después de 5 segundos
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            // Error al enviar
            console.error('Error al enviar el email:', error);
            setSubmitError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            {/* Encabezado de página */}
            <section aria-label="Contacto">
                <Stack gap="xl">
                    <div>
                        <Title order={1} mb="sm">
                            Contacto
                        </Title>
                        <Text size="lg" c="dimmed">
                            ¿Tienes un proyecto en mente o quieres colaborar? ¡Escríbeme!
                        </Text>
                    </div>
                </Stack>
            </section>

            <Grid mt="xl" gutter="xl">
                {/* Formulario de contacto */}
                <Grid.Col span={{ base: 12, md: 7 }}>
                    <Paper p="xl" radius="md" withBorder>
                        <form onSubmit={handleSubmit}>
                            <Stack gap="md">
                                {/* Mensaje de éxito */}
                                {submitted && (
                                    <Alert
                                        icon={<IconCheck size={16} />}
                                        title="¡Mensaje enviado!"
                                        color="green"
                                        variant="light"
                                    >
                                        Gracias por contactarme. Te responderé lo antes posible.
                                    </Alert>
                                )}

                                {/* Campo nombre */}
                                <TextInput
                                    label="Nombre"
                                    placeholder="Tu nombre"
                                    required
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    error={errors.name}
                                    disabled={loading}
                                />

                                {/* Campo email */}
                                <TextInput
                                    label="Email"
                                    placeholder="tu@email.com"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                    error={errors.email}
                                    disabled={loading}
                                    leftSection={<IconMail size={16} />}
                                />

                                {/* Campo mensaje */}
                                <Textarea
                                    label="Mensaje"
                                    placeholder="Cuéntame sobre tu proyecto o idea..."
                                    required
                                    minRows={5}
                                    value={formData.message}
                                    onChange={handleChange('message')}
                                    error={errors.message}
                                    disabled={loading}
                                />

                                {/* Botón de envío */}
                                <Button
                                    type="submit"
                                    size="md"
                                    loading={loading}
                                    leftSection={<IconSend size={18} />}
                                >
                                    Enviar mensaje
                                </Button>

                                {/* Mensaje de error */}
                                {submitError && (
                                    <Alert
                                        icon={<IconAlertCircle size={16} />}
                                        color="red"
                                        variant="light"
                                        title="Error al enviar"
                                    >
                                        Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.
                                    </Alert>
                                )}
                            </Stack>
                        </form>
                    </Paper>
                </Grid.Col>

                {/* Información de contacto alternativa */}
                <Grid.Col span={{ base: 12, md: 5 }}>
                    <Paper p="xl" radius="md" withBorder h="100%">
                        <Stack gap="lg">
                            <div>
                                <Title order={2} size="h4" mb="sm">
                                    Otras formas de contacto
                                </Title>
                                <Text size="sm" c="dimmed">
                                    También puedes encontrarme en estas plataformas:
                                </Text>
                            </div>

                            {/* Email directo */}
                            <Group gap="md">
                                <ThemeIcon size="lg" radius="md" variant="light">
                                    <IconMail size={20} />
                                </ThemeIcon>
                                <div>
                                    <Text size="sm" fw={500}>
                                        Email
                                    </Text>
                                    <Anchor href={`mailto:${siteConfig.email}`} size="sm">
                                        {siteConfig.email}
                                    </Anchor>
                                </div>
                            </Group>

                            {/* GitHub */}
                            {siteConfig.socialLinks.github && (
                                <Group gap="md">
                                    <ThemeIcon size="lg" radius="md" variant="light" color="gray">
                                        <IconBrandGithub size={20} />
                                    </ThemeIcon>
                                    <div>
                                        <Text size="sm" fw={500}>
                                            GitHub
                                        </Text>
                                        <Anchor
                                            href={siteConfig.socialLinks.github}
                                            target="_blank"
                                            size="sm"
                                        >
                                            Ver perfil
                                        </Anchor>
                                    </div>
                                </Group>
                            )}

                            {/* LinkedIn */}
                            {siteConfig.socialLinks.linkedin && (
                                <Group gap="md">
                                    <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                                        <IconBrandLinkedin size={20} />
                                    </ThemeIcon>
                                    <div>
                                        <Text size="sm" fw={500}>
                                            LinkedIn
                                        </Text>
                                        <Anchor
                                            href={siteConfig.socialLinks.linkedin}
                                            target="_blank"
                                            size="sm"
                                        >
                                            Conectar
                                        </Anchor>
                                    </div>
                                </Group>
                            )}

                            {/* Twitter */}
                            {siteConfig.socialLinks.twitter && (
                                <Group gap="md">
                                    <ThemeIcon size="lg" radius="md" variant="light" color="cyan">
                                        <IconBrandTwitter size={20} />
                                    </ThemeIcon>
                                    <div>
                                        <Text size="sm" fw={500}>
                                            Twitter
                                        </Text>
                                        <Anchor
                                            href={siteConfig.socialLinks.twitter}
                                            target="_blank"
                                            size="sm"
                                        >
                                            Seguir
                                        </Anchor>
                                    </div>
                                </Group>
                            )}
                        </Stack>
                    </Paper>
                </Grid.Col>
            </Grid>
        </main>
    );
}

export default Contact;
