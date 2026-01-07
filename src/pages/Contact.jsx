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
import { useTranslation } from 'react-i18next';

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

/**
 * Sanitiza texto eliminando tags HTML y scripts potencialmente maliciosos
 * También elimina caracteres de control y normaliza espacios
 */
const sanitize = (text) => {
    const stripped = String(text)
        .replace(/<[^>]*>/g, '') // Elimina tags HTML
        .replace(/javascript:/gi, '') // Elimina javascript: URLs
        .replace(/on\w+=/gi, ''); // Elimina event handlers (onclick=, etc.)

    // Elimina caracteres de control sin usar regex (evita `no-control-regex`)
    const withoutControlChars = Array.from(stripped)
        .filter((ch) => {
            const code = ch.charCodeAt(0);
            return code === 9 || code === 10 || code === 13 || code >= 32;
        })
        .join('');

    return withoutControlChars.trim();
};

function Contact() {
    const { t } = useTranslation();

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
            newErrors.name = t('contact.validation.nameRequired');
        }

        // Validar email
        if (!formData.email.trim()) {
            newErrors.email = t('contact.validation.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('contact.validation.emailInvalid');
        }

        // Validar mensaje
        if (!formData.message.trim()) {
            newErrors.message = t('contact.validation.messageRequired');
        } else if (formData.message.trim().length < 10) {
            newErrors.message = t('contact.validation.messageMin');
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
            // Sanitizar datos antes de enviar
            const sanitizedData = {
                name: sanitize(formData.name),
                email: sanitize(formData.email),
                message: sanitize(formData.message),
            };

            // Enviar email con EmailJS
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                sanitizedData,
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
            <section aria-label={t('contact.aria')}>
                <Stack gap="xl">
                    <div>
                        <Title order={1} mb="sm">
                            {t('contact.title')}
                        </Title>
                        <Text size="lg" c="dimmed">
                            {t('contact.subtitle')}
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
                                        title={t('contact.successTitle')}
                                        color="green"
                                        variant="light"
                                    >
                                        {t('contact.successBody')}
                                    </Alert>
                                )}

                                {/* Campo nombre */}
                                <TextInput
                                    label={t('contact.nameLabel')}
                                    placeholder={t('contact.namePlaceholder')}
                                    required
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    error={errors.name}
                                    disabled={loading}
                                />

                                {/* Campo email */}
                                <TextInput
                                    label={t('contact.emailLabel')}
                                    placeholder={t('contact.emailPlaceholder')}
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
                                    label={t('contact.messageLabel')}
                                    placeholder={t('contact.messagePlaceholder')}
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
                                    {t('contact.send')}
                                </Button>

                                {/* Mensaje de error */}
                                {submitError && (
                                    <Alert
                                        icon={<IconAlertCircle size={16} />}
                                        color="red"
                                        variant="light"
                                        title={t('contact.errorTitle')}
                                    >
                                        {t('contact.errorBody')}
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
                                    {t('contact.otherWaysTitle')}
                                </Title>
                                <Text size="sm" c="dimmed">
                                    {t('contact.otherWaysSubtitle')}
                                </Text>
                            </div>

                            {/* Email directo */}
                            <Group gap="md">
                                <ThemeIcon size="lg" radius="md" variant="light">
                                    <IconMail size={20} />
                                </ThemeIcon>
                                <div>
                                    <Text size="sm" fw={500}>
                                        {t('contact.directEmail')}
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
                                            {t('contact.viewProfile')}
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
                                            {t('contact.connect')}
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
                                            {t('contact.follow')}
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
