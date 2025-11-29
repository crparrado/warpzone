import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Button,
    Hr,
} from '@react-email/components';

interface ResetPasswordEmailProps {
    resetLink: string;
    userName?: string;
}

export const ResetPasswordEmail = ({
    resetLink,
    userName,
}: ResetPasswordEmailProps) => (
    <Html>
        <Head />
        <Preview>Recupera tu acceso a Warpzone 🔐</Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Header Logo Area */}
                <Section style={headerSection}>
                    <Heading style={logoText}>WARPZONE</Heading>
                    <Text style={subLogoText}>REMOTE GAMING SYSTEMS</Text>
                </Section>

                {/* Main Content */}
                <Section style={contentSection}>
                    <Heading style={title}>RECUPERACIÓN DE CLAVE</Heading>
                    <Text style={greeting}>HOLA <span style={neonText}>{userName ? userName.toUpperCase() : 'GAMER'}</span>,</Text>
                    <Text style={paragraph}>
                        Hemos recibido una solicitud para restablecer tu contraseña. Si fuiste tú, haz clic en el botón de abajo para crear una nueva clave.
                    </Text>

                    {/* Link Box */}
                    <Section style={linkBox}>
                        <Button style={button} href={resetLink}>
                            RESTABLECER CONTRASEÑA
                        </Button>
                    </Section>

                    <Text style={instructionText}>
                        Este enlace expirará en 1 hora. Si no solicitaste este cambio, puedes ignorar este correo.
                    </Text>
                </Section>

                <Hr style={hr} />

                <Text style={footer}>
                    WARPZONE CHILE<br />
                    Santiago de Chile
                </Text>
            </Container>
        </Body>
    </Html>
);

// Styles
const main = {
    backgroundColor: '#050505',
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", sans-serif',
    padding: '40px 0',
};

const container = {
    backgroundColor: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '12px',
    overflow: 'hidden',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 0 20px rgba(0, 243, 255, 0.1)',
};

const headerSection = {
    backgroundColor: '#000',
    padding: '30px 0',
    textAlign: 'center' as const,
    borderBottom: '1px solid #333',
};

const logoText = {
    color: '#00f3ff',
    fontSize: '36px',
    fontWeight: '900',
    letterSpacing: '6px',
    margin: '0',
    textShadow: '0 0 10px rgba(0, 243, 255, 0.5)',
};

const subLogoText = {
    color: '#666',
    fontSize: '10px',
    letterSpacing: '4px',
    margin: '5px 0 0',
};

const contentSection = {
    padding: '40px',
    textAlign: 'center' as const,
};

const title = {
    color: '#fff',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 20px',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
};

const greeting = {
    color: '#fff',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 20px',
};

const neonText = {
    color: '#ff00ff',
    textShadow: '0 0 5px rgba(255, 0, 255, 0.5)',
};

const paragraph = {
    color: '#aaa',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0 0 30px',
};

const linkBox = {
    marginBottom: '30px',
};

const button = {
    backgroundColor: '#00f3ff',
    borderRadius: '4px',
    color: '#000',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '16px 30px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    boxShadow: '0 0 15px rgba(0, 243, 255, 0.3)',
};

const instructionText = {
    color: '#666',
    fontSize: '14px',
    lineHeight: '20px',
};

const hr = {
    borderColor: '#222',
    margin: '0',
};

const footer = {
    backgroundColor: '#000',
    color: '#444',
    fontSize: '12px',
    textAlign: 'center' as const,
    padding: '20px',
};

export default ResetPasswordEmail;
